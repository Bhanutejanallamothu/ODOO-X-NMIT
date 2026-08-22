import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  User, 
  CalendarDays, 
  FileSpreadsheet, 
  CreditCard, 
  LogOut, 
  Users, 
  CalendarCheck, 
  Menu, 
  X,
  Bell,
  Shield
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const employeeLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'My Attendance', path: '/attendance', icon: CalendarDays },
    { name: 'My Leaves', path: '/leaves', icon: CalendarCheck },
    { name: 'My Payroll', path: '/payroll', icon: CreditCard },
  ];

  const adminLinks = [
    { name: 'HR Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Employees', path: '/employees', icon: Users },
    { name: 'Attendance Logs', path: '/attendance-logs', icon: CalendarDays },
    { name: 'Leave Requests', path: '/leave-requests', icon: CalendarCheck },
    { name: 'Payroll Sheet', path: '/payroll-sheet', icon: FileSpreadsheet },
    { name: 'Audit Logs', path: '/audit-logs', icon: Shield },
  ];

  const links = user?.role === 'admin' ? adminLinks : employeeLinks;

  return (
    <div className="flex min-h-screen bg-paper-bg">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-[#D3D8E5]/70 backdrop-blur-[2px] lg:hidden transition-all duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-[250px] bg-paper-surface border-r border-paper-border shadow-[4px_0_15px_rgba(163,174,194,0.1)] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header / Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/40">
          <div className="flex items-center space-x-2.5">
            <div className="bg-brand-600 p-[7px] rounded-[8px] text-white shadow-paper-sm">
              <span className="font-extrabold text-[15px] tracking-wider">DF</span>
            </div>
            <div>
              <span className="font-extrabold text-[18px] text-paper-text tracking-tight">Dayflow</span>
              <p className="text-[9px] text-paper-muted font-bold tracking-widest uppercase -mt-0.5">HRMS</p>
            </div>
          </div>
          <button 
            className="p-1.5 rounded-lg text-paper-muted hover:text-paper-text hover:bg-paper-raised lg:hidden transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* User Card */}
        <div className="px-6 py-5 border-b border-white/40 flex items-center space-x-3 bg-paper-raised/30">
          <div className="h-9 w-9 rounded-full bg-paper-surface border border-paper-border shadow-paper-sm flex items-center justify-center text-paper-text font-bold shrink-0 text-sm">
            {user?.name ? user.name.split(' ').map(n=>n[0]).join('').toUpperCase() : 'U'}
          </div>
          <div className="min-w-0">
            <h4 className="text-[13px] font-bold text-paper-text truncate">{user?.name}</h4>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-paper-muted bg-paper-raised px-1.5 py-0.5 rounded border border-paper-border">{user?.role}</span>
              <span className="text-[10px] text-paper-muted font-medium truncate">#{user?.employeeId}</span>
            </div>
          </div>
        </div>

        {/* Links Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => 
                `flex items-center px-4 py-2.5 text-[13px] font-semibold rounded-[8px] transition-all duration-200 border ${
                  isActive 
                    ? 'bg-paper-raised text-brand-600 shadow-paper-inset border-paper-border' 
                    : 'text-paper-muted border-transparent hover:bg-paper-surface hover:text-paper-text'
                }`
              }
            >
              {({ isActive }) => {
                const Icon = link.icon;
                return (
                  <>
                    <Icon className={`mr-3 h-[18px] w-[18px] ${isActive ? 'text-brand-500' : 'text-paper-muted'}`} />
                    {link.name}
                  </>
                );
              }}
            </NavLink>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-white/40">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2.5 text-[13px] font-bold text-rose-500 bg-paper-surface border border-transparent hover:border-rose-100 hover:bg-rose-50 hover:shadow-paper-sm rounded-[8px] transition-all duration-200"
          >
            <LogOut className="mr-3 h-[18px] w-[18px] text-rose-400" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Workspace Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-paper-surface border-b border-paper-border flex items-center justify-between px-6 lg:px-8 py-3.5 z-10">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 -ml-2 mr-3 rounded-md text-paper-muted hover:text-paper-text hover:bg-paper-raised lg:hidden transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-[15px] font-bold text-paper-text tracking-tight">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <button className="p-1.5 rounded-md text-paper-muted hover:text-paper-text hover:bg-paper-raised hover:shadow-paper-inset transition-all relative">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-brand-500"></span>
            </button>
            
            <div className="h-6 w-px bg-white/40 hidden sm:block"></div>
            
            {/* Role Header Badge */}
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-[11px] text-paper-muted font-medium">Role Access:</span>
              <span className="text-[10px] font-bold text-paper-text bg-paper-surface border border-paper-border shadow-sm px-2 py-0.5 rounded-[4px] uppercase tracking-wider">
                {user?.role} Mode
              </span>
            </div>
          </div>
        </header>

        {/* Content Workspace */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
