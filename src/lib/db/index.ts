/**
 * MongoDB Database Layer using Native MongoDB Driver
 * 
 * All database operations use MongoDB native driver
 * SERVER-ONLY: This module cannot be imported in client components
 */

// Mark this as server-only to prevent client-side bundling
if (typeof window !== 'undefined') {
  throw new Error('Database operations can only be used on the server');
}

import connectDB from './mongodb';
import { User, Survey, UserSurveyCompletion, DailyLimit, AdConfig, LinkShortener, AnalyticsEvent, VideoAdReward, OfferwallTransaction } from '@/types';
import { ObjectId } from 'mongodb';

// Helper to convert MongoDB document to plain object with string ID
function toPlainObject<T extends { _id: ObjectId; [key: string]: any }>(doc: T | null): Omit<T, '_id'> & { id: string } | null {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { ...rest, id: _id.toString() } as Omit<T, '_id'> & { id: string };
}

// Helper to check if a string is a valid MongoDB ObjectId format
function isValidObjectId(id: string): boolean {
  return ObjectId.isValid(id) && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id);
}

// Helper to convert string ID to ObjectId
// Handles both ObjectId format and UUID/string format
function toObjectId(id: string): ObjectId {
  if (isValidObjectId(id)) {
    try {
      return new ObjectId(id);
    } catch {
      throw new Error(`Invalid ObjectId: ${id}`);
    }
  }
  // If it's not a valid ObjectId format (e.g., UUID), throw a more descriptive error
  throw new Error(`ID is not a valid MongoDB ObjectId format: ${id}. Expected 24 hex characters, got ${id.length} characters.`);
}

// ==================== USERS ====================

export async function getUserById(id: string): Promise<User | null> {
  const db = await connectDB();
  
  // Try ObjectId first if it's a valid format
  if (isValidObjectId(id)) {
    const user = await db.collection('users').findOne({ _id: toObjectId(id) });
    return toPlainObject(user) as User | null;
  }
  
  // If not ObjectId format, try querying by id field (for UUIDs or other string IDs)
  const user = await db.collection('users').findOne({ id });
  if (user) {
    // Convert MongoDB document to User type
    const { _id, ...rest } = user as any;
    return { ...rest, id: rest.id || _id?.toString() || id } as User;
  }
  
  // Also try _id as string (in case UUID was stored as string in _id)
  const userByStringId = await db.collection('users').findOne({ _id: id as any });
  if (userByStringId) {
    const { _id: docId, ...rest } = userByStringId as any;
    return { ...rest, id: docId?.toString() || id } as User;
  }
  
  return null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await connectDB();
  const user = await db.collection('users').findOne({ email });
  return toPlainObject(user) as User | null;
}

export async function getUserByOAuthProvider(provider: string, providerId: string): Promise<User | null> {
  const db = await connectDB();
  const user = await db.collection('users').findOne({ 
    oauthProvider: provider,
    oauthProviderId: providerId 
  });
  return toPlainObject(user) as User | null;
}

export async function createUser(user: Omit<User, 'id' | 'createdAt' | 'lastResetDate'>): Promise<User> {
  const db = await connectDB();
  const newUser = {
    ...user,
    createdAt: new Date().toISOString(),
    lastResetDate: new Date().toISOString().split('T')[0],
  };
  const result = await db.collection('users').insertOne(newUser);
  return { ...newUser, id: result.insertedId.toString() } as User;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  const db = await connectDB();
  
  // Try ObjectId first if it's a valid format
  let result;
  if (isValidObjectId(id)) {
    result = await db.collection('users').findOneAndUpdate(
      { _id: toObjectId(id) },
      { $set: updates },
      { returnDocument: 'after' }
    );
    return toPlainObject(result) as User | null;
  }
  
  // If not ObjectId format, try updating by id field
  result = await db.collection('users').findOneAndUpdate(
    { id },
    { $set: updates },
    { returnDocument: 'after' }
  );
  if (result) {
    const { _id, ...rest } = result as any;
    return { ...rest, id: rest.id || _id?.toString() || id } as User;
  }
  
  // Also try _id as string
  result = await db.collection('users').findOneAndUpdate(
    { _id: id as any },
    { $set: updates },
    { returnDocument: 'after' }
  );
  if (result) {
    const { _id: docId, ...rest } = result as any;
    return { ...rest, id: docId?.toString() || id } as User;
  }
  
  return null;
}

