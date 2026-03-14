const { Client } = require('pg');

const projectRef = 'ygntxxtyuclsltbtanef';
const password = 'Eddy69642180';

const variations = [
  {
    name: 'Pooler Port 6543 (US-East-1)',
    connectionString: `postgresql://postgres.${projectRef}:${password}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
  },
  {
    name: 'Pooler Port 5432 (US-East-1)',
    connectionString: `postgresql://postgres.${projectRef}:${password}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`
  },
  {
    name: 'Direct Host (Standard User)',
    connectionString: `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`
  }
];

async function test() {
  for (const v of variations) {
    console.log(`Testing: ${v.name}...`);
    const client = new Client({ connectionString: v.connectionString, connectionTimeoutMillis: 5000 });
    try {
      await client.connect();
      console.log(`✅ Success: ${v.name}`);
      await client.end();
    } catch (err) {
      console.error(`❌ Failed: ${v.name}`);
      console.error(`   Error: ${err.message}`);
    }
    console.log('---');
  }
}

test();
