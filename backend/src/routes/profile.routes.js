const express = require('express');
const { getMyProfile, getEmployeeProfile, updateMyProfile, updateEmployeeProfile, getAllEmployees } = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

// Apply auth middleware to all profile routes
router.use(authMiddleware);

// Employee list (Admin only)
router.get('/employees', isAdmin, getAllEmployees);

// Self-profile routes
router.get('/me', getMyProfile);
router.put('/me', updateMyProfile);

// Admin controls for specific employee profiles
router.get('/:userId', isAdmin, getEmployeeProfile);
router.put('/:userId', isAdmin, updateEmployeeProfile);

module.exports = router;
