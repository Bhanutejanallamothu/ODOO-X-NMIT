const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

let dbConfig = {
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '3306',
  database: process.env.DB_NAME || 'dayflow'
};

if (connectionString && connectionString.startsWith('mysql://')) {
  try {
    const url = new URL(connectionString);
    dbConfig = {
      user: url.username || dbConfig.user,
      password: url.password !== undefined ? decodeURIComponent(url.password) : dbConfig.password,
      host: url.hostname || dbConfig.host,
      port: url.port || dbConfig.port,
      database: url.pathname.slice(1) || dbConfig.database
    };
  } catch (e) {
    console.error('Failed to parse DATABASE_URL:', e.message);
  }
}

async function test() {
  console.log('Testing login database query...');
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', ['admin@dayflow.com']);
    console.log('Users found with email admin@dayflow.com:', rows.length);
    
    if (rows.length > 0) {
      const user = rows[0];
      console.log('User ID:', user.id);
      console.log('User Role:', user.role);
      console.log('Is Verified:', user.is_verified);
      console.log('Password Hash in DB:', user.password_hash);
      
      const isMatch = await bcrypt.compare('password123', user.password_hash);
      console.log('Bcrypt match with "password123":', isMatch);
    } else {
      console.log('❌ No user found in database!');
    }
  } catch (err) {
    console.error('Test error:', err.message);
  } finally {
    if (connection) await connection.end();
  }
}

test();
