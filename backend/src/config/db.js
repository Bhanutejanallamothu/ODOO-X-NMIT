const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
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

const pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  port: dbConfig.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true
});

const queryWrapper = async (text, params) => {
  const cleanText = text.replace(/RETURNING\s+.*$/i, '');
  const [rows, fields] = await pool.query(cleanText, params);
  
  if (rows && rows.insertId !== undefined) {
    return {
      rowCount: rows.affectedRows,
      insertId: rows.insertId,
      rows: [ { id: rows.insertId } ]
    };
  }
  
  return {
    rows: rows,
    rowCount: rows.length
  };
};

const initDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port,
      multipleStatements: true
    });

    console.log(`Checking if database '${dbConfig.database}' exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    console.log(`Database '${dbConfig.database}' checked/created successfully.`);
    
    await connection.changeUser({ database: dbConfig.database });
    
    const [tableCheck] = await connection.query(
      `SELECT count(*) as count FROM information_schema.tables WHERE table_schema = ? AND table_name = 'users'`,
      [dbConfig.database]
    );

    if (tableCheck[0].count === 0) {
      console.log('Tables do not exist. Initializing schema...');
      
      const schemaPath = path.join(__dirname, '../../../database/schema.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await connection.query(schemaSql);
      console.log('Database schema created successfully.');

      const seedPath = path.join(__dirname, '../../../database/seed-data/seed.sql');
      if (fs.existsSync(seedPath)) {
        console.log('Seeding initial data...');
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        await connection.query(seedSql);
        console.log('Database seeded successfully.');
      }
    } else {
      console.log('Tables already exist. Skipping database initialization.');
    }
    
    await connection.end();
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

module.exports = {
  pool,
  query: queryWrapper,
  initDB
};