// ==================== SURVEYS ====================

export async function getSurveyById(id: string): Promise<Survey | null> {
  const db = await connectDB();
  const survey = await db.collection('surveys').findOne({ _id: toObjectId(id) });
  return toPlainObject(survey) as Survey | null;
}

export async function getAllSurveys(activeOnly = false): Promise<Survey[]> {
  const db = await connectDB();
  const query = activeOnly ? { isActive: true } : {};
  const surveys = await db.collection('surveys').find(query).toArray();
  return surveys.map(s => toPlainObject(s) as Survey);
}

export async function createSurvey(survey: Omit<Survey, 'id' | 'createdAt' | 'updatedAt'>): Promise<Survey> {
  const db = await connectDB();
  const newSurvey = {
    ...survey,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const result = await db.collection('surveys').insertOne(newSurvey);
  return { ...newSurvey, id: result.insertedId.toString() } as Survey;
}

export async function updateSurvey(id: string, updates: Partial<Survey>): Promise<Survey | null> {
  const db = await connectDB();
  const result = await db.collection('surveys').findOneAndUpdate(
    { _id: toObjectId(id) },
    { $set: { ...updates, updatedAt: new Date().toISOString() } },
    { returnDocument: 'after' }
  );
  return toPlainObject(result) as Survey | null;
}

// ==================== COMPLETIONS ====================

export async function recordSurveyCompletion(completion: UserSurveyCompletion): Promise<void> {
  const db = await connectDB();
  const userIdValue = isValidObjectId(completion.userId) ? toObjectId(completion.userId) : completion.userId;
  const surveyIdValue = isValidObjectId(completion.surveyId) ? toObjectId(completion.surveyId) : completion.surveyId;
  
  await db.collection('usersurveycompletions').insertOne({
    userId: userIdValue,
    surveyId: surveyIdValue,
    completedAt: completion.completedAt,
    responses: completion.responses,
    userData: completion.userData,
  });
}

export async function hasUserCompletedSurvey(userId: string, surveyId: string, date: string): Promise<boolean> {
  const db = await connectDB();
  const userIdValue = isValidObjectId(userId) ? toObjectId(userId) : userId;
  const limit = await db.collection('dailylimits').findOne({
    userId: userIdValue,
    date,
  });
  return limit?.surveysCompleted?.includes(surveyId) || false;
}

// ==================== DAILY LIMITS ====================

export async function getDailyLimit(userId: string, date: string): Promise<DailyLimit> {
  const db = await connectDB();
  const userIdValue = isValidObjectId(userId) ? toObjectId(userId) : userId;
  let limit = await db.collection('dailylimits').findOne({
    userId: userIdValue,
    date,
  });

  if (!limit) {
    const newLimit = {
      userId: userIdValue,
      date,
      surveysCompleted: [],
      videoAdsWatched: 0,
    };
    await db.collection('dailylimits').insertOne(newLimit);
    return {
      userId,
      date,
      surveysCompleted: [],
      videoAdsWatched: 0,
    };
  }

  return {
    userId: typeof limit.userId === 'object' ? limit.userId.toString() : limit.userId || userId,
    date: limit.date,
    surveysCompleted: limit.surveysCompleted || [],
    videoAdsWatched: limit.videoAdsWatched || 0,
  };
}

export async function updateDailyLimit(userId: string, date: string, updates: Partial<DailyLimit>): Promise<DailyLimit> {
  const db = await connectDB();
  const userIdValue = isValidObjectId(userId) ? toObjectId(userId) : userId;
  
  let limit = await db.collection('dailylimits').findOne({
    userId: userIdValue,
    date,
  });

  if (!limit) {
    const newLimit = {
      userId: userIdValue,
      date,
      surveysCompleted: updates.surveysCompleted || [],
      videoAdsWatched: updates.videoAdsWatched ?? 0,
    };
    await db.collection('dailylimits').insertOne(newLimit);
    return {
      userId,
      date,
      surveysCompleted: updates.surveysCompleted || [],
      videoAdsWatched: updates.videoAdsWatched ?? 0,
    };
  }

  const updateDoc: any = {};
  if (updates.surveysCompleted) {
    updateDoc.$addToSet = { surveysCompleted: { $each: updates.surveysCompleted } };
  }
  if (updates.videoAdsWatched !== undefined) {
    updateDoc.$set = { ...updateDoc.$set, videoAdsWatched: updates.videoAdsWatched };
  }

  if (Object.keys(updateDoc).length > 0) {
    await db.collection('dailylimits').updateOne(
      { userId: userIdValue, date },
      updateDoc
    );
  }

  const updated = await db.collection('dailylimits').findOne({
    userId: userIdValue,
    date,
  });

  return {
    userId,
    date: updated!.date,
    surveysCompleted: updated!.surveysCompleted || [],
    videoAdsWatched: updated!.videoAdsWatched || 0,
  };
}

// ==================== AD CONFIG ====================

export async function getAdConfigs(): Promise<AdConfig[]> {
  const db = await connectDB();
  const configs = await db.collection('adconfigs').find({}).toArray();
  return configs.map(c => toPlainObject(c) as AdConfig);
}

export async function getActiveAdConfigs(type?: string, position?: string): Promise<AdConfig[]> {
  const db = await connectDB();
  const query: any = { isActive: true };
  if (type) query.type = type;
  if (position) query.position = position;
  
  const configs = await db.collection('adconfigs').find(query).sort({ priority: -1 }).toArray();
  return configs.map(c => toPlainObject(c) as AdConfig);
}

export async function createAdConfig(config: Omit<AdConfig, 'id'>): Promise<AdConfig> {
  const db = await connectDB();
  const result = await db.collection('adconfigs').insertOne(config);
  return { ...config, id: result.insertedId.toString() } as AdConfig;
}

// ==================== LINK SHORTENERS ====================

export async function getLinkShorteners(): Promise<LinkShortener[]> {
  const db = await connectDB();
  const shorteners = await db.collection('linkshorteners').find({}).toArray();
  return shorteners.map(s => toPlainObject(s) as LinkShortener);
}

export async function getActiveShorteners(): Promise<LinkShortener[]> {
  const db = await connectDB();
  const shorteners = await db.collection('linkshorteners').find({ isActive: true }).sort({ priority: -1 }).toArray();
  return shorteners.map(s => toPlainObject(s) as LinkShortener);
}

export async function createShortener(shortener: Omit<LinkShortener, 'id'>): Promise<LinkShortener> {
  const db = await connectDB();
  const result = await db.collection('linkshorteners').insertOne(shortener);
  return { ...shortener, id: result.insertedId.toString() } as LinkShortener;
}

// ==================== ANALYTICS ====================

export async function logAnalyticsEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<void> {
  const db = await connectDB();
  const userIdValue = event.userId 
    ? (isValidObjectId(event.userId) ? toObjectId(event.userId) : event.userId)
    : undefined;
  await db.collection('analyticsevents').insertOne({
    ...event,
    userId: userIdValue,
    timestamp: new Date().toISOString(),
  });
}

export async function getAnalyticsEvents(filters?: {
  type?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}): Promise<AnalyticsEvent[]> {
  const db = await connectDB();
  const query: any = {};
  
  if (filters) {
    if (filters.type) query.type = filters.type;
    if (filters.userId) {
      query.userId = isValidObjectId(filters.userId) 
        ? toObjectId(filters.userId) 
        : filters.userId;
    }
    if (filters.startDate || filters.endDate) {
      query.timestamp = {};
      if (filters.startDate) query.timestamp.$gte = filters.startDate;
      if (filters.endDate) query.timestamp.$lte = filters.endDate;
    }
  }
  
  const events = await db.collection('analyticsevents').find(query).sort({ timestamp: -1 }).toArray();
  return events.map(e => toPlainObject(e) as AnalyticsEvent);
}

// ==================== VIDEO ADS ====================

export async function getVideoAdReward(userId: string, date: string): Promise<VideoAdReward> {
  const db = await connectDB();
  const userIdValue = isValidObjectId(userId) ? toObjectId(userId) : userId;
  let reward = await db.collection('videoadrewards').findOne({
    userId: userIdValue,
    date,
  });

  if (!reward) {
    const newReward = {
      userId: userIdValue,
      date,
      count: 0,
      timestamps: [],
    };
    await db.collection('videoadrewards').insertOne(newReward);
    return {
      userId,
      date,
      count: 0,
      timestamps: [],
    };
  }

  return {
    userId: typeof reward.userId === 'object' ? reward.userId.toString() : reward.userId || userId,
    date: reward.date,
    count: reward.count || 0,
    timestamps: reward.timestamps || [],
  };
}

export async function incrementVideoAdReward(userId: string, date: string, timestamp: string): Promise<VideoAdReward> {
  const db = await connectDB();
  const userIdValue = isValidObjectId(userId) ? toObjectId(userId) : userId;
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const update = {
    $inc: { count: 1 },
    $push: { timestamps: { $each: [timestamp], $slice: -200 } },
    $pull: { timestamps: { $lt: cutoff } },
  } as any;
  
  const result = await db.collection('videoadrewards').findOneAndUpdate(
    { userId: userIdValue, date },
    update,
    { upsert: true, returnDocument: 'after' }
  );

  return {
    userId,
    date: result!.date,
    count: result!.count || 0,
    timestamps: result!.timestamps || [],
  };
}

// ==================== OFFERWALL TRANSACTIONS ====================

/**
 * Check if a transaction has already been processed
 * Prevents duplicate point awards from the same transaction
 */
export async function hasTransactionBeenProcessed(
  provider: string,
  transactionId: string
): Promise<boolean> {
  const db = await connectDB();
  const transaction = await db.collection('offerwalltransactions').findOne({
    provider,
    transactionId,
    status: 'completed',
  });
  return !!transaction;
}

/**
 * Record an offerwall transaction
 */
export async function recordOfferwallTransaction(
  transaction: Omit<OfferwallTransaction, 'id'>
): Promise<OfferwallTransaction> {
  const db = await connectDB();
  const userIdValue = isValidObjectId(transaction.userId) ? toObjectId(transaction.userId) : transaction.userId;
  
  const doc: any = {
    userId: userIdValue,
    provider: transaction.provider,
    transactionId: transaction.transactionId,
    offerId: transaction.offerId,
    offerName: transaction.offerName,
    rewardAmount: transaction.rewardAmount,
    pointsAwarded: transaction.pointsAwarded,
    currency: transaction.currency,
    completedAt: transaction.completedAt || new Date().toISOString(),
    status: transaction.status || 'pending',
    metadata: transaction.metadata || {},
  };
  
  const result = await db.collection('offerwalltransactions').insertOne(doc);
  return {
    ...transaction,
    id: result.insertedId.toString(),
  };
}

/**
 * Update transaction status
 */
export async function updateOfferwallTransactionStatus(
  transactionId: string,
  status: 'pending' | 'completed' | 'failed'
): Promise<void> {
  const db = await connectDB();
  
  // Find by transactionId field instead of _id if it's not an ObjectId
  const query: any = isValidObjectId(transactionId) 
    ? { _id: toObjectId(transactionId) }
    : { transactionId }; // Search by transactionId field if not ObjectId
  
  await db.collection('offerwalltransactions').updateOne(
    query,
    { $set: { status } }
  );
}

/**
 * Get all offerwall transactions for a user
 */
export async function getUserOfferwallTransactions(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<OfferwallTransaction[]> {
  const db = await connectDB();
  const userIdValue = isValidObjectId(userId) ? toObjectId(userId) : userId;
  
  const transactions = await db.collection('offerwalltransactions')
    .find({ userId: userIdValue })
    .sort({ completedAt: -1 })
    .limit(limit)
    .skip(offset)
    .toArray();
  
  return transactions.map(t => {
    const { _id, userId: uid, ...rest } = t as any;
    return {
      ...rest,
      id: _id.toString(),
      userId: typeof uid === 'object' ? uid.toString() : uid || userId,
    } as OfferwallTransaction;
  });
}

/**
 * Get user's offerwall completion statistics
 */
export async function getUserOfferwallStats(userId: string): Promise<{
  totalCompletions: number;
  totalPointsEarned: number;
  byProvider: Record<string, { count: number; points: number }>;
}> {
  const db = await connectDB();
  const userIdValue = isValidObjectId(userId) ? toObjectId(userId) : userId;
  
  const transactions = await db.collection('offerwalltransactions')
    .find({ userId: userIdValue, status: 'completed' })
    .toArray();
  
  const stats = {
    totalCompletions: transactions.length,
    totalPointsEarned: 0,
    byProvider: {} as Record<string, { count: number; points: number }>,
  };
  
  transactions.forEach((t: any) => {
    const provider = t.provider || 'unknown';
    const points = t.pointsAwarded || 0;
    
    stats.totalPointsEarned += points;
    
    if (!stats.byProvider[provider]) {
      stats.byProvider[provider] = { count: 0, points: 0 };
    }
    stats.byProvider[provider].count += 1;
    stats.byProvider[provider].points += points;
  });
  
  return stats;
}
