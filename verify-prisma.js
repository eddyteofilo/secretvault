import prisma from './src/lib/prisma.js';

async function testConnection() {
  console.log('--- Database Connection Test ---');
  try {
    const userCount = await prisma.user.count();
    console.log(`✅ SUCCESS: Connected to database. Current user count: ${userCount}`);
    
    // Test fetch one user (will likely be null if new DB)
    const testUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });
    console.log('✅ SUCCESS: findUnique executed without FATAL error.');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ FAILED: Database connection error');
    console.error(`   Message: ${err.message}`);
    process.exit(1);
  }
}

testConnection();
