import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import { 
  Users, 
  CalendarCheck, 
  FileCheck, 
  Check, 
  X, 
  Clock, 
  AlertCircle,
  FileText
} from 'lucide-react';

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [stats, setStats] = useState({ totalEmployees: 0, presentToday: 0, pendingLeaves: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Approval Modal states
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [actionComments, setActionComments] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const today = new Date().toLocaleDateString('en-CA');

      // 1. Fetch Employees
      const empRes = await api.get('/profiles/employees');
      let employeesList = [];
      if (empRes.data.success) {
        employeesList = empRes.data.employees;
        setEmployees(employeesList);
      }

      // 2. Fetch Attendance for Today
      const attRes = await api.get(`/attendance/all?date=${today}`);
      let attendanceList = [];
      if (attRes.data.success) {
        attendanceList = attRes.data.records;
        setTodayAttendance(attendanceList);
      }

      // 3. Fetch Leaves
      const leavesRes = await api.get('/leaves/all');
      let leavesList = [];
      if (leavesRes.data.success) {
        leavesList = leavesRes.data.leaves;
        setLeaves(leavesList);
      }

      // Calculate stats
      const pendingCount = leavesList.filter(l => l.status === 'pending').length;
      const presentCount = attendanceList.filter(a => a.status === 'present' || a.status === 'half-day').length;

      setStats({
        totalEmployees: employeesList.length,
        presentToday: presentCount,
        pendingLeaves: pendingCount
      });

    } catch (err) {
      console.error('Error fetching admin dashboard:', err);
      setError('Could not load dashboard information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const openApprovalModal = (leave) => {
    setSelectedLeave(leave);
    setActionComments('');
    setApprovalModalOpen(true);
  };

  const handleLeaveDecision = async (status) => {
    if (!selectedLeave) return;
    setActionLoading(true);
    setError('');

    try {
      const res = await api.put(`/leaves/${selectedLeave.id}/status`, {
        status,
        adminComments: actionComments
      });

      if (res.data.success) {
        setApprovalModalOpen(false);
        fetchDashboardData(); // Refresh list & stats
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update leave request.');
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

  const formatTime = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const pendingLeavesList = leaves.filter(l => l.status === 'pending');

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-xs font-semibold text-rose-600 rounded-xl flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-brand-50 rounded-xl text-brand-600 shadow-md shadow-brand-500/5">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Headcount</span>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-0.5">{stats.totalEmployees}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shadow-md shadow-emerald-500/5">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Clocked-In Today</span>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-0.5">{stats.presentToday}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600 shadow-md shadow-amber-500/5">
            <CalendarCheck className="h-6 w-6" />
          </div>
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Pending Leaves</span>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-0.5">{stats.pendingLeaves}</h3>
          </div>
        </div>

      </div>

      {/* Grid: Pending Approvals & Today's Attendance Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Pending Approvals */}
        <Card 
          title="Pending Leave Applications" 
          subtitle="Requests awaiting HR action"
          actions={
            <Badge type={pendingLeavesList.length > 0 ? 'warning' : 'success'} size="sm">
              {pendingLeavesList.length} Pending
            </Badge>
          }
        >
          <div className="space-y-4">
            {pendingLeavesList.length === 0 ? (
              <div className="text-center py-8 text-slate-400 font-medium">
                <FileCheck className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                All clear! No pending leave requests.
              </div>
            ) : (
              pendingLeavesList.map(leave => (
                <div key={leave.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-700">{leave.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{leave.job_title} | {leave.department}</p>
                    <p className="text-xs font-bold text-brand-600 mt-2 uppercase tracking-wide">
                      {leave.leave_type} Leave: {new Date(leave.start_date).toLocaleDateString()} to {new Date(leave.end_date).toLocaleDateString()}
                    </p>
                    {leave.remarks && (
                      <p className="text-xs text-slate-500 italic mt-1.5 shrink border-l-2 border-slate-200 pl-2">
                        "{leave.remarks}"
                      </p>
                    )}
                  </div>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => openApprovalModal(leave)}
                    className="shrink-0 ml-4 font-bold"
                  >
                    Action
                  </Button>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Today's Clock sheet */}
        <Card 
          title="Today's Active Checklist" 
          subtitle="Real-time employee check-in statuses"
        >
          <div className="space-y-4">
            {todayAttendance.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No check-in actions logged today.</p>
            ) : (
              todayAttendance.map((att) => {
                const badgeType = 
                  att.status === 'present' ? 'success' : 
                  att.status === 'half-day' ? 'warning' : 'danger';
                
                return (
                  <div key={att.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div>
                      <h4 className="text-sm font-bold text-slate-700">{att.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        In: {formatTime(att.check_in)} | Out: {formatTime(att.check_out)}
                      </p>
                    </div>
                    <Badge type={badgeType}>{att.status}</Badge>
                  </div>
                );
              })
            )}
          </div>
        </Card>

      </div>

      {/* Leave Approval Modal */}
      <Modal
        isOpen={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        title="Review Leave Application"
        footer={
          <div className="flex space-x-2">
            <Button
              variant="danger"
              onClick={() => handleLeaveDecision('rejected')}
              loading={actionLoading}
              icon={X}
            >
              Reject
            </Button>
            <Button
              variant="success"
              onClick={() => handleLeaveDecision('approved')}
              loading={actionLoading}
              icon={Check}
            >
              Approve
            </Button>
          </div>
        }
      >
        {selectedLeave && (
          <div className="space-y-4 text-sm">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Employee</span>
              <p className="font-bold text-slate-700">{selectedLeave.name} ({selectedLeave.employee_id})</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Leave Type</span>
                <p className="font-semibold text-slate-600 uppercase">{selectedLeave.leave_type}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Duration</span>
                <p className="font-semibold text-slate-600">
                  {new Date(selectedLeave.start_date).toLocaleDateString()} - {new Date(selectedLeave.end_date).toLocaleDateString()}
                </p>
              </div>
            </div>

            {selectedLeave.remarks && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Remarks</span>
                <p className="p-3 bg-slate-50 rounded-xl text-slate-600 italic">"{selectedLeave.remarks}"</p>
              </div>
            )}

            <Input
              label="Admin comments / reason"
              name="comments"
              placeholder="Provide comments regarding approval or rejection..."
              value={actionComments}
              onChange={(e) => setActionComments(e.target.value)}
            />
          </div>
        )}
      </Modal>

    </div>
  );
};

export default AdminDashboard;
