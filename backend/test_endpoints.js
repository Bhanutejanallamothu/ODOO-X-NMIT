const http = require('http');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let testUserId = 'TEST' + Math.floor(Math.random() * 10000);
let testEmail = testUserId + '@example.com';

const request = (method, endpoint, body = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + endpoint);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (authToken) {
      options.headers['Authorization'] = `Bearer ${authToken}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (e) => reject(e));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('--- STARTING API TESTS ---');

  // 1. SIGNUP
  console.log('\n[1] POST /auth/signup');
  const signupRes = await request('POST', '/auth/signup', {
    employeeId: testUserId,
    email: testEmail,
    password: 'Password123',
    name: 'Test User',
    role: 'employee'
  });
  console.log(`Status: ${signupRes.status}`);
  console.log('Response:', signupRes.data);

  // Verifying user in DB directly for testing...
  console.log('\n[*] Verifying user in DB directly for testing...');
  const mysql = require('mysql2/promise');
  require('dotenv').config({ path: path.join('D:', 'New folder (6)', 'ODOO-X-NMIT', 'backend', '.env') });
  const dbConfig = {
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '3306',
    database: process.env.DB_NAME || 'Odoo_x_NMIT'
  };
  const connection = await mysql.createConnection(dbConfig);
  await connection.query('UPDATE users SET is_verified = 1 WHERE email = ?', [testEmail]);
  await connection.end();
  console.log('User verified.');

  // 2. SIGNIN
  console.log('\n[2] POST /auth/signin');
  const signinRes = await request('POST', '/auth/signin', {
    email: testEmail,
    password: 'Password123'
  });
  console.log(`Status: ${signinRes.status}`);
  console.log('Response:', signinRes.data);
  if (signinRes.data && signinRes.data.token) {
    authToken = signinRes.data.token;
  } else {
    console.log('Failed to get auth token. Stopping tests.');
    return;
  }

  // 3. GET /auth/me
  console.log('\n[3] GET /auth/me');
  const authMe = await request('GET', '/auth/me');
  console.log(`Status: ${authMe.status}`);
  console.log('Response:', authMe.data);

  // 4. GET /profiles/me
  console.log('\n[4] GET /profiles/me');
  const profileMe = await request('GET', '/profiles/me');
  console.log(`Status: ${profileMe.status}`);
  console.log('Response:', profileMe.data);

  // 5. POST /attendance/checkin
  console.log('\n[5] POST /attendance/checkin');
  const checkinRes = await request('POST', '/attendance/checkin');
  console.log(`Status: ${checkinRes.status}`);
  console.log('Response:', checkinRes.data);

  // 6. POST /attendance/checkout
  console.log('\n[6] POST /attendance/checkout');
  const checkoutRes = await request('POST', '/attendance/checkout');
  console.log(`Status: ${checkoutRes.status}`);
  console.log('Response:', checkoutRes.data);

  // 7. GET /leaves/me
  console.log('\n[7] GET /leaves/me');
  const leaveMe = await request('GET', '/leaves/me');
  console.log(`Status: ${leaveMe.status}`);
  console.log('Response:', leaveMe.data);

  console.log('\n--- TESTS COMPLETED ---');
};

runTests().catch(console.error);
