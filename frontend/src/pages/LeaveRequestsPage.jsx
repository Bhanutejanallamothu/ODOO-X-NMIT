import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import { CalendarCheck, AlertCircle, Check, X } from 'lucide-react';

const LeaveRequestsPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Status filter state
  const [filterStatus, setFilterStatus] = useState('');

  // Approval Modal states
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [actionComments, setActionComments] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/leaves/all');
      if (res.data.success) {
        setLeaves(res.data.leaves);
      }
    } catch (err) {
      console.error('Error fetching leaves:', err);
      setError('Could not load leave requests data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
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
        fetchLeaves(); // Refresh
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update leave status.');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Employee',
      accessor: 'name',
      render: (row) => (
        <div>
          <span className="font-bold text-slate-700">{row.name}</span>
          <span className="text-xs text-slate-400 block font-medium">#{row.employee_id} | {row.department}</span>
        </div>
      )
    },
    {
      header: 'Leave Type',
      accessor: 'leave_type',
      render: (row) => <span className="font-bold text-slate-700 uppercase">{row.leave_type}</span>
    },
    {
      header: 'Duration',
      accessor: 'start_date',
      render: (row) => (
        <span className="font-medium text-slate-600">
          {new Date(row.start_date).toLocaleDateString()} - {new Date(row.end_date).toLocaleDateString()}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        const type = 
          row.status === 'approved' ? 'success' : 
          row.status === 'rejected' ? 'danger' : 'warning';
        return <Badge type={type}>{row.status}</Badge>;
      }
    },
    {
      header: 'Remarks',
      accessor: 'remarks',
      render: (row) => (
        <div className="max-w-[150px] truncate text-xs text-slate-500 font-medium" title={row.remarks}>
          {row.remarks || '-'}
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        row.status === 'pending' ? (
          <Button variant="primary" size="sm" onClick={() => openApprovalModal(row)}>
            Action
          </Button>
        ) : (
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Processed</span>
        )
      )
    }
  ];

  const filteredLeaves = filterStatus 
    ? leaves.filter(l => l.status === filterStatus) 
    : leaves;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-xs font-semibold text-rose-600 rounded-xl flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter panel */}
      <Card title="Filter Requests" bodyClassName="p-5">
        <div className="flex flex-col space-y-1 max-w-sm">
          <label className="text-sm font-semibold text-slate-700">Filter Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            <option value="">All Applications</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </Card>

      <Card 
        title="Leave Requests Ledger" 
        subtitle="Manage employee leave requests"
        actions={
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
            <CalendarCheck className="h-4 w-4 text-slate-400" />
            <span>Total Submissions: {filteredLeaves.length}</span>
          </div>
        }
      >
        <Table
          columns={columns}
          data={filteredLeaves}
          loading={loading}
          emptyMessage="No leave requests logged."
        />
      </Card>

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

export default LeaveRequestsPage;
