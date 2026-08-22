const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/db');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');

const signUp = async (req, res, next) => {
  const { employeeId, email, password, role, name, phone, address, jobTitle, department } = req.body;

  try {
    // 1. Check if user already exists
    const userCheck = await db.query(
      'SELECT id FROM users WHERE email = ? OR employee_id = ?',
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
       VALUES (?, ?, ?, ?, ?, ?)`,
      [employeeId, email, passwordHash, role || 'employee', false, verificationToken]
    );

    const userId = userResult.insertId;

    // 5. Create Profile
    await db.query(
      `INSERT INTO profiles (user_id, name, phone, address, job_title, department) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, name, phone || null, address || null, jobTitle || null, department || null]
    );

    // 6. Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      user: { id: userId, employee_id: employeeId, email, role: role || 'employee' }
    });
  } catch (err) {
    next(err);
  }
};

const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(`[Auth] Sign-in attempt: ${email}`);

  try {
    // 1. Fetch user
    const userResult = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    console.log(`[Auth] Users found in database: ${userResult.rowCount}`);

    if (userResult.rowCount === 0) {
      console.log(`[Auth] Login failed: User not found.`);
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    console.log(`[Auth] Password comparison result: ${isMatch}`);

    if (!isMatch) {
      console.log(`[Auth] Login failed: Password mismatch.`);
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
      'SELECT name, job_title, department, profile_picture FROM profiles WHERE user_id = ?',
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
      'SELECT id, is_verified FROM users WHERE email = ? AND verification_token = ?',
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
      'UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = ?',
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
      'SELECT name, phone, address, job_title, department, profile_picture FROM profiles WHERE user_id = ?',
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

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const userResult = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (userResult.rowCount === 0) {
      // For security, do not disclose if the email is registered
      return res.status(200).json({
        success: true,
        message: 'If that email exists, a password reset link has been sent.'
      });
    }

    const user = userResult.rows[0];
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    await db.query(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
      [resetToken, resetTokenExpires, user.id]
    );

    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({
      success: true,
      message: 'If that email exists, a password reset link has been sent.'
    });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  const { token, password } = req.body;

  try {
    const userResult = await db.query(
      'SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > CURRENT_TIMESTAMP',
      [token]
    );

    if (userResult.rowCount === 0) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is invalid or has expired.'
      });
    }

    const user = userResult.rows[0];
    const passwordHash = await bcrypt.hash(password, 10);

    await db.query(
      'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [passwordHash, user.id]
    );

    res.status(200).json({
      success: true,
      message: 'Your password has been successfully reset.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signUp,
  signIn,
  verifyEmail,
  getCurrentUser,
  forgotPassword,
  resetPassword
};
