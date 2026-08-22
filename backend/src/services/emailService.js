const nodemailer = require('nodemailer');
require('dotenv').config();

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && port && user && pass) {
    return nodemailer.createTransport({
      host,
      port: parseInt(port),
      secure: parseInt(port) === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });
  }
  return null;
};

const sendVerificationEmail = async (email, token) => {
  const transporter = createTransporter();
  const verificationLink = `http://localhost:5173/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

  console.log('-----------------------------------------');
  console.log(`[EMAIL SERVICE] Verification email for: ${email}`);
  console.log(`[EMAIL SERVICE] Link: ${verificationLink}`);
  console.log('-----------------------------------------');

  if (!transporter) {
    console.log('[EMAIL SERVICE] SMTP is not configured. Outputting link to console.');
    return true;
  }

  try {
    const info = await transporter.sendMail({
      from: '"Dayflow HRMS" <no-reply@dayflow.com>',
      to: email,
      subject: 'Verify your Dayflow HRMS Account',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5; text-align: center;">Welcome to Dayflow</h2>
          <p>Hi there,</p>
          <p>Thank you for signing up for Dayflow HRMS. Please click the button below to verify your email address and activate your account:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Email Address</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #718096;">${verificationLink}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #a0aec0; text-align: center;">Every workday, perfectly aligned. Dayflow HRMS.</p>
        </div>
      `,
    });
    console.log('[EMAIL SERVICE] Sent verification email:', info.messageId);
    return true;
  } catch (error) {
    console.error('[EMAIL SERVICE] Failed to send verification email via SMTP:', error);
    return false;
  }
};

const sendLeaveStatusEmail = async (email, employeeName, leaveType, status, comments) => {
  const transporter = createTransporter();
  
  console.log('-----------------------------------------');
  console.log(`[EMAIL SERVICE] Leave Status Update for ${employeeName} (${email})`);
  console.log(`[EMAIL SERVICE] Type: ${leaveType} | Status: ${status}`);
  console.log(`[EMAIL SERVICE] Admin Comments: ${comments || 'None'}`);
  console.log('-----------------------------------------');

  if (!transporter) {
    return true;
  }

  try {
    const statusColor = status === 'approved' ? '#10b981' : '#ef4444';
    await transporter.sendMail({
      from: '"Dayflow HRMS" <no-reply@dayflow.com>',
      to: email,
      subject: `Leave Request Update - ${status.toUpperCase()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Leave Request Update</h2>
          <p>Hi ${employeeName},</p>
          <p>Your leave request for <strong>${leaveType}</strong> has been updated.</p>
          <div style="padding: 15px; background-color: #f8fafc; border-left: 4px solid ${statusColor}; margin: 20px 0;">
            <p style="margin: 0; font-size: 16px;">Status: <strong style="color: ${statusColor}; text-transform: uppercase;">${status}</strong></p>
            <p style="margin: 5px 0 0 0; color: #475569;">Admin Comments: ${comments || 'No comments provided.'}</p>
          </div>
          <p>Log in to Dayflow to view details.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #a0aec0; text-align: center;">Dayflow HRMS — Every workday, perfectly aligned.</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('[EMAIL SERVICE] Failed to send leave status email:', error);
    return false;
  }
};

const sendPasswordResetEmail = async (email, token) => {
  const transporter = createTransporter();
  const resetLink = `http://localhost:5173/reset-password?token=${token}`;

  console.log('-----------------------------------------');
  console.log(`[EMAIL SERVICE] Password Reset email for: ${email}`);
  console.log(`[EMAIL SERVICE] Link: ${resetLink}`);
  console.log('-----------------------------------------');

  if (!transporter) {
    console.log('[EMAIL SERVICE] SMTP is not configured. Outputting link to console.');
    return true;
  }

  try {
    const info = await transporter.sendMail({
      from: '"Dayflow HRMS" <no-reply@dayflow.com>',
      to: email,
      subject: 'Reset your Dayflow HRMS Password',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5; text-align: center;">Reset Your Password</h2>
          <p>Hi there,</p>
          <p>We received a request to reset your password for your Dayflow HRMS account. Click the button below to choose a new password (valid for 1 hour):</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #718096;">${resetLink}</p>
          <p>If you did not request a password reset, you can safely ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #a0aec0; text-align: center;">Every workday, perfectly aligned. Dayflow HRMS.</p>
        </div>
      `,
    });
    console.log('[EMAIL SERVICE] Sent password reset email:', info.messageId);
    return true;
  } catch (error) {
    console.error('[EMAIL SERVICE] Failed to send password reset email via SMTP:', error);
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
  sendLeaveStatusEmail,
  sendPasswordResetEmail
};
