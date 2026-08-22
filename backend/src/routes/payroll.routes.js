const express = require('express');
const { getMyPayroll, getAllPayroll, upsertPayroll, getSalarySlip } = require('../controllers/payrollController');
const authMiddleware = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/me', getMyPayroll);
router.get('/:payrollId/slip', getSalarySlip);

// Admin-only endpoints
router.get('/all', isAdmin, getAllPayroll);
router.post('/upsert', isAdmin, upsertPayroll);

module.exports = router;
