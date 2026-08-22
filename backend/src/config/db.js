const { Pool, Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/dayflow';

// Parse the connection string to extract user, password, host, port, and database
// Format: postgresql://[user[:password]@]host[:port][/database]
const parseConnectionString = (str) => {
  try {
    const url = new URL(str);
    return {
      user: url.username,
      password: url.password,
      host: url.hostname,
      port: url.port || '5432',
      database: url.pathname.slice(1) || 'dayflow'
    };
  } catch (err) {
    console.error('Failed to parse DATABASE_URL, using defaults', err);
    return {
      user: 'postgres',
      password: 'postgres',
      host: 'localhost',
      port: '5432',
      database: 'dayflow'
    };
  }
};

const dbConfig = parseConnectionString(connectionString);

// Create a pool pointing to the target database
const pool = new Pool({
  connectionString: connectionString,
});

const initDB = async () => {
  // 1. Try to connect to 'postgres' default database to check/create the target database
  const clientConfig = { ...dbConfig, database: 'postgres' };
  const client = new Client(clientConfig);

  try {
    await client.connect();
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbConfig.database]);
    
    if (res.rowCount === 0) {
      console.log(`Database '${dbConfig.database}' does not exist. Creating...`);
      // CREATE DATABASE cannot be run inside a transaction/prepared statement easily in pg
      await client.query(`CREATE DATABASE ${dbConfig.database}`);
      console.log(`Database '${dbConfig.database}' created successfully.`);
    } else {
      console.log(`Database '${dbConfig.database}' already exists.`);
    }
  } catch (err) {
    console.error('Error checking/creating database:', err.message);
  } finally {
    await client.end();
  }

  // 2. Connect to the target database and run schema/seed if tables don't exist
  const targetClient = new Client({ connectionString });
  try {
    await targetClient.connect();
    
    // Check if a core table (e.g., 'users') exists
    const tableCheck = await targetClient.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    const usersTableExists = tableCheck.rows[0].exists;

    if (!usersTableExists) {
      console.log('Tables do not exist. Initializing schema...');
      
      // Read schema file
      const schemaPath = path.join(__dirname, '../../../database/schema.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await targetClient.query(schemaSql);
      console.log('Database schema created successfully.');

      // Check if we should seed (we always seed if it's a fresh schema)
      const seedPath = path.join(__dirname, '../../../database/seed-data/seed.sql');
      if (fs.existsSync(seedPath)) {
        console.log('Seeding initial data...');
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        await targetClient.query(seedSql);
        console.log('Database seeded successfully.');
      }
    } else {
      console.log('Tables already exist. Skipping database initialization.');
    }
  } catch (err) {
    console.error('Error initializing tables:', err);
  } finally {
    await targetClient.end();
  }
};

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  initDB
};
