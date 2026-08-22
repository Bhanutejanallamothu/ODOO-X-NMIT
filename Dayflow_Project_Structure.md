# Dayflow — Human Resource Management System (HRMS)
**Tagline:** Every workday, perfectly aligned.

---

## 1. Overview

Dayflow is a Human Resource Management System designed to digitize and streamline core HR operations. It replaces manual, fragmented HR processes with a single platform covering onboarding, profile management, attendance tracking, leave management, payroll visibility, and admin approval workflows.

**Core scope:**
- Secure authentication (Sign Up / Sign In)
- Role-based access (Admin vs Employee)
- Employee profile management
- Attendance tracking (daily/weekly view)
- Leave and time-off management
- Approval workflows for HR/Admin

---

## 2. User Roles

| Role | Description | Access Level |
|---|---|---|
| **Admin / HR Officer** | Manages employees, approves leave & attendance, views/edits payroll | Full access |
| **Employee** | Views personal profile, attendance, applies for leave, views salary details | Restricted, self-scoped access |

---

## 3. Functional Modules

### 3.1 Authentication & Authorization
- **Sign Up:** Register via Employee ID, Email, Password, Role (Employee/HR); enforced password rules; mandatory email verification.
- **Sign In:** Email + password login; clear error messaging on bad credentials; redirect to role-based dashboard on success.

### 3.2 Dashboard
- **Employee Dashboard:** Quick-access cards — Profile, Attendance, Leave Requests, Logout; recent activity/alerts feed.
- **Admin/HR Dashboard:** Employee list, attendance records, leave approvals, ability to switch between employee views.

### 3.3 Employee Profile Management
- **View:** Personal details, job details, salary structure, documents, profile picture.
- **Edit:** Employees can edit limited fields (address, phone, profile picture). Admin can edit all fields.

### 3.4 Attendance Management
- Daily/weekly attendance views.
- Check-in / check-out capability for employees.
- Status types: Present, Absent, Half-day, Leave.
- Employees see only their own records; Admin/HR sees all.

### 3.5 Leave & Time-Off Management
- **Apply (Employee):** Leave type (Paid/Sick/Unpaid), date range, remarks. Status: Pending → Approved/Rejected.
- **Approve (Admin/HR):** View all requests, approve/reject, add comments; changes reflect immediately in employee records.

### 3.6 Payroll / Salary Management
- **Employee view:** Read-only payroll data.
- **Admin control:** View all payroll, update salary structures, ensure payroll accuracy.

### 3.7 Notifications & Reporting
- Email & in-app notification alerts.
- Analytics & reports dashboard (salary slips, attendance reports, etc.).

---

## 4. Suggested Project Structure

```
dayflow-hrms/
│
├── backend/
│   ├── src/
│   │   ├── config/                # DB, env, mail service config
│   │   ├── models/
│   │   │   ├── User.js            # Base user (Admin/Employee) schema
│   │   │   ├── Profile.js
│   │   │   ├── Attendance.js
│   │   │   ├── Leave.js
│   │   │   └── Payroll.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── profileController.js
│   │   │   ├── attendanceController.js
│   │   │   ├── leaveController.js
│   │   │   └── payrollController.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── profile.routes.js
│   │   │   ├── attendance.routes.js
│   │   │   ├── leave.routes.js
│   │   │   └── payroll.routes.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js  # JWT verification
│   │   │   ├── roleMiddleware.js  # Admin/Employee guard
│   │   │   └── errorHandler.js
│   │   ├── services/
│   │   │   ├── emailService.js    # Verification + alert emails
│   │   │   └── reportService.js   # Salary slip / report generation
│   │   ├── utils/
│   │   └── app.js
│   ├── tests/
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/             # Buttons, Cards, Modals, Navbar
│   │   │   ├── auth/               # SignIn, SignUp forms
│   │   │   ├── dashboard/          # Employee & Admin dashboard widgets
│   │   │   ├── profile/
│   │   │   ├── attendance/
│   │   │   ├── leave/
│   │   │   └── payroll/
│   │   ├── pages/
│   │   │   ├── SignInPage.jsx
│   │   │   ├── SignUpPage.jsx
│   │   │   ├── EmployeeDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── AttendancePage.jsx
│   │   │   ├── LeavePage.jsx
│   │   │   └── PayrollPage.jsx
│   │   ├── context/                # Auth context, Role context
│   │   ├── hooks/
│   │   ├── services/                # API call wrappers (axios)
│   │   ├── routes/                  # Protected & role-based routing
│   │   └── App.jsx
│   ├── public/
│   └── package.json
│
├── database/
│   ├── schema.sql / migrations/
│   └── seed-data/
│
├── docs/
│   ├── requirements.md              # This document
│   ├── api-spec.md
│   └── er-diagram.png
│
└── README.md
```

---

## 5. Core Data Entities

