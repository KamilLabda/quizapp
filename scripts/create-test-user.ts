/**
 * Script to create a test user with dummy credentials
 * Run with: npx tsx scripts/create-test-user.ts
 */

import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail } from '../src/lib/db';

async function createTestUser() {
  try {
    const email = 'testing@mailinator.com';
    const password = 'Testing';
    const username = 'TestUser';

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      console.log('✅ Test user already exists!');
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
      console.log(`Username: ${existingUser.username}`);
      return;
    }

    // Hash the password
    console.log('🔐 Hashing password...');
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the user
    console.log('👤 Creating test user...');
    const user = await createUser({
      email,
      username,
      passwordHash,
      points: 0,
    });

    console.log('✅ Test user created successfully!');
    console.log('\n📋 Test Credentials:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Username: ${username}`);
    console.log(`User ID: ${user.id}`);
    console.log('\n🎉 You can now login with these credentials!');
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser();

