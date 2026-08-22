// Database connectivity verification script
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { Client } = require('pg');

console.log('Testing PostgreSQL connectivity for Dayflow HRMS...');
console.log('Connection URL:', process.env.DATABASE_URL || 'Using default: postgresql://postgres:postgres@localhost:5432/dayflow');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/dayflow'
});

async function run() {
  try {
    await client.connect();
    console.log('✓ Successfully connected to PostgreSQL server!');
    
    // Fetch tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('\nFound tables:');
    if (res.rows.length === 0) {
      console.log('No tables found in public schema. They will be created when the Express server starts.');
    } else {
      res.rows.forEach(row => {
        console.log(`- ${row.table_name}`);
      });
    }

    // Try a simple user query
    const usersCount = await client.query('SELECT COUNT(*) FROM users');
    console.log(`\nTotal users in database: ${usersCount.rows[0].count}`);
    
    console.log('\nDatabase check PASSED successfully.');
  } catch (err) {
    console.error('\n✗ Database verification FAILED.');
    console.error('Error Details:', err.message);
    console.error('\nEnsure:');
    console.log('1. PostgreSQL service is running.');
    console.log('2. The credentials in backend/.env match your local PostgreSQL.');
    console.log('3. The database "dayflow" exists (or the user has permissions to create it).');
  } finally {
    await client.end();
  }
}

run();
