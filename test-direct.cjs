const { Client } = require('pg');

const projectRef = 'ygntxxtyuclsltbtanef';
const password = 'Eddy69642180';

async function test() {
  const host = `db.${projectRef}.supabase.co`;
  console.log(`Testing Direct Host: ${host}...`);
  const client = new Client({ 
    host: host,
    port: 5432,
    user: 'postgres',
    password: password,
    database: 'postgres',
    connectionTimeoutMillis: 5000 
  });
  try {
    await client.connect();
    console.log(`✅ SUCCESS: Direct connection works!`);
    await client.end();
  } catch (err) {
    console.log(`❌ Failed Direct: ${err.message}`);
  }
}

test();
