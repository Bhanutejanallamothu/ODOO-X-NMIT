const db = require('../config/db');
const { generateSalarySlipText } = require('../services/reportService');

const getMyPayroll = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM payrolls WHERE user_id = $1 ORDER BY year DESC, month DESC',
      [req.user.id]
    );
    res.status(200).json({ success: true, payrolls: result.rows });
  } catch (err) {
    next(err);
  }
};

const getAllPayroll = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT pay.*, u.employee_id, p.name, p.department, p.job_title 
       FROM payrolls pay 
       JOIN users u ON pay.user_id = u.id 
       JOIN profiles p ON u.id = p.user_id 
       ORDER BY pay.year DESC, pay.month DESC, p.name ASC`
    );
    res.status(200).json({ success: true, payrolls: result.rows });
  } catch (err) {
    next(err);
  }
};

const upsertPayroll = async (req, res, next) => {
  const { userId, month, year, baseSalary, deductions, allowances } = req.body;

  try {
    const base = parseFloat(baseSalary || 0);
    const ded = parseFloat(deductions || 0);
    const alw = parseFloat(allowances || 0);
    const net = base + alw - ded;

    // Check if payroll already exists for this user, month, and year
    const checkResult = await db.query(
      'SELECT id FROM payrolls WHERE user_id = $1 AND month = $2 AND year = $3',
      [userId, month, year]
    );

    let result;
    if (checkResult.rowCount > 0) {
      result = await db.query(
        `UPDATE payrolls 
         SET base_salary = $1, deductions = $2, allowances = $3, net_salary = $4 
         WHERE user_id = $5 AND month = $6 AND year = $7 
         RETURNING *`,
        [base, ded, alw, net, userId, month, year]
      );
    } else {
      result = await db.query(
        `INSERT INTO payrolls (user_id, base_salary, deductions, allowances, net_salary, month, year) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
        [userId, base, ded, alw, net, month, year]
      );
    }

    res.status(200).json({
      success: true,
      message: 'Payroll details updated successfully.',
      payroll: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

const getSalarySlip = async (req, res, next) => {
  const { payrollId } = req.params;

  try {
    // 1. Fetch payroll
    const payrollRes = await db.query(
      'SELECT * FROM payrolls WHERE id = $1',
      [payrollId]
    );

    if (payrollRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Payroll record not found.' });
    }

    const payroll = payrollRes.rows[0];

    // Access control: Employees can only view their own slip, admins can view any
    if (req.user.role !== 'admin' && payroll.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    // 2. Fetch employee profile details
    const profileRes = await db.query(
      `SELECT p.name, p.department, p.job_title, u.employee_id 
       FROM profiles p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.user_id = $1`,
      [payroll.user_id]
    );

    if (profileRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Employee profile not found.' });
    }

    const profile = profileRes.rows[0];

    // 3. Generate text salary slip
    const textSlip = generateSalarySlipText(payroll, profile);

    res.status(200).json({
      success: true,
      textSlip,
      payroll,
      profile
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyPayroll,
  getAllPayroll,
  upsertPayroll,
  getSalarySlip
};
