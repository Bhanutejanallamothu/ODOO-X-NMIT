const db = require('../config/db');
const { sendLeaveStatusEmail } = require('../services/emailService');
const { logAdminAction } = require('../services/auditService');

const applyLeave = async (req, res, next) => {
  const { leaveType, startDate, endDate, remarks } = req.body;

  try {
    const userId = req.user.id;

    // Validation: Start Date must be before or equal to End Date
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be after the end date.'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Retrieve active leave balances
    const balResult = await db.query('SELECT * FROM leave_balances WHERE user_id = ?', [userId]);
    let balances = { paid_accrued: 15, paid_used: 0, sick_accrued: 10, sick_used: 0, unpaid_used: 0 };
    if (balResult.rowCount > 0) {
      balances = balResult.rows[0];
    } else {
      await db.query('INSERT INTO leave_balances (user_id) VALUES (?)', [userId]);
    }

    // Verify limit boundaries
    if (leaveType === 'paid') {
      const remaining = balances.paid_accrued - balances.paid_used;
      if (diffDays > remaining) {
        return res.status(400).json({
          success: false,
          message: `Insufficient paid leave balance. Requested: ${diffDays} days, Remaining: ${remaining} days.`
        });
      }
    } else if (leaveType === 'sick') {
      const remaining = balances.sick_accrued - balances.sick_used;
      if (diffDays > remaining) {
        return res.status(400).json({
          success: false,
          message: `Insufficient sick leave balance. Requested: ${diffDays} days, Remaining: ${remaining} days.`
        });
      }
    }

    const result = await db.query(
      `INSERT INTO leaves (user_id, leave_type, start_date, end_date, remarks, status) 
       VALUES (?, ?, ?, ?, ?, 'pending') 
       `,
      [userId, leaveType, startDate, endDate, remarks]
    );

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully.',
      leave: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

const getMyLeaves = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM leaves WHERE user_id = ? ORDER BY start_date DESC',
      [req.user.id]
    );
    res.status(200).json({ success: true, leaves: result.rows });
  } catch (err) {
    next(err);
  }
};

const getAllLeaves = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT l.*, u.employee_id, p.name, p.department 
       FROM leaves l 
       JOIN users u ON l.user_id = u.id 
       JOIN profiles p ON u.id = p.user_id 
       ORDER BY l.created_at DESC`
    );
    res.status(200).json({ success: true, leaves: result.rows });
  } catch (err) {
    next(err);
  }
};

const updateLeaveStatus = async (req, res, next) => {
  const { leaveId } = req.params;
  const { status, adminComments } = req.body; // status: 'approved' or 'rejected'

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status update.' });
  }

  try {
    // 1. Get the leave details
    const leaveRes = await db.query(
      `SELECT l.*, u.email, p.name 
       FROM leaves l 
       JOIN users u ON l.user_id = u.id 
       JOIN profiles p ON u.id = p.user_id 
       WHERE l.id = ?`,
      [leaveId]
    );

    if (leaveRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Leave request not found.' });
    }

    const leave = leaveRes.rows[0];

    // 2. Update the leave request status
    const updateRes = await db.query(
      `UPDATE leaves 
       SET status = ?, admin_comments = ? 
       WHERE id = ? 
       `,
      [status, adminComments || null, leaveId]
    );

    // 3. If approved, automatically insert/update attendance logs for the date range
    const start = new Date(leave.start_date);
    const end = new Date(leave.end_date);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Only adjust balance if transitioning from 'pending' to 'approved'
    if (leave.status === 'pending' && status === 'approved') {
      if (leave.leave_type === 'paid') {
        await db.query('UPDATE leave_balances SET paid_used = paid_used + ? WHERE user_id = ?', [diffDays, leave.user_id]);
      } else if (leave.leave_type === 'sick') {
        await db.query('UPDATE leave_balances SET sick_used = sick_used + ? WHERE user_id = ?', [diffDays, leave.user_id]);
      } else if (leave.leave_type === 'unpaid') {
        await db.query('UPDATE leave_balances SET unpaid_used = unpaid_used + ? WHERE user_id = ?', [diffDays, leave.user_id]);
      }
    }

    if (status === 'approved') {
      const currentDate = new Date(start);
      while (currentDate <= end) {
        // Format to YYYY-MM-DD
        const dateStr = currentDate.toISOString().slice(0, 10);
        
        try {
          // Check if attendance record exists for this date
          const attCheck = await db.query(
            'SELECT id FROM attendance WHERE user_id = ? AND date = ?',
            [leave.user_id, dateStr]
          );

          if (attCheck.rowCount > 0) {
            // Update to leave status
            await db.query(
              "UPDATE attendance SET status = 'leave', check_in = NULL, check_out = NULL WHERE user_id = ? AND date = ?",
              [leave.user_id, dateStr]
            );
          } else {
            // Insert new leave record in attendance
            await db.query(
              "INSERT INTO attendance (user_id, date, status, check_in, check_out) VALUES (?, ?, 'leave', NULL, NULL)",
              [leave.user_id, dateStr]
            );
          }
        } catch (dbErr) {
          console.error(`Failed to automatically log attendance for date ${dateStr}:`, dbErr.message);
        }

        // Increment day
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    // Write admin audit log
    await logAdminAction(
      req.user.id,
      status === 'approved' ? 'APPROVE_LEAVE' : 'REJECT_LEAVE',
      { leaveId, employeeId: leave.user_id, employeeName: leave.name, leaveType: leave.leave_type, days: diffDays, adminComments },
      req
    );

    // 4. Send confirmation email
    await sendLeaveStatusEmail(leave.email, leave.name, leave.leave_type, status, adminComments);

    res.status(200).json({
      success: true,
      message: `Leave request has been ${status}.`,
      leave: updateRes.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

const getLeaveBalances = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      'SELECT * FROM leave_balances WHERE user_id = ?',
      [userId]
    );

    let balances = { user_id: userId, paid_accrued: 15, paid_used: 0, sick_accrued: 10, sick_used: 0, unpaid_used: 0 };
    if (result.rowCount > 0) {
      balances = result.rows[0];
    } else {
      await db.query('INSERT INTO leave_balances (user_id) VALUES (?)', [userId]);
    }

    res.status(200).json({ success: true, balances });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
  getLeaveBalances
};
