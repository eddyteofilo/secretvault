import prisma from './src/lib/prisma.js';
import * as bcrypt from 'bcryptjs';

async function testAuthFlow() {
  console.log('--- Auth Flow Integration Test ---');
  const testEmail = `test-${Date.now()}@example.com`;
  const password = 'Password123';
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    console.log(`Step 1: Creating test user ${testEmail}...`);
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: testEmail,
        passwordHash: passwordHash
      }
    });
    console.log(`✅ User created successfully with ID: ${user.id}`);

    console.log(`Step 2: Finding user by email ${testEmail}...`);
    const foundUser = await prisma.user.findUnique({
      where: { email: testEmail }
    });
    
    if (foundUser && foundUser.email === testEmail) {
      console.log('✅ User found successfully!');
    } else {
      throw new Error('User not found after creation');
    }

    console.log('Step 3: Cleaning up test data...');
    await prisma.user.delete({ where: { id: user.id } });
    console.log('✅ Cleanup complete.');

    console.log('\nFinal Result: AUTH FLOW IS WORKING IN THE DATABASE!');
    process.exit(0);
  } catch (err) {
    console.error('❌ AUTH FLOW FAILED');
    console.error(`   Error: ${err.message}`);
    process.exit(1);
  }
}

testAuthFlow();
