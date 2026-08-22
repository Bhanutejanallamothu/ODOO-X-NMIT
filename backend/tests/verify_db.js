// Database connectivity verification script
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mysql = require('mysql2/promise');

console.log('Testing MySQL connectivity for Dayflow HRMS...');
console.log('Connection URL:', process.env.DATABASE_URL || 'Using default: mysql://root@localhost:3306/dayflow');

const dbConfig = {
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '3306',
  database: process.env.DB_NAME || 'dayflow'
};

async function run() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      port: dbConfig.port
    });
    console.log('✅ Successfully connected to MySQL server!');
    
    // Fetch tables
    const [rows] = await connection.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ?
    `, [dbConfig.database]);
    
    console.log('\nfound tables:');
    if (rows.length === 0) {
      console.log('No tables found. They will be created when the Express server starts.');
    } else {
      rows.forEach(row => {
        console.log(`- ${row.TABLE_NAME || row.table_name}`);
      });
    }

    // Try a simple user query
    const [usersCount] = await connection.query('SELECT COUNT(*) as count FROM users');
    console.log(`\nTotal users in database: ${usersCount[0].count}`);
    
    console.log('\nDatabase check PASSED successfully.');
  } catch (err) {
    console.error('\n�� Database verification FAILED.');
    console.error('Error Details:', err.message);
    console.error('\nqnsure:');
    console.log('1. MySQL service is running.');
    console.log('2. The credentials in backend/.env match your local MySQL.');
    console.log('3. The database "dayflow" exists (or the user has permissions to create it).');
  } finally {
    if (connection) await connection.end();
  }
}

run();