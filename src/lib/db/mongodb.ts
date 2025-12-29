import { MongoClient, Db } from 'mongodb';

// Server-only guard
if (typeof window !== 'undefined') {
  throw new Error('Database operations can only be used on the server');
}

interface MongoCache {
  client: MongoClient | null;
  db: Db | null;
}

declare global {
  var mongo: MongoCache | undefined;
}

const cached: MongoCache = global.mongo || { client: null, db: null };

if (!global.mongo) {
  global.mongo = cached;
}

export default async function connectDB(): Promise<Db> {
  // Return existing connection if available
  if (cached.db && cached.client) {
    return cached.db;
  }

  // Get connection string from environment
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quizapp';
  const MONGODB_DB = process.env.MONGODB_DB || 'quizapp';

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is required');
  }

  // Create new connection
  const client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });

  try {
    await client.connect();
    console.log('✅ MongoDB connected');
    
    cached.client = client;
    cached.db = client.db(MONGODB_DB);
    
    return cached.db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw new Error(`Failed to connect to MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
