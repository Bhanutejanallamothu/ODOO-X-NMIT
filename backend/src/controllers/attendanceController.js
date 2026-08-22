const db = require('../config/db');

const checkIn = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // Format date as YYYY-MM-DD in local time
    const today = new Date().toLocaleDateString('en-CA'); // 'en-CA' outputs YYYY-MM-DD
    const now = new Date();

    // Check if user already checked in today
    const checkResult = await db.query(
      'SELECT id, check_in FROM attendance WHERE user_id = $1 AND date = $2',
      [userId, today]
    );

    if (checkResult.rowCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already checked in for today.'
      });
    }

    // Insert new check-in
    const result = await db.query(
      `INSERT INTO attendance (user_id, date, check_in, status) 
       VALUES ($1, $2, $3, 'present') 
       RETURNING *`,
      [userId, today, now]
    );

    res.status(200).json({
      success: true,
      message: 'Checked in successfully!',
      attendance: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

const checkOut = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const today = new Date().toLocaleDateString('en-CA');
    const now = new Date();

    // Check if user has checked in today
    const checkResult = await db.query(
      'SELECT id, check_in, check_out FROM attendance WHERE user_id = $1 AND date = $2',
      [userId, today]
    );

    if (checkResult.rowCount === 0) {
      return res.status(400).json({
        success: false,
        message: 'You must check in before checking out.'
      });
    }

    if (checkResult.rows[0].check_out) {
      return res.status(400).json({
        success: false,
        message: 'You have already checked out for today.'
      });
    }

    // Calculate status (e.g. check hours worked, if check-out is < 4 hours after check-in, set half-day)
    const checkInTime = new Date(checkResult.rows[0].check_in);
    const diffMs = now - checkInTime;
    const diffHours = diffMs / (1000 * 60 * 60);

    let status = 'present';
    if (diffHours < 4.0) {
      status = 'half-day';
    }

    // Update check-out
    const result = await db.query(
      `UPDATE attendance 
       SET check_out = $1, status = $2 
       WHERE user_id = $3 AND date = $4 
       RETURNING *`,
      [now, status, userId, today]
    );

    res.status(200).json({
      success: true,
      message: `Checked out successfully! Status: ${status}`,
      attendance: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

const getMyAttendance = async (req, res, next) => {
  const { startDate, endDate } = req.query;

  try {
    let query = 'SELECT * FROM attendance WHERE user_id = $1';
    const params = [req.user.id];

    if (startDate && endDate) {
      query += ' AND date BETWEEN $2 AND $3';
      params.push(startDate, endDate);
    }

    query += ' ORDER BY date DESC';

    const result = await db.query(query, params);
    res.status(200).json({ success: true, records: result.rows });
  } catch (err) {
    next(err);
  }
};

const getTodayStatus = async (req, res, next) => {
  try {
    const today = new Date().toLocaleDateString('en-CA');
    const result = await db.query(
      'SELECT check_in, check_out, status FROM attendance WHERE user_id = $1 AND date = $2',
      [req.user.id, today]
    );

    if (result.rowCount === 0) {
      return res.status(200).json({ success: true, checkedIn: false, record: null });
    }

    res.status(200).json({
      success: true,
      checkedIn: true,
      checkedOut: !!result.rows[0].check_out,
      record: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

const getAllAttendance = async (req, res, next) => {
  const { date, userId } = req.query;

  try {
    let query = `
      SELECT a.*, u.employee_id, p.name, p.department 
      FROM attendance a 
      JOIN users u ON a.user_id = u.id 
      JOIN profiles p ON u.id = p.user_id
    `;
    const params = [];
    const clauses = [];

    if (date) {
      clauses.push(`a.date = $${params.length + 1}`);
      params.push(date);
    }

    if (userId) {
      clauses.push(`a.user_id = $${params.length + 1}`);
      params.push(userId);
    }

    if (clauses.length > 0) {
      query += ' WHERE ' + clauses.join(' AND ');
    }

    query += ' ORDER BY a.date DESC, p.name ASC';

    const result = await db.query(query, params);
    res.status(200).json({ success: true, records: result.rows });
  } catch (err) {
    next(err);
  }
};

// Admin can log or update attendance for anyone (e.g. adjust check-in, set absent/leave/half-day)
const adminUpsertAttendance = async (req, res, next) => {
  const { userId, date, checkIn, checkOut, status } = req.body;

  try {
    // Check if record exists
    const checkResult = await db.query(
      'SELECT id FROM attendance WHERE user_id = $1 AND date = $2',
      [userId, date]
    );

    let result;
    if (checkResult.rowCount > 0) {
      result = await db.query(
        `UPDATE attendance 
         SET check_in = $1, check_out = $2, status = $3 
         WHERE user_id = $4 AND date = $5 
         RETURNING *`,
        [checkIn || null, checkOut || null, status, userId, date]
      );
    } else {
      result = await db.query(
        `INSERT INTO attendance (user_id, date, check_in, check_out, status) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [userId, date, checkIn || null, checkOut || null, status]
      );
    }

    res.status(200).json({
      success: true,
      message: 'Attendance record updated successfully',
      attendance: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  checkIn,
  checkOut,
  getMyAttendance,
  getTodayStatus,
  getAllAttendance,
  adminUpsertAttendance
};
