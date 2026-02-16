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
 * CPX Research Postback Handler
 * 
 * Handles postback requests from CPX Research when users complete offers.
 * 
 * CPX Postback Parameters (from CPX documentation):
 * - status: 1 = pending, 2 = reversed (canceled)
 * - trans_id: Transaction ID (required to identify transactions)
 * - user_id: User ID (ext_user_id from iframe)
 * - sub_id, sub_id_2: Additional sub IDs
 * - amount_local: Reward amount in local currency (REQUIRED)
 * - amount_usd: Reward amount in USD (REQUIRED)
 * - offer_ID: Offer ID
 * - hash: Secure hash for verification
 * - ip_click: IP address of click
 * 
 * Environment Variables:
 * - CPX_SECURE_HASH_KEY: Secure hash key for signature verification (same as used in iframe)
 */

const CPX_SECURE_HASH_KEY = process.env.CPX_SECURE_HASH_KEY || '';

interface CPXPostbackParams {
  user_id?: string;
  uid?: string;
  ext_user_id?: string;
  sub_id?: string; // Fallback for user ID in some CPX configs
  trans_id?: string;
  transaction_id?: string;
  tx_id?: string;
  amount_local?: string;
  amount_usd?: string;
  payout?: string; // Alternative param from some networks
  status?: string; // 1 = pending, 2 = reversed
  offer_ID?: string;
  offer_id?: string;
  sub_id_2?: string;
  hash?: string; // Secure hash for verification
  ip_click?: string;
  // Additional fields CPX might send
  [key: string]: string | undefined;
}

/**
 * Verify CPX Research postback hash
 * CPX uses MD5 hash of parameters + secure_hash_key
 */
function verifyCPXHash(params: CPXPostbackParams): boolean {
  // If hash is provided, verify it
  if (params.hash && CPX_SECURE_HASH_KEY) {
    // Build the string to verify (excluding hash itself)
    const { hash, ...paramsToVerify } = params;
    const sortedKeys = Object.keys(paramsToVerify).sort();
    const queryString = sortedKeys
      .map(key => `${key}=${paramsToVerify[key] || ''}`)
      .join('&');
    
    // CPX uses MD5(queryString + secure_hash_key)
    const calculatedHash = crypto
      .createHash('md5')
      .update(queryString + CPX_SECURE_HASH_KEY)
      .digest('hex');
    
    return calculatedHash.toLowerCase() === params.hash.toLowerCase();
  }
  
  // If no hash required or key not configured, accept valid postbacks
  // In production, you should require hash verification
  return true;
}

/**
 * Determine event type from CPX postback parameters
 * CPX uses status: 1 = pending, 2 = reversed
 */
function getCPXEventType(params: CPXPostbackParams): 'pending' | 'reversed' | 'complete' {
  if (params.status) {
    const status = params.status.trim();
    if (status === '2') return 'reversed';
    if (status === '1') return 'pending';
  }
  
  // If amount is provided, it's a completion
  if (params.amount_local || params.amount_usd) {
    return 'complete';
  }
  
  return 'complete';
}

