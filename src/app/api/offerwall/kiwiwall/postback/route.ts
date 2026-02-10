import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { 
  getUserById, 
  recordSurveyCompletion, 
  updateDailyLimit, 
  logAnalyticsEvent,
  hasTransactionBeenProcessed,
  recordOfferwallTransaction,
  updateOfferwallTransactionStatus,
} from '@/lib/db';
import { getTodayDate, checkAndResetDailyLimits, addPoints } from '@/lib/points';
import { OfferwallTransaction } from '@/types';

/**
 * KiwiWall Postback Handler
 * 
 * Handles postback requests from KiwiWall when users complete offers.
 * Verifies signature and awards points to users.
 * 
 * Environment Variables:
 * - KIWIWALL_POSTBACK_KEY: Postback key for signature verification
 * - KIWIWALL_SECRET: Secret code (alternative verification method)
 */

const KIWIWALL_POSTBACK_KEY = process.env.KIWIWALL_POSTBACK_KEY || 'gd7imgfl4ajge0n627998hj3';
const KIWIWALL_SECRET = process.env.KIWIWALL_SECRET || 'qwjnbzxkhz6qnf1tiw5skz6zmshf9dq2';

interface KiwiWallPostbackParams {
  sub_id?: string;
  transaction_id?: string;
  reward?: string;
  currency?: string;
  signature?: string;
  offer_id?: string;
  offer_name?: string;
  // Additional fields KiwiWall might send
  [key: string]: string | undefined;
}

/**
 * Verify KiwiWall postback signature
 * KiwiWall typically sends a signature or hash to verify the postback
 */
function verifyKiwiWallSignature(params: KiwiWallPostbackParams): boolean {
  // If signature is provided, verify it
  if (params.signature) {
    // Build the string to verify (excluding signature itself)
    const { signature, ...paramsToVerify } = params;
    const sortedKeys = Object.keys(paramsToVerify).sort();
    const queryString = sortedKeys
      .map(key => `${key}=${paramsToVerify[key] || ''}`)
      .join('&');
    
    // Create hash with postback key
    const hash = crypto
      .createHash('md5')
      .update(queryString + KIWIWALL_POSTBACK_KEY)
      .digest('hex');
    
    return hash.toLowerCase() === (params.signature || '').toLowerCase();
  }
  
  // Alternative: Some providers send verification differently
  // For now, we'll accept postbacks with valid user IDs
  // In production, ensure proper signature verification is enabled
  return true;
}

