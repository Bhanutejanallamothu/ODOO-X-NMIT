const db = require('../config/db');

/**
 * Utility to log administrative actions to the database.
 * @param {number} userId - ID of the admin who performed the action
 * @param {string} action - Description of the action (e.g. 'APPROVE_LEAVE')
 * @param {string|object} details - Additional metadata or payload details
 * @param {object} [req] - Express request object to extract client IP address
 */
const logAdminAction = async (userId, action, details, req = null) => {
  try {
    let ipAddress = null;
    if (req) {
      ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
    }

    const detailsStr = typeof details === 'object' ? JSON.stringify(details) : details;

    await db.query(
      'INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
      [userId, action, detailsStr, ipAddress]
    );
    console.log(`[AUDIT LOG] Admin ID ${userId} performed: ${action} | IP: ${ipAddress}`);
  } catch (error) {
    console.error('[AUDIT LOG ERROR] Failed to write audit log:', error.message);
  }
};

module.exports = {
  logAdminAction
};
