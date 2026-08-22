const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { signUp, signIn, verifyEmail, getCurrentUser, forgotPassword, resetPassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Validation helper middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

router.post(
  '/signup',
  [
    body('employeeId').notEmpty().withMessage('Employee ID is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('name').notEmpty().withMessage('Full name is required'),
    body('role').optional().isIn(['admin', 'employee']).withMessage('Invalid role choice')
  ],
  validate,
  signUp
);

router.post(
  '/signin',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  signIn
);

router.get(
  '/verify',
  [
    query('token').notEmpty().withMessage('Verification token is required'),
    query('email').isEmail().withMessage('Verification email is required')
  ],
  validate,
  verifyEmail
);

router.get('/me', authMiddleware, getCurrentUser);

router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('Please provide a valid email')
  ],
  validate,
  forgotPassword
);

router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  validate,
  resetPassword
);

module.exports = router;
