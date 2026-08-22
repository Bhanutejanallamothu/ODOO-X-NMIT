import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { 
  Clock, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  ClipboardList, 
  AlertCircle,
  FileCheck,
  Briefcase
} from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  
  // Dashboard states
  const [clockStatus, setClockStatus] = useState({ checkedIn: false, checkedOut: false, record: null });
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [recentPayroll, setRecentPayroll] = useState(null);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Today's Clock Status
      const todayRes = await api.get('/attendance/today');
      if (todayRes.data.success) {
        setClockStatus(todayRes.data);
      }

      // 2. Fetch Recent Leaves
      const leavesRes = await api.get('/leaves/me');
      if (leavesRes.data.success) {
        setRecentLeaves(leavesRes.data.leaves.slice(0, 3));
      }

      // 3. Fetch Recent Payroll
      const payrollRes = await api.get('/payroll/me');
      if (payrollRes.data.success && payrollRes.data.payrolls.length > 0) {
        setRecentPayroll(payrollRes.data.payrolls[0]);
      }

      // 4. Fetch Attendance Logs
      const logsRes = await api.get('/attendance/me');
      if (logsRes.data.success) {
        setAttendanceLogs(logsRes.data.records.slice(0, 5));
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Could not load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCheckIn = async () => {
    setActionLoading(true);
    setError('');
    try {
      const res = await api.post('/attendance/checkin');
      if (res.data.success) {
        setClockStatus({
          checkedIn: true,
          checkedOut: false,
          record: res.data.attendance
        });
        fetchDashboardData(); // Refresh history
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Check-in failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setError('');
    try {
      const res = await api.post('/attendance/checkout');
      if (res.data.success) {
        setClockStatus({
          checkedIn: true,
          checkedOut: true,
          record: res.data.attendance
        });
        fetchDashboardData(); // Refresh history
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Check-out failed.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg className="animate-spin h-8 w-8 text-brand-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  // Format date helper
  const formatTime = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-[13px] font-semibold text-rose-600 rounded-[10px] flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid: Clock In card & KPI summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Clock In / Out Controller Card */}
        <Card 
          title="Attendance Portal" 
          subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          className="lg:col-span-2"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-paper-muted uppercase tracking-wider">Current Status</span>
              
              {!clockStatus.checkedIn && (
                <div className="flex items-center space-x-2 text-paper-muted">
                  <Clock className="h-[18px] w-[18px]" />
                  <span className="text-[13px] font-semibold text-paper-text">Not checked in today.</span>
                </div>
              )}
              {clockStatus.checkedIn && !clockStatus.checkedOut && (
                <div className="flex items-center space-x-2 text-brand-600">
                  <Clock className="h-[18px] w-[18px] animate-pulse" />
                  <span className="text-[13px] font-bold">Checked In at {formatTime(clockStatus.record?.check_in)}</span>
                </div>
              )}
              {clockStatus.checkedIn && clockStatus.checkedOut && (
                <div className="flex items-center space-x-2 text-paper-text">
                  <FileCheck className="h-[18px] w-[18px] text-paper-muted" />
                  <span className="text-[13px] font-bold">
                    Completed today (Out: {formatTime(clockStatus.record?.check_out)})
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <Button
                variant="primary"
                onClick={handleCheckIn}
                disabled={clockStatus.checkedIn}
                loading={actionLoading}
                className="px-6 py-2.5 shadow-paper text-[13px]"
                icon={ArrowUpRight}
              >
                Clock In
              </Button>
              <Button
                variant="secondary"
                onClick={handleCheckOut}
                disabled={!clockStatus.checkedIn || clockStatus.checkedOut}
                loading={actionLoading}
                className="px-6 py-2.5 shadow-paper text-[13px] bg-paper-bg"
                icon={ArrowDownRight}
              >
                Clock Out
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick KPI stats card */}
        <Card title="Quick Summary" className="h-full">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-paper-bg rounded-[8px] border border-paper-border shadow-paper-inset">
              <span className="text-paper-muted text-[10px] font-bold uppercase tracking-wider">Salary (Aug)</span>
              <p className="text-[16px] font-extrabold text-paper-text mt-1">
                {recentPayroll ? `$${parseFloat(recentPayroll.net_salary).toFixed(2)}` : 'N/A'}
              </p>
            </div>
            <div className="p-4 bg-paper-bg rounded-[8px] border border-paper-border shadow-paper-inset">
              <span className="text-paper-muted text-[10px] font-bold uppercase tracking-wider">Job Role</span>
              <p className="text-[13px] font-extrabold text-paper-text truncate mt-1">
                {user?.jobTitle || 'Unassigned'}
              </p>
            </div>
          </div>
        </Card>

      </div>

      {/* Main dashboard columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Leaves Card */}
        <Card 
          title="Recent Leaves" 
          subtitle="View status of your submissions"
          actions={
            <Button variant="secondary" size="sm" onClick={() => window.location.href='/leaves'}>
              View All
            </Button>
          }
        >
          <div className="space-y-3">
            {recentLeaves.length === 0 ? (
              <p className="text-[13px] text-paper-muted text-center py-6">No recent leave applications.</p>
            ) : (
              recentLeaves.map((leave) => {
                const badgeType = 
                  leave.status === 'approved' ? 'success' : 
                  leave.status === 'rejected' ? 'danger' : 'warning';
                
                return (
                  <div key={leave.id} className="flex items-center justify-between p-3.5 bg-paper-bg border border-paper-border shadow-paper-sm rounded-[8px]">
                    <div>
                      <h4 className="text-[13px] font-bold text-paper-text tracking-tight uppercase">{leave.leave_type} Leave</h4>
                      <p className="text-[11px] text-paper-muted mt-0.5">
                        {new Date(leave.start_date).toLocaleDateString()} to {new Date(leave.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge type={badgeType}>{leave.status}</Badge>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Recent Attendance Log Card */}
        <Card 
          title="Recent Attendance" 
          subtitle="Showing clock logs for the current week"
          actions={
            <Button variant="secondary" size="sm" onClick={() => window.location.href='/attendance'}>
              View Log
            </Button>
          }
        >
          <div className="space-y-3">
            {attendanceLogs.length === 0 ? (
              <p className="text-[13px] text-paper-muted text-center py-6">No clock records logged.</p>
            ) : (
              attendanceLogs.map((log) => {
                const badgeType = 
                  log.status === 'present' ? 'success' :
                  log.status === 'half-day' ? 'warning' :
                  log.status === 'leave' ? 'info' : 'danger';
                
                return (
                  <div key={log.id} className="flex items-center justify-between p-3.5 bg-paper-bg border border-paper-border shadow-paper-sm rounded-[8px]">
                    <div className="space-y-0.5">
                      <p className="text-[13px] font-bold text-paper-text">
                        {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-[11px] text-paper-muted">
                        {formatTime(log.check_in)} - {formatTime(log.check_out)}
                      </p>
                    </div>
                    <Badge type={badgeType}>{log.status}</Badge>
                  </div>
                );
              })
            )}
          </div>
        </Card>

      </div>
      
    </div>
  );
};

export default EmployeeDashboard;
