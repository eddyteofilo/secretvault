const { Client } = require('pg');

const projectRef = 'ygntxxtyuclsltbtanef';
const password = 'Eddy69642180';
const variations = [
  'aws-0-us-east-1.pooler.supabase.com',
  'aws-1-us-east-1.pooler.supabase.com',
  'aws-0-sa-east-1.pooler.supabase.com'
];

async function test() {
  for (const host of variations) {
    console.log(`Testing host: ${host}...`);
    const client = new Client({ 
      connectionString: `postgresql://postgres.${projectRef}:${password}@${host}:5432/postgres`,
      connectionTimeoutMillis: 3000 
    });
    try {
      await client.connect();
      console.log(`✅ SUCCESS: ${host} is working!`);
      await client.end();
    } catch (err) {
      console.log(`❌ Failed ${host}: ${err.message}`);
    }
    console.log('---');
  }
}

test();
