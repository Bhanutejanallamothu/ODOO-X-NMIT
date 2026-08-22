# Dayflow — Human Resource Management System (HRMS)
> Every workday, perfectly aligned.

Dayflow is a modern, premium Human Resource Management System (HRMS) designed to digitize, automate, and simplify core HR operations. The application is built as a complete full-stack web application with a React frontend and Node.js/Express backend, backed by PostgreSQL.

---

## 🚀 Core Features

- **Secure Role-Based Access:** Standard Employee portal and Admin/HR portal with route guards and JWT-based authentication.
- **Self-Clocking Attendance Portal:** Check-In and Check-Out with real-time status and half-day checks.
- **Automated Leave & Time-off Management:** Employees apply for leaves, and Admin reviews them. Upon approval, attendance logs for the requested dates are **automatically populated** as "leave" in the database.
- **Company Payroll Sheets:** Admin generates and updates salary details, and employees can view past slips and generate/print formal text-based salary slips.
- **Employee Directories:** Search, view, and edit employee profile records as Admin.
- **Developer-Resilient Email flow:** Email verification is required to complete registration. If SMTP variables are not configured, verification links and approval alerts are outputted directly to the backend terminal for ease of evaluation.

---

## 🛠️ Project Structure

```
dayflow-hrms/
├── backend/                  # Node.js + Express API server
│   ├── src/
│   │   ├── config/           # DB setup (db.js)
│   │   ├── controllers/      # Route controllers (Auth, Profile, Attendance, Leave, Payroll)
│   │   ├── middleware/       # JWT parsing, Role guards, Error handling
│   │   ├── routes/           # REST Router endpoints
│   │   ├── services/         # Email service (SMTP + Console mode), Report generator
│   │   └── app.js            # Entry point
│   ├── tests/                # DB connection verification script
│   └── package.json
│
├── frontend/                 # React + Vite + Tailwind CSS SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/       # Buttons, Cards, Inputs, Modals, Tables, Badges
│   │   │   └── dashboard/    # Sidebar and Layout panels
│   │   ├── context/          # Auth context and Session sync
│   │   ├── pages/            # Login, Signup, Verify Email, Dashboards, Profiles, Logs
│   │   ├── services/         # API HTTP Client (Axios + interceptors)
│   │   ├── App.jsx           # Main routing & guards
│   │   ├── main.jsx
│   │   └── index.css         # Tailwind + Glassmorphism design system
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── database/                 # Database schema and mock records
    ├── schema.sql            # Table definitions (PostgreSQL compatible)
    └── seed-data/
        └── seed.sql          # Sample database populate script
```

---

## 💻 Setup Instructions

### 1. Database Setup
Ensure you have **PostgreSQL** running locally.
Configure database settings in `backend/.env`. (Default connection string is: `postgresql://postgres:postgres@localhost:5432/dayflow`).

You can verify your connection settings by running:
```bash
cd backend
npm install
node tests/verify_db.js
```
*Note: The backend is programmed to automatically check if the database exists, create it, create the tables from `schema.sql`, and populate mock data from `seed.sql` on startup!*

### 2. Single-Command Launch (Recommended)
You can build and start both servers concurrently using the provided launcher:

**On Windows:**
Simply double-click the `run.bat` file in the root directory.

**Or via Terminal (Cross-platform):**
Run the following command in the root directory:
```bash
node run.js
```
*This command will check for missing dependencies, run `npm install` automatically in both folders if needed, and spin up both dev servers with color-coded log outputs.*

---

### 3. Manual Server Launch (Alternative)

**Run Backend Server:**
```bash
cd backend
npm install
npm run dev
```
The server will run on `http://localhost:5000`.

**Run Frontend Server:**
In a separate terminal window:
```bash
cd frontend
npm install
npm run dev
```
The client will run on `http://localhost:5173`.

---

## 🔑 Demo Credentials
The database seeds with three default users (Password for all accounts is: `password123`):

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

## ⚡ Key Workflows to Test

1. **Register New Employee:** Go to `/signup`, register a new user, check the backend terminal logs for the mock verification link, paste the link in your browser, and verify your account before logging in.
2. **Clock In & Out:** Log in as `john.doe@dayflow.com`, click **Clock In** on the dashboard. Click **Clock Out** later to complete your session.
3. **Submit Leave:** Apply for leaves (e.g., Sick leave) from `/leaves`.
4. **Approve Leave & Sync Attendance:** Log in as `admin@dayflow.com`. Go to **Leave Requests**, click **Action** to approve the request with admin comments. Go to **Attendance Logs** or the employee's portal to see that those dates have been automatically filled with the **Leave** status.
5. **Update Salary Slip:** From **Payroll Sheet** on the admin portal, click the edit button to adjust base salaries, allowances, or deductions. View the formatted, printable receipt slip.