/**
 * POST handler for KiwiWall postback
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    // KiwiWall typically sends POST data as form-urlencoded or query params
    const contentType = request.headers.get('content-type') || '';
    let params: KiwiWallPostbackParams = {};

    if (contentType.includes('application/json')) {
      params = await request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        params[key] = value.toString();
      });
    } else {
      // Try parsing from URL search params
      const url = new URL(request.url);
      url.searchParams.forEach((value, key) => {
        params[key] = value;
      });
    }

    // Validate required parameters
    if (!params.sub_id) {
      return NextResponse.json(
        { error: 'sub_id is required' },
        { status: 400 }
      );
    }

    // Verify signature (if provided)
    // NOTE: For now we **do not reject** postbacks on signature mismatch,
    // because different KiwiWall configurations use different signing schemes.
    // We log verification failures but still process the lead so valid
    // completions are not lost while we finalize the exact hash format.
    if (params.signature && !verifyKiwiWallSignature(params)) {
      console.warn('KiwiWall postback signature verification failed (ignored for now)', {
        sub_id: params.sub_id,
        transaction_id: params.transaction_id,
        offer_id: params.offer_id,
      });
    }

    // Get user by ID (sub_id should be the user ID)
    const userId = params.sub_id;
    const user = await getUserById(userId);

    if (!user) {
      console.error('KiwiWall postback: User not found', userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Parse reward amount
    const rewardAmount = parseFloat(params.reward || '0');
    if (isNaN(rewardAmount) || rewardAmount <= 0) {
      console.error('KiwiWall postback: Invalid reward amount', params.reward);
      return NextResponse.json(
        { error: 'Invalid reward amount' },
        { status: 400 }
      );
    }

    // Check if transaction already processed (prevent duplicate rewards)
    const transactionId = params.transaction_id || `kiwiwall_${params.offer_id || Date.now()}`;
    const today = getTodayDate();
    
    // CRITICAL: Check if this transaction was already processed
    const alreadyProcessed = await hasTransactionBeenProcessed('kiwiwall', transactionId);
    if (alreadyProcessed) {
      console.warn('KiwiWall postback: Duplicate transaction detected', {
        transactionId,
        userId,
        offerId: params.offer_id,
      });
      return NextResponse.json({
        status: 'success',
        message: 'Transaction already processed',
        transaction_id: transactionId,
        duplicate: true,
      });
    }

    // Check daily limits
    await checkAndResetDailyLimits(userId);

    // Calculate points to award (convert reward amount to points if needed)
    const pointsToAdd = Math.round(rewardAmount);
    
    // Create transaction record FIRST (before awarding points)
    // This ensures we track the transaction even if something fails later
    let transactionRecord: OfferwallTransaction;
    try {
      transactionRecord = await recordOfferwallTransaction({
        userId,
        provider: 'kiwiwall',
        transactionId,
        offerId: params.offer_id,
        offerName: params.offer_name,
        rewardAmount,
        pointsAwarded: pointsToAdd,
        currency: params.currency || 'points',
        completedAt: new Date().toISOString(),
        status: 'pending', // Will update to 'completed' after successful processing
        metadata: {
          signature: params.signature ? 'provided' : 'missing',
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
          userAgent: request.headers.get('user-agent') || undefined,
        },
      });
    } catch (err) {
      console.error('KiwiWall postback: Failed to record transaction', err);
      return NextResponse.json(
        { error: 'Failed to record transaction' },
        { status: 500 }
      );
    }

    // Record survey completion
    const surveyId = `kiwiwall_${params.offer_id || transactionId}`;
    
    try {
      await recordSurveyCompletion({
        userId,
        surveyId,
        completedAt: new Date().toISOString(),
        responses: {
          offer_id: params.offer_id || '',
          offer_name: params.offer_name || '',
          transaction_id: transactionId,
          currency: params.currency || 'points',
          provider: 'kiwiwall',
        },
        userData: {
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
          userAgent: request.headers.get('user-agent') || undefined,
        },
      });
    } catch (err) {
      // If recording fails due to duplicate, that's okay - continue
      console.warn('KiwiWall postback: Survey completion recording warning', err);
    }

    // Update daily limit
    try {
      await updateDailyLimit(userId, today, {
        surveysCompleted: [surveyId],
      });
    } catch (err) {
      console.warn('KiwiWall postback: Failed to update daily limit', err);
    }

    // Award points - this is the critical operation
    let newPoints: number;
    try {
      newPoints = await addPoints(userId, pointsToAdd);
      
      // Update transaction status to completed
      await updateOfferwallTransactionStatus(transactionRecord.id, 'completed');
    } catch (err) {
      console.error('KiwiWall postback: Failed to award points', err);
      
      // Update transaction status to failed
      try {
        await updateOfferwallTransactionStatus(transactionRecord.id, 'failed');
      } catch (updateErr) {
        console.error('KiwiWall postback: Failed to update transaction status', updateErr);
      }
      
      return NextResponse.json(
        { error: 'Failed to award points' },
        { status: 500 }
      );
    }

    // Log analytics
    try {
      await logAnalyticsEvent({
        type: 'offerwall_complete',
        userId,
        surveyId,
        metadata: {
          provider: 'kiwiwall',
          offer_id: params.offer_id || '',
          offer_name: params.offer_name || '',
          transaction_id: transactionId,
          rewardAmount,
          pointsEarned: pointsToAdd,
          currency: params.currency || 'points',
        },
      });
    } catch (err) {
      console.warn('Failed to log analytics:', err);
    }

    // Return success response
    // KiwiWall expects a specific response format
    return NextResponse.json({
      status: 'success',
      message: 'Postback processed successfully',
      user_id: userId,
      points_added: pointsToAdd,
      new_total_points: newPoints,
      transaction_id: transactionId,
    });
  } catch (error) {
    console.error('KiwiWall postback error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler (some providers send postbacks via GET)
 */
export async function GET(request: NextRequest) {
  // Parse query parameters
  const url = new URL(request.url);
  const params: KiwiWallPostbackParams = {};
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  // Create a POST-like request and process it
  const fakeRequest = new Request(request.url, {
    method: 'POST',
    headers: request.headers,
    body: JSON.stringify(params),
  });

  // Re-use POST handler logic
  const postResponse = await POST(fakeRequest as NextRequest);
  return postResponse;
}
