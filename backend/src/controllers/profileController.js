const db = require('../config/db');

const getMyProfile = async (req, res, next) => {
  try {
    const profileRes = await db.query(
      `SELECT p.*, u.employee_id, u.email, u.role 
       FROM profiles p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.user_id = $1`,
      [req.user.id]
    );

    if (profileRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.status(200).json({ success: true, profile: profileRes.rows[0] });
  } catch (err) {
    next(err);
  }
};

const getEmployeeProfile = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const profileRes = await db.query(
      `SELECT p.*, u.employee_id, u.email, u.role 
       FROM profiles p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.user_id = $1`,
      [userId]
    );

    if (profileRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.status(200).json({ success: true, profile: profileRes.rows[0] });
  } catch (err) {
    next(err);
  }
};

const updateMyProfile = async (req, res, next) => {
  const { name, phone, address, profilePicture } = req.body;

  try {
    // Standard employee is allowed to edit only phone, address, name, profilePicture
    const query = `
      UPDATE profiles 
      SET name = COALESCE($1, name),
          phone = COALESCE($2, phone),
          address = COALESCE($3, address),
          profile_picture = COALESCE($4, profile_picture),
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $5
      RETURNING *
    `;

    const result = await db.query(query, [name, phone, address, profilePicture, req.user.id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

const updateEmployeeProfile = async (req, res, next) => {
  const { userId } = req.params;
  const { name, phone, address, jobTitle, department, profilePicture } = req.body;

  try {
    // Admin can update all fields of anyone's profile
    const query = `
      UPDATE profiles 
      SET name = COALESCE($1, name),
          phone = COALESCE($2, phone),
          address = COALESCE($3, address),
          job_title = COALESCE($4, job_title),
          department = COALESCE($5, department),
          profile_picture = COALESCE($6, profile_picture),
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $7
      RETURNING *
    `;

    const result = await db.query(query, [name, phone, address, jobTitle, department, profilePicture, userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Employee profile updated successfully by Admin',
      profile: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

const getAllEmployees = async (req, res, next) => {
  try {
    const employeesRes = await db.query(
      `SELECT u.id, u.employee_id, u.email, u.role, p.name, p.job_title, p.department 
       FROM users u 
       JOIN profiles p ON u.id = p.user_id
       ORDER BY p.name ASC`
    );

    res.status(200).json({ success: true, employees: employeesRes.rows });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyProfile,
  getEmployeeProfile,
  updateMyProfile,
  updateEmployeeProfile,
  getAllEmployees
};
