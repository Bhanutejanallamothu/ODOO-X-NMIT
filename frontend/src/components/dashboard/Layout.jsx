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
import Badge from '../common/Badge';

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
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-white border-r border-slate-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header / Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="bg-brand-600 p-2 rounded-xl text-white shadow-lg shadow-brand-500/20">
              <span className="font-extrabold text-base tracking-wider">DF</span>
            </div>
            <div>
              <span className="font-extrabold text-xl text-slate-800 tracking-tight">Dayflow</span>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase -mt-0.5">HRMS</p>
            </div>
          </div>
          <button 
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center space-x-3 bg-slate-50/50">
          <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold shrink-0">
            {user?.name ? user.name.split(' ').map(n=>n[0]).join('').toUpperCase() : 'U'}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-700 truncate">{user?.name}</h4>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <Badge type={user?.role === 'admin' ? 'brand' : 'default'} size="sm">
                {user?.role}
              </Badge>
              <span className="text-[10px] text-slate-400 font-medium truncate">#{user?.employeeId}</span>
            </div>
          </div>
        </div>

        {/* Links Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-150 ${
                  isActive 
                    ? 'bg-brand-50 text-brand-700' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`
              }
            >
              {({ isActive }) => {
                const Icon = link.icon;
                return (
                  <>
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                    {link.name}
                  </>
                );
              }}
            </NavLink>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
          >
            <LogOut className="mr-3 h-5 w-5 text-rose-400" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Workspace Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Header */}
        <header className="bg-white border-b border-slate-100 flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 mr-3 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notification Bell (Visual Only) */}
            <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white"></span>
            </button>
            
            <div className="h-8 w-px bg-slate-100 hidden sm:block"></div>
            
            {/* Role Header Badge */}
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-medium">Role Access:</span>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                {user?.role} Mode
              </span>
            </div>
          </div>
        </header>

        {/* Content Workspace */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
