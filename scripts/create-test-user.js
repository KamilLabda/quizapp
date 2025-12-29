/**
 * Script to create a test user with dummy credentials
 * Run with: node scripts/create-test-user.js
 * Requires: MongoDB connection string in MONGODB_URI environment variable
 */

const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quizapp';
const MONGODB_DB = process.env.MONGODB_DB || 'quizapp';

async function createTestUser() {
  let client;
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db(MONGODB_DB);
    const usersCollection = db.collection('users');

    const email = 'testing@mailinator.com';
    const password = 'Testing';
    const username = 'TestUser';

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      console.log('✅ Test user already exists!');
      console.log(`\n📋 Test Credentials:`);
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
      console.log(`Username: ${existingUser.username}`);
      console.log(`User ID: ${existingUser._id}`);
      return;
    }

    // Hash the password
    console.log('🔐 Hashing password...');
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the user
    console.log('👤 Creating test user...');
    const newUser = {
      email,
      username,
      passwordHash,
      points: 0,
      createdAt: new Date().toISOString(),
      lastResetDate: new Date().toISOString().split('T')[0],
    };

    const result = await usersCollection.insertOne(newUser);

    console.log('✅ Test user created successfully!');
    console.log('\n📋 Test Credentials:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Username: ${username}`);
    console.log(`User ID: ${result.insertedId}`);
    console.log('\n🎉 You can now login with these credentials!');
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

createTestUser();
