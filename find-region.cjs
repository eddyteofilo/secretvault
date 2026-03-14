const { Client } = require('pg');

const projectRef = 'ygntxxtyuclsltbtanef';
const password = 'Eddy69642180';
const regions = ['us-east-1', 'sa-east-1', 'us-west-1', 'eu-west-1', 'ap-southeast-1'];

async function test() {
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    console.log(`Testing region: ${region} (${host})...`);
    const client = new Client({ 
      connectionString: `postgresql://postgres.${projectRef}:${password}@${host}:5432/postgres`,
      connectionTimeoutMillis: 3000 
    });
    try {
      await client.connect();
      console.log(`✅ SUCCESS: Region ${region} is the correct one!`);
      await client.end();
      process.exit(0);
    } catch (err) {
      console.log(`❌ Failed ${region}: ${err.message}`);
    }
    console.log('---');
  }
}

test();
