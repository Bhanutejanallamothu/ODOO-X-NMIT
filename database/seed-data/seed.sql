-- Dayflow HRMS PostgreSQL Database Seed Data

-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE audit_logs;
TRUNCATE TABLE leave_balances;
TRUNCATE TABLE payrolls;
TRUNCATE TABLE leaves;
TRUNCATE TABLE attendance;
TRUNCATE TABLE profiles;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert Users (Password is 'password123' bcrypt hashed with 10 rounds: '$2a$10$O50GMlkfiby/laoKPjUfMO47DeyaoxCT8V/swqw4ajvPE/viga5gC')
INSERT INTO users (id, employee_id, email, password_hash, role, is_verified, verification_token) VALUES
(1, 'DF-ADMIN-01', 'admin@dayflow.com', '$2a$10$O50GMlkfiby/laoKPjUfMO47DeyaoxCT8V/swqw4ajvPE/viga5gC', 'admin', TRUE, NULL),
(2, 'DF-EMP-01', 'john.doe@dayflow.com', '$2a$10$O50GMlkfiby/laoKPjUfMO47DeyaoxCT8V/swqw4ajvPE/viga5gC', 'employee', TRUE, NULL),
(3, 'DF-EMP-02', 'jane.smith@dayflow.com', '$2a$10$O50GMlkfiby/laoKPjUfMO47DeyaoxCT8V/swqw4ajvPE/viga5gC', 'employee', TRUE, NULL);

-- Reset Serial sequence for users table
ALTER TABLE users AUTO_INCREMENT = 4;

-- Insert Profiles
INSERT INTO profiles (user_id, name, phone, address, job_title, department, profile_picture) VALUES
(1, 'Alice Johnson', '+15550100', '123 HR HQ Blvd, Suite 100', 'HR Director', 'Human Resources', NULL),
(2, 'John Doe', '+15550101', '456 Elm St, Springfield', 'Software Engineer', 'Engineering', NULL),
(3, 'Jane Smith', '+15550102', '789 Oak Ave, Metropolis', 'UI/UX Designer', 'Product Design', NULL);

-- Reset Serial sequence for profiles table
ALTER TABLE profiles AUTO_INCREMENT = 4;

-- Insert Default Leave Balances
INSERT INTO leave_balances (user_id, paid_accrued, paid_used, sick_accrued, sick_used, unpaid_used) VALUES
(1, 15, 0, 10, 0, 0),
(2, 15, 2, 10, 1, 0),
(3, 15, 0, 10, 0, 0);

-- Insert Attendance Records
INSERT INTO attendance (user_id, date, check_in, check_out, status) VALUES
-- John Doe Attendance
(2, '2026-08-17', '2026-08-17 09:00:00', '2026-08-17 18:00:00', 'present'),
(2, '2026-08-18', '2026-08-18 09:15:00', '2026-08-18 18:05:00', 'present'),
(2, '2026-08-19', '2026-08-19 09:00:00', '2026-08-19 13:00:00', 'half-day'),
(2, '2026-08-20', '2026-08-20 09:05:00', '2026-08-20 18:10:00', 'present'),
(2, '2026-08-21', NULL, NULL, 'absent'),
-- Jane Smith Attendance
(3, '2026-08-17', '2026-08-17 08:55:00', '2026-08-17 17:55:00', 'present'),
(3, '2026-08-18', '2026-08-18 09:00:00', '2026-08-18 18:00:00', 'present'),
(3, '2026-08-19', '2026-08-19 09:05:00', '2026-08-19 18:00:00', 'present'),
(3, '2026-08-20', '2026-08-20 09:00:00', '2026-08-20 18:02:00', 'present'),
(3, '2026-08-21', '2026-08-21 08:50:00', '2026-08-21 17:50:00', 'present');

-- Insert Leave Requests
INSERT INTO leaves (user_id, leave_type, start_date, end_date, remarks, status, admin_comments) VALUES
(2, 'sick', '2026-08-24', '2026-08-25', 'Recovering from wisdom tooth extraction', 'pending', NULL),
(3, 'paid', '2026-08-28', '2026-08-28', 'Personal business', 'approved', 'Approved. Please transition key deliverables.'),
(2, 'unpaid', '2026-07-10', '2026-07-12', 'Family emergency', 'approved', 'Approved retrospectively.');

-- Insert Payroll Records (August 2026)
INSERT INTO payrolls (user_id, base_salary, deductions, allowances, net_salary, month, year) VALUES
(2, 7500.00, 300.00, 500.00, 7700.00, 8, 2026),
(3, 7000.00, 250.00, 450.00, 7200.00, 8, 2026),
(2, 7500.00, 300.00, 500.00, 7700.00, 7, 2026),
(3, 7000.00, 250.00, 450.00, 7200.00, 7, 2026);
