const db = require('../config/db');
const { sendLeaveStatusEmail } = require('../services/emailService');

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

    const result = await db.query(
      `INSERT INTO leaves (user_id, leave_type, start_date, end_date, remarks, status) 
       VALUES ($1, $2, $3, $4, $5, 'pending') 
       RETURNING *`,
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
      'SELECT * FROM leaves WHERE user_id = $1 ORDER BY start_date DESC',
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
       WHERE l.id = $1`,
      [leaveId]
    );

    if (leaveRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Leave request not found.' });
    }

    const leave = leaveRes.rows[0];

    // 2. Update the leave request status
    const updateRes = await db.query(
      `UPDATE leaves 
       SET status = $1, admin_comments = $2 
       WHERE id = $3 
       RETURNING *`,
      [status, adminComments || null, leaveId]
    );

    // 3. If approved, automatically insert/update attendance logs for the date range
    if (status === 'approved') {
      const start = new Date(leave.start_date);
      const end = new Date(leave.end_date);
      
      const currentDate = new Date(start);
      while (currentDate <= end) {
        // Format to YYYY-MM-DD
        const dateStr = currentDate.toISOString().slice(0, 10);
        
        try {
          // Check if attendance record exists for this date
          const attCheck = await db.query(
            'SELECT id FROM attendance WHERE user_id = $1 AND date = $2',
            [leave.user_id, dateStr]
          );

          if (attCheck.rowCount > 0) {
            // Update to leave status
            await db.query(
              "UPDATE attendance SET status = 'leave', check_in = NULL, check_out = NULL WHERE user_id = $1 AND date = $2",
              [leave.user_id, dateStr]
            );
          } else {
            // Insert new leave record in attendance
            await db.query(
              "INSERT INTO attendance (user_id, date, status, check_in, check_out) VALUES ($1, $2, 'leave', NULL, NULL)",
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

module.exports = {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
};
