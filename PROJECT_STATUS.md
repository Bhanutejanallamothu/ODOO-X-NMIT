# Dayflow HRMS — Project Status Report

## 📊 Project Completion Summary
* **Status:** **Completed (Production-Ready Prototype)**
* **Branch:** `main` (Successfully merged, resolved conflicts, and tracked with `origin/main`)
* **Frameworks:** React (Vite) + Tailwind CSS v3 / Node.js + Express / MySQL (mysql2)

---

## 🛠️ Implemented Features & Modules

### 1. Authentication & Authorization
- **Sign Up:** Enforces password policies, checks database for duplicate Employee IDs/Emails, automatically registers a base user profile, and triggers a mock activation token.
- **Sign In:** Leverages bcrypt comparison, returns JWT access tokens valid for 24 hours, and returns profile settings based on user role. Includes a neumorphic **View Password (Eye/Eye-Off toggle)** icon.
- **Forgot Password Flow:** Secure recovery flow. Generates a random cryptographic token, sets a 1-hour expiration, prints a recovery URL in the console, and provides UI forms to type and reset to a new password.
- **Email Verification page:** Receives token parameters from query URL to verify and unlock account access.
- **Database Engine Support:** Decodes and parses MySQL configurations dynamically from `DATABASE_URL` or environment variables, facilitating seamless local setup.

### 2. Dashboard Hub (Role-Aware)
- **Employee View:** Displays real-time Clock-In/Out controls, current shift state, leave request summaries, latest salary slip data, and a historical weekly attendance widget.
- **Admin / HR View:** Displays stats cards (total headcount, present count today, pending leaves), quick review panels for pending leaves, and active checklist lists.

### 3. Employee Profile Management
- **Standard User:** View personal details, change contact number/address.
- **HR Officer:** Admin directories page to search, view, and modify professional roles (Job Title, Department, contact data) for all employees.

### 4. Attendance Management
- **Self-Clocking:** Check-In and Check-Out with real-time status. Enforces a `half-day` tag if the active work duration is under 4 hours.
- **Logs Database:** Admin dashboard to filter all check-ins by employee ID or specific calendar dates, with the ability to override or insert manually clocked records.

### 5. Leave & Time-Off Management
- **Application:** Form inputs for leave types (Paid, Sick, Unpaid), start/end dates, and remarks.
- **Leave Balance tracking:** Enforces strict accrual quotas (Paid: 15 days, Sick: 10 days) per user. Shows remaining/used cards, warns on exceeding balances, and locks request submissions.
- **HR Approval Portal:** Review details, append admin review comments, and approve/reject. Deducts approved duration days from the employee's leave balance in the database.
- **⚡ Leave-Attendance Automation:** Approving a leave request automatically populates corresponding date entries with the "leave" status inside the attendance logs database.

### 6. Payroll & Earnings
- **Admin Control Sheet:** Generate and update salary structures (Base Salary, Allowances, Deductions) for any employee and month/year.
- **Employee Payslips:** View payslip list, pop open formatted monospace salary slips, copy text slips to the clipboard, or generate clean print preview screens.

### 7. Security compliance & Audit Trails
- **Admin Audit Trail Ledger:** Admin-only UI ledger showing system transaction logs (Approve/Reject leaves, Create/Update payroll, edit profile fields) with timestamp, administrator name, action type, changes payload, and client IP address.

---

## ⚙️ Project Launch & Orchestration
We created scripts to boot both servers concurrently with standard developer setup automations:

- **[run.js](file:///c:/Users/sivas/Desktop/Odoo%20X%20NMIT/run.js) (Node.js script):** Detects if backend/frontend `node_modules` are missing and runs `npm install` automatically. It boots both servers concurrently and pipes outputs using color-coded console logs.
- **[run.bat](file:///c:/Users/sivas/Desktop/Odoo%20X%20NMIT/run.bat) (Windows Batch script):** Simply double-click this file in the root workspace folder to launch the orchestrator automatically.

---

## 🔑 Demo Access Credentials
The database seeds with three default users (Password for all accounts: `password123`):

1. **HR / Admin Officer:**
   - **Email:** `admin@dayflow.com`
   - **Employee ID:** `DF-ADMIN-01`
2. **Standard Employee (John):**
   - **Email:** `john.doe@dayflow.com`
   - **Employee ID:** `DF-EMP-01`
3. **Standard Employee (Jane):**
   - **Email:** `jane.smith@dayflow.com`
   - **Employee ID:** `DF-EMP-02`

---

## 🎭 Verification & Testing Status
An automated browser subagent executed a full workflow test suite against the live development servers, validating both roles with zero failures. Furthermore, E2E reproducible test scripts have been checked into the repository using **Playwright**:
- **Employee Flow:** Verified Sign-In, real-time Clock-In/Out updates, applying for Leave (enforcing balance limits), editing profile details, and viewing formatted payslips.
- **Admin Flow:** Verified Sign-In, leave application review/approval with comments, loading attendance logs, modifying employee payroll earnings, and reviewing the audit trail ledger.
- **Security & Integrity:** Standardized password hashing on `$2a$` for cross-platform compatibility with pure JavaScript libraries.

---

## ⚙️ Session Architecture & Limitations
- **JWT Authentication:** Dayflow implements stateless session management using a 24-hour JSON Web Token (JWT) stored in client `localStorage`.
- **Known Limitations:** For this prototype/hackathon scope, there is no server-side token blacklisting (Redis revoke list) or refresh token rotation mechanism. Logging out simply discards the token from client storage. Production applications should integrate HTTP-only cookies, token blacklisting, and a short token expiration (e.g. 15 minutes) with refresh tokens.
