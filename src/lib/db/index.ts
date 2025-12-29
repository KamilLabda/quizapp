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
import { User, Survey, UserSurveyCompletion, DailyLimit, AdConfig, LinkShortener, AnalyticsEvent, VideoAdReward } from '@/types';
import { ObjectId } from 'mongodb';

// Helper to convert MongoDB document to plain object with string ID
function toPlainObject<T extends { _id: ObjectId; [key: string]: any }>(doc: T | null): Omit<T, '_id'> & { id: string } | null {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { ...rest, id: _id.toString() } as Omit<T, '_id'> & { id: string };
}

// Helper to convert string ID to ObjectId
function toObjectId(id: string): ObjectId {
  try {
    return new ObjectId(id);
  } catch {
    throw new Error(`Invalid ObjectId: ${id}`);
  }
}

// ==================== USERS ====================

export async function getUserById(id: string): Promise<User | null> {
  const db = await connectDB();
  const user = await db.collection('users').findOne({ _id: toObjectId(id) });
  return toPlainObject(user) as User | null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await connectDB();
  const user = await db.collection('users').findOne({ email });
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
  const result = await db.collection('users').findOneAndUpdate(
    { _id: toObjectId(id) },
    { $set: updates },
    { returnDocument: 'after' }
  );
  return toPlainObject(result) as User | null;
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
  await db.collection('usersurveycompletions').insertOne({
    userId: toObjectId(completion.userId),
    surveyId: toObjectId(completion.surveyId),
    completedAt: completion.completedAt,
    responses: completion.responses,
    userData: completion.userData,
  });
}

export async function hasUserCompletedSurvey(userId: string, surveyId: string, date: string): Promise<boolean> {
  const db = await connectDB();
  const limit = await db.collection('dailylimits').findOne({
    userId: toObjectId(userId),
    date,
  });
  return limit?.surveysCompleted?.includes(surveyId) || false;
}

// ==================== DAILY LIMITS ====================

export async function getDailyLimit(userId: string, date: string): Promise<DailyLimit> {
  const db = await connectDB();
  let limit = await db.collection('dailylimits').findOne({
    userId: toObjectId(userId),
    date,
  });

  if (!limit) {
    const newLimit = {
      userId: toObjectId(userId),
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
    userId: limit.userId.toString(),
    date: limit.date,
    surveysCompleted: limit.surveysCompleted || [],
    videoAdsWatched: limit.videoAdsWatched || 0,
  };
}

export async function updateDailyLimit(userId: string, date: string, updates: Partial<DailyLimit>): Promise<DailyLimit> {
  const db = await connectDB();
  const userIdObj = toObjectId(userId);
  
  let limit = await db.collection('dailylimits').findOne({
    userId: userIdObj,
    date,
  });

  if (!limit) {
    const newLimit = {
      userId: userIdObj,
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
      { userId: userIdObj, date },
      updateDoc
    );
  }

  const updated = await db.collection('dailylimits').findOne({
    userId: userIdObj,
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
  await db.collection('analyticsevents').insertOne({
    ...event,
    userId: event.userId ? toObjectId(event.userId) : undefined,
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
    if (filters.userId) query.userId = toObjectId(filters.userId);
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
  let reward = await db.collection('videoadrewards').findOne({
    userId: toObjectId(userId),
    date,
  });

  if (!reward) {
    const newReward = {
      userId: toObjectId(userId),
      date,
      count: 0,
    };
    await db.collection('videoadrewards').insertOne(newReward);
    return {
      userId,
      date,
      count: 0,
    };
  }

  return {
    userId: reward.userId.toString(),
    date: reward.date,
    count: reward.count || 0,
  };
}

export async function incrementVideoAdReward(userId: string, date: string): Promise<VideoAdReward> {
  const db = await connectDB();
  const userIdObj = toObjectId(userId);
  
  const result = await db.collection('videoadrewards').findOneAndUpdate(
    { userId: userIdObj, date },
    { $inc: { count: 1 } },
    { upsert: true, returnDocument: 'after' }
  );

  return {
    userId,
    date: result!.date,
    count: result!.count || 0,
  };
}
