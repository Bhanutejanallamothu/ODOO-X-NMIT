const express = require('express');
const { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus } = require('../controllers/leaveController');
const authMiddleware = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/apply', applyLeave);
router.get('/me', getMyLeaves);

// Admin-only endpoints
router.get('/all', isAdmin, getAllLeaves);
router.put('/:leaveId/status', isAdmin, updateLeaveStatus);

module.exports = router;
