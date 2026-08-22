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

const runSeed = async () => {
  console.log('Force-seeding Dayflow HRMS Database...');
  let connection;
  try {
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      port: dbConfig.port,
      multipleStatements: true
    });

    console.log('1. Re-initializing database tables (schema)...');
    const schemaPath = path.join(__dirname, '../../../database/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schemaSql);
    console.log('✓ Database schema created.');

    console.log('2. Inserting seed data...');
    const seedPath = path.join(__dirname, '../../../database/seed-data/seed.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    await connection.query(seedSql);
    console.log('✓ Database seeded successfully.');

    console.log('\nDatabase seeding completed successfully!');
  } catch (err) {
    console.error('Seeding failed:', err.message);
    console.log('\nMake sure:');
    console.log('1. MySQL server is running.');
    console.log('2. Your database name exists (or matching backend/.env configurations).');
  } finally {
    if (connection) await connection.end();
  }
};

runSeed();
