import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
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
  Bell,
  Shield
} from 'lucide-react';
import { LimelightNav } from '../ui/LimelightNav';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const employeeLinks = [
    { id: 'dashboard', name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard /> },
    { id: 'profile', name: 'My Profile', path: '/profile', icon: <User /> },
    { id: 'attendance', name: 'My Attendance', path: '/attendance', icon: <CalendarDays /> },
    { id: 'leaves', name: 'My Leaves', path: '/leaves', icon: <CalendarCheck /> },
    { id: 'payroll', name: 'My Payroll', path: '/payroll', icon: <CreditCard /> },
  ];

  const adminLinks = [
    { id: 'dashboard', name: 'HR Dashboard', path: '/dashboard', icon: <LayoutDashboard /> },
    { id: 'employees', name: 'Employees', path: '/employees', icon: <Users /> },
    { id: 'attendance-logs', name: 'Attendance Logs', path: '/attendance-logs', icon: <CalendarDays /> },
    { id: 'leave-requests', name: 'Leave Requests', path: '/leave-requests', icon: <CalendarCheck /> },
    { id: 'payroll-sheet', name: 'Payroll Sheet', path: '/payroll-sheet', icon: <FileSpreadsheet /> },
    { id: 'audit-logs', name: 'Audit Logs', path: '/audit-logs', icon: <Shield /> },
  ];

  const links = user?.role === 'admin' ? adminLinks : employeeLinks;

  const currentPath = location.pathname;
  const activeIndex = Math.max(
    0,
    links.findIndex((link) => currentPath.includes(link.path))
  );

  const navItems = links.map((link) => ({
    id: link.id,
    icon: link.icon,
    label: link.name,
    onClick: () => navigate(link.path),
  }));

  return (
    <div className="flex flex-col min-h-screen bg-transparent relative pt-4">
      {/* Header */}
      <header className="bg-paper-surface border-b border-paper-border flex items-center justify-between px-6 lg:px-8 py-3.5 z-10 sticky top-0">
        <div className="flex items-center space-x-4">
          <div className="bg-brand-600 p-[7px] rounded-[8px] text-white shadow-paper-sm flex items-center justify-center">
            <span className="font-extrabold text-[15px] tracking-wider">DF</span>
          </div>
          <div>
            <h1 className="text-[15px] font-bold text-paper-text tracking-tight">
              Dayflow
            </h1>
            <p className="text-[10px] text-paper-muted font-bold tracking-widest uppercase">HRMS</p>
          </div>
        </div>

        {/* Top Nav (Centered) */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
          <LimelightNav 
            items={navItems}
            defaultActiveIndex={activeIndex}
          />
        </div>

        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <button className="p-1.5 rounded-md text-paper-muted hover:text-paper-text hover:bg-paper-raised hover:shadow-paper-inset transition-all relative">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-brand-500"></span>
          </button>
          
          <div className="h-6 w-px bg-white/40 hidden sm:block"></div>

          {/* User Section */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <h4 className="text-[13px] font-bold text-paper-text leading-tight">{user?.name}</h4>
              <span className="text-[9px] font-bold uppercase tracking-wider text-paper-muted">{user?.role} Mode</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-paper-raised border border-paper-border shadow-paper-sm flex items-center justify-center text-paper-text font-bold shrink-0 text-sm">
              {user?.name ? user.name.split(' ').map(n=>n[0]).join('').toUpperCase() : 'U'}
            </div>
            
            <button
              onClick={handleLogout}
              className="p-1.5 ml-2 rounded-md text-rose-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
              title="Logout"
            >
              <LogOut className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Top Nav */}
      <div className="md:hidden flex justify-center w-full py-4 bg-transparent z-10 sticky top-[65px] border-b border-paper-border">
        <LimelightNav 
          items={navItems}
          defaultActiveIndex={activeIndex}
          className="scale-90"
        />
      </div>

      {/* Content Workspace */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:px-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
