import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import AttendancePage from './pages/AttendancePage';
import AttendanceLogsPage from './pages/AttendanceLogsPage';
import LeavePage from './pages/LeavePage';
import LeaveRequestsPage from './pages/LeaveRequestsPage';
import PayrollPage from './pages/PayrollPage';
import PayrollSheetPage from './pages/PayrollSheetPage';
import EmployeesPage from './pages/EmployeesPage';
import AuditLogsPage from './pages/AuditLogsPage';

// Components
import Layout from './components/dashboard/Layout';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <svg className="animate-spin h-8 w-8 text-brand-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  
  return children;
};

// Admin Route Guard
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Role-Aware Dashboard Router
const DashboardSwitcher = () => {
  const { user } = useAuth();
  return user?.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected Portal Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Redirect root to dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Common dashboard switcher path */}
            <Route path="dashboard" element={<DashboardSwitcher />} />
            
            {/* Common Profile path */}
            <Route path="profile" element={<ProfilePage />} />
            
            {/* Employee Scope Portal paths */}
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="leaves" element={<LeavePage />} />
            <Route path="payroll" element={<PayrollPage />} />
            
            {/* Admin Scope Portal paths */}
            <Route 
              path="employees" 
              element={
                <AdminRoute>
                  <EmployeesPage />
                </AdminRoute>
              } 
            />
            <Route 
              path="attendance-logs" 
              element={
                <AdminRoute>
                  <AttendanceLogsPage />
                </AdminRoute>
              } 
            />
            <Route 
              path="leave-requests" 
              element={
                <AdminRoute>
                  <LeaveRequestsPage />
                </AdminRoute>
              } 
            />
            <Route 
              path="payroll-sheet" 
              element={
                <AdminRoute>
                  <PayrollSheetPage />
                </AdminRoute>
              } 
            />
            <Route 
              path="audit-logs" 
              element={
                <AdminRoute>
                  <AuditLogsPage />
                </AdminRoute>
              } 
            />
          </Route>

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
