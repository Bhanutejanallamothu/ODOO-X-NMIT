const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/db');
const { sendVerificationEmail } = require('../services/emailService');

const signUp = async (req, res, next) => {
  const { employeeId, email, password, role, name, phone, address, jobTitle, department } = req.body;

  try {
    // 1. Check if user already exists
    const userCheck = await db.query(
      'SELECT id FROM users WHERE email = $1 OR employee_id = $2',
      [email, employeeId]
    );

    if (userCheck.rowCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'A user with this Email or Employee ID already exists.'
      });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // 4. Insert user
    const userResult = await db.query(
      `INSERT INTO users (employee_id, email, password_hash, role, is_verified, verification_token) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, employee_id, email, role`,
      [employeeId, email, passwordHash, role || 'employee', false, verificationToken]
    );

    const userId = userResult.rows[0].id;

    // 5. Create Profile
    await db.query(
      `INSERT INTO profiles (user_id, name, phone, address, job_title, department) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, name, phone || null, address || null, jobTitle || null, department || null]
    );

    // 6. Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      user: userResult.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // 1. Fetch user
    const userResult = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rowCount === 0) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // 3. Check email verification
    if (!user.is_verified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email address before logging in.',
        isVerified: false
      });
    }

    // 4. Fetch Profile details to return in payload
    const profileResult = await db.query(
      'SELECT name, job_title, department, profile_picture FROM profiles WHERE user_id = $1',
      [user.id]
    );
    const profile = profileResult.rows[0] || {};

    // 5. Create token
    const token = jwt.sign(
      { id: user.id, role: user.role, employeeId: user.employee_id },
      process.env.JWT_SECRET || 'dayflow_super_secret_jwt_key_987654321',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        employeeId: user.employee_id,
        email: user.email,
        role: user.role,
        name: profile.name,
        jobTitle: profile.job_title,
        department: profile.department,
        profilePicture: profile.profile_picture
      }
    });
  } catch (err) {
    next(err);
  }
};

const verifyEmail = async (req, res, next) => {
  const { token, email } = req.query;

  try {
    const userResult = await db.query(
      'SELECT id, is_verified FROM users WHERE email = $1 AND verification_token = $2',
      [email, token]
    );

    if (userResult.rowCount === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token or email.'
      });
    }

    const user = userResult.rows[0];
    if (user.is_verified) {
      return res.status(200).json({
        success: true,
        message: 'Account is already verified.'
      });
    }

    // Mark as verified
    await db.query(
      'UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = $1',
      [user.id]
    );

    res.status(200).json({
      success: true,
      message: 'Account verified successfully! You can now log in.'
    });
  } catch (err) {
    next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const profileResult = await db.query(
      'SELECT name, phone, address, job_title, department, profile_picture FROM profiles WHERE user_id = $1',
      [req.user.id]
    );
    const profile = profileResult.rows[0] || {};

    res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        employeeId: req.user.employee_id,
        email: req.user.email,
        role: req.user.role,
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        jobTitle: profile.job_title,
        department: profile.department,
        profilePicture: profile.profile_picture
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signUp,
  signIn,
  verifyEmail,
  getCurrentUser
};
