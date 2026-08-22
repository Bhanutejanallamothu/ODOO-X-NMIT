const express = require('express');
const { checkIn, checkOut, getMyAttendance, getTodayStatus, getAllAttendance, adminUpsertAttendance } = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/checkin', checkIn);
router.post('/checkout', checkOut);
router.get('/me', getMyAttendance);
router.get('/today', getTodayStatus);

// Admin-only endpoints
router.get('/all', isAdmin, getAllAttendance);
router.post('/admin-update', isAdmin, adminUpsertAttendance);

module.exports = router;