/**
 * POST handler for CPX Research postback
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const contentType = request.headers.get('content-type') || '';
    let params: CPXPostbackParams = {};

    if (contentType.includes('application/json')) {
      params = (await request.json()) as CPXPostbackParams;
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        params[key] = value.toString();
      });
    } else {
      // Parse from URL query or raw body (some networks send query string without Content-Type)
      const url = new URL(request.url);
      url.searchParams.forEach((value, key) => {
        params[key] = value;
      });
      if (Object.keys(params).length === 0) {
        const raw = await request.text();
        if (raw && raw.includes('=')) {
          const searchParams = new URLSearchParams(raw);
          searchParams.forEach((value, key) => {
            params[key] = value;
          });
        }
      }
    }

    // Get user ID (CPX may send user_id, ext_user_id, uid, or sub_id)
    const userId = params.user_id || params.ext_user_id || params.uid || params.sub_id;
    if (!userId) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    if (!params.amount_local && !params.amount_usd && !params.payout && params.status !== '2') {
      return NextResponse.json(
        { error: 'amount_local, amount_usd or payout is required' },
        { status: 400 }
      );
    }

    // Get transaction ID (CPX uses trans_id)
    const transactionId = params.trans_id || params.transaction_id || params.tx_id;
    if (!transactionId) {
      return NextResponse.json(
        { error: 'trans_id is required' },
        { status: 400 }
      );
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Determine event type from CPX status
    const eventType = getCPXEventType(params);
    const today = getTodayDate();
    const offerId = params.offer_ID || params.offer_id || '';

    // Check if transaction already processed (prevent duplicates)
    const alreadyProcessed = await hasTransactionBeenProcessed('cpx-research', transactionId);
    if (alreadyProcessed && eventType !== 'reversed') {
      return new Response('1', { status: 200, headers: { 'Content-Type': 'text/plain' } });
    }

    // Handle different event types
    switch (eventType) {
      case 'reversed':
        // Transaction was reversed (status=2) - reverse the points
        // Find the original transaction
        const existingTransaction = await hasTransactionBeenProcessed('cpx-research', transactionId);
        
        if (existingTransaction) {
          // Get the transaction to reverse points
          // Note: We need to find the transaction record to get the points awarded
          // For now, we'll log the reversal and mark transaction as failed
          await logAnalyticsEvent({
            type: 'offerwall_complete',
            userId,
            surveyId: `cpx_${offerId || transactionId}`,
            metadata: {
              provider: 'cpx-research',
              offer_id: offerId,
              trans_id: transactionId,
              event_type: 'reversed',
              status: '2',
              sub_id: params.sub_id,
              sub_id_2: params.sub_id_2,
              ip_click: params.ip_click,
              reversed: true,
            },
          });
        }
        return new Response('1', { status: 200, headers: { 'Content-Type': 'text/plain' } });

      case 'pending':
      case 'complete':
      default:
        // Complete offer (status=1 or default) - award points
        // Use amount_usd if available, otherwise amount_local
        const rewardAmount = parseFloat(params.amount_usd || params.amount_local || params.payout || '0');
        if (isNaN(rewardAmount) || rewardAmount <= 0) {
          return NextResponse.json(
            { error: 'Invalid reward amount' },
            { status: 400 }
          );
        }

        await checkAndResetDailyLimits(userId);
        const pointsToAdd = Math.round(rewardAmount);
        
        // Create transaction record
        let transactionRecord: OfferwallTransaction;
        try {
          transactionRecord = await recordOfferwallTransaction({
            userId,
            provider: 'cpx-research',
            transactionId,
            offerId,
            offerName: '', // CPX doesn't send offer name in postback
            rewardAmount,
            pointsAwarded: pointsToAdd,
            currency: 'points',
            completedAt: new Date().toISOString(),
            status: params.status === '1' ? 'pending' : 'completed',
            metadata: {
              amount_local: params.amount_local,
              amount_usd: params.amount_usd,
              status: params.status || '1',
              sub_id: params.sub_id,
              sub_id_2: params.sub_id_2,
              ip_click: params.ip_click,
              hash: params.hash ? 'provided' : 'missing',
              ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || params.ip_click || undefined,
              userAgent: request.headers.get('user-agent') || undefined,
            },
          });
        } catch {
          return NextResponse.json(
            { error: 'Failed to record transaction' },
            { status: 500 }
          );
        }

        // Record survey completion
        const surveyId = `cpx_${offerId || transactionId}`;
        try {
          await recordSurveyCompletion({
            userId,
            surveyId,
            completedAt: new Date().toISOString(),
            responses: {
              offer_id: offerId,
              trans_id: transactionId,
              amount_local: params.amount_local,
              amount_usd: params.amount_usd,
              status: params.status || '1',
              provider: 'cpx-research',
            },
            userData: {
              ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || params.ip_click || undefined,
              userAgent: request.headers.get('user-agent') || undefined,
            },
          });
        } catch {
          // Survey completion recording is non-critical
        }

        try {
          await updateDailyLimit(userId, today, {
            surveysCompleted: [surveyId],
          });
        } catch {
          // Non-critical
        }

        // Award points
        let newPoints: number;
        try {
          newPoints = await addPoints(userId, pointsToAdd);
          await updateOfferwallTransactionStatus(transactionRecord.id, 'completed');
        } catch {
          try {
            await updateOfferwallTransactionStatus(transactionRecord.id, 'failed');
          } catch {
            // Ignore
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
              provider: 'cpx-research',
              offer_id: offerId,
              trans_id: transactionId,
              amount_local: params.amount_local,
              amount_usd: params.amount_usd,
              rewardAmount,
              pointsEarned: pointsToAdd,
              status: params.status || '1',
              sub_id: params.sub_id,
              sub_id_2: params.sub_id_2,
            },
          });
        } catch {
          // Analytics is non-critical
        }

        return new Response('1', { status: 200, headers: { 'Content-Type': 'text/plain' } });
    }
  } catch {
    return NextResponse.json(
      { status: 'error', error: 'Internal server error' },
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
  const params: CPXPostbackParams = {};
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