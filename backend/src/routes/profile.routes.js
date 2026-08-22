const express = require('express');
const { getMyProfile, getEmployeeProfile, updateMyProfile, updateEmployeeProfile, getAllEmployees, getAuditLogs } = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

// Apply auth middleware to all profile routes
router.use(authMiddleware);

// Employee list (Admin only)
router.get('/employees', isAdmin, getAllEmployees);

// Audit logs (Admin only)
router.get('/audit-logs', isAdmin, getAuditLogs);

// Self-profile routes
router.get('/me', getMyProfile);
router.put('/me', updateMyProfile);

// Admin controls for specific employee profiles
router.get('/:userId', isAdmin, getEmployeeProfile);
router.put('/:userId', isAdmin, updateEmployeeProfile);

module.exports = router;
