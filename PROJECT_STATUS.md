# Dayflow HRMS — Project Status Report

## 📊 Project Completion Summary
* **Status:** **Completed (Production-Ready Prototype)**
* **Branch:** `main` (Successfully merged, resolved conflicts, and tracked with `origin/main`)
* **Frameworks:** React (Vite) + Tailwind CSS v3 / Node.js + Express / PostgreSQL

---

## 🛠️ Implemented Features & Modules

### 1. Authentication & Authorization
- **Sign Up:** Enforces password policies, checks database for duplicate Employee IDs/Emails, automatically registers a base user profile, and triggers a mock activation token.
- **Sign In:** Leverages bcrypt comparison, returns JWT access tokens valid for 24 hours, and returns profile settings based on user role.
- **Email Verification page:** Receives token parameters from query URL to verify and unlock account access.

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
- **HR Approval Portal:** Review details, append admin review comments, and approve/reject.
- **⚡ Leave-Attendance Automation:** Approving a leave request automatically populates corresponding date entries with the "leave" status inside the attendance logs database.

### 6. Payroll & Earnings
- **Admin Control Sheet:** Generate and update salary structures (Base Salary, Allowances, Deductions) for any employee and month/year.
- **Employee Payslips:** View payslip list, pop open formatted monospace salary slips, copy text slips to the clipboard, or generate clean print preview screens.

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