| Entity | Key Fields |
|---|---|
| **User** | id, employeeId, email, passwordHash, role (admin/employee), isVerified |
| **Profile** | userId, name, phone, address, jobTitle, department, documents[], profilePicture |
| **Attendance** | userId, date, checkIn, checkOut, status (present/absent/half-day/leave) |
| **LeaveRequest** | userId, leaveType (paid/sick/unpaid), startDate, endDate, remarks, status, adminComments |
| **Payroll** | userId, baseSalary, deductions, allowances, netSalary, month/year |

---

## 6. Non-Functional Requirements (Recommended)

- **Security:** Password hashing (bcrypt), JWT-based sessions, role-based route guards, HTTPS in production.
- **Scalability:** Modular backend to support growing employee counts and future modules.
- **Usability:** Responsive dashboards for both desktop and mobile HR usage.
- **Reliability:** Leave/attendance state changes must reflect immediately and consistently across views.
- **Auditability:** Log admin actions (approvals, payroll edits) for accountability.

---

## 7. Suggested Tech Stack

- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Node.js + Express (or FastAPI if Python is preferred)
- **Database:** PostgreSQL / MongoDB
- **Auth:** JWT + bcrypt, email verification via Nodemailer/SendGrid
- **Design Reference:** [Excalidraw wireframes](https://link.excalidraw.com/l/65VNwvy7c4X/58RLEJ4oOwh)

---

## 8. Design System

A locked design system before component work begins, to keep Admin and Employee views visually consistent:

- **Palette:** 2–3 brand colors (primary, accent) + a neutral gray scale (backgrounds, borders, text). Define once as CSS variables / Tailwind theme tokens — don't pick colors per-screen.
- **Typography:** One heading font, one body font. Consistent scale (e.g., `text-sm / base / lg / xl / 2xl`) reused everywhere.
- **Spacing:** Use a single spacing scale (Tailwind's default `4px` increments) — no ad hoc `margin: 13px`.
- **Component library:** Build a shared set (Button, Card, Modal, Badge/Status pill, Input, Table) once in `components/common/`, and compose every page from these rather than styling inline per-page.
- **Navigation:** A persistent sidebar or top nav on every authenticated page (not just dashboard cards), with:
  - Clear active-state highlighting for the current page.
  - Role-aware menu items — Admin sees "Employees," "Payroll Control," "Approvals"; Employee sees "My Profile," "My Attendance," "My Leave."
  - Consistent placement (left sidebar recommended) and adequate spacing so it doesn't feel cramped on smaller screens.
- **Responsiveness:** Mobile-first breakpoints; sidebar collapses to a hamburger/bottom nav on small screens; tables become stacked cards on mobile rather than horizontally scrolling.

---

## 9. Validation Strategy

Validation must exist at **both** layers — client-side alone is not sufficient since it can be bypassed.

**Client-side (immediate UX feedback):**
- Use a schema library (Zod, Yup, or React Hook Form + resolver) for all forms.
- Examples: email format on Sign Up/Sign In, password strength rules, leave `endDate >= startDate`, required fields on profile edit, file type/size limits on document/profile picture upload.
- Show inline field-level errors, not just a generic toast.

**Server-side (source of truth, never trust the client):**
- Re-validate every input on the backend (e.g., `express-validator`, `Joi`, or Pydantic if using FastAPI) before hitting the database.
- Enforce role checks server-side too — e.g., an Employee's edit-profile request should be rejected server-side if they try to change a restricted field, even if the frontend hides that field.
- Return a consistent error response shape (`{ field, message }[]`) so the frontend can map errors back to the right input.
- Sanitize inputs to prevent injection (parameterized queries / ORM usage — never raw string-concatenated SQL).

---

## 10. Team Workflow & Version Control

- **Git usage:** Every team member commits under their own name/account — no single-person "final push" of everyone's work. Contribution history is part of how this gets evaluated.
- **Branching:** Feature branches per module (e.g., `feature/leave-approval`, `feature/attendance-checkin`), never direct commits to `main`.
- **Pull Requests:** All merges to `main` go through a PR with at least one teammate review/approval before merging.
- **Commit hygiene:** Small, frequent, descriptive commits (`"add leave date-range validation"`, not `"update"` or `"final"`). Avoid one giant end-of-project commit.
- **Repo hygiene:** `.gitignore` for `node_modules`, `.env`, build output; no committed secrets or API keys.
- **Task tracking:** A shared board (GitHub Projects/Issues, Trello, or Notion) mapping who owns which module, to keep work visibly distributed across the team.
- **Local/offline resilience:** A `docker-compose.yml` to spin up frontend + backend + DB locally without depending on a cloud service — protects demos from flaky internet and lets the team develop without shared cloud infra.

---

## 11. Future Enhancements

- Advanced analytics & reporting dashboard (attendance trends, payroll summaries).
- Mobile app version for check-in/check-out and leave requests.
- Integration with third-party payroll/tax systems.
- Push notifications for approvals and reminders.
- Document e-signature workflow for HR paperwork.

---

*Derived from the "Dayflow — Human Resource Management System" problem statement document.*
