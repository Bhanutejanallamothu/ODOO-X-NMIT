import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import { Calendar, Plus, AlertCircle, CheckCircle } from 'lucide-react';

const LeavePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Apply Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    leaveType: 'paid',
    startDate: '',
    endDate: '',
    remarks: ''
  });

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/leaves/me');
      if (res.data.success) {
        setLeaves(res.data.leaves);
      }
    } catch (err) {
      console.error('Error fetching leaves:', err);
      setError('Could not load leaves history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const openApplyModal = () => {
    setFormFields({
      leaveType: 'paid',
      startDate: new Date().toLocaleDateString('en-CA'),
      endDate: new Date().toLocaleDateString('en-CA'),
      remarks: ''
    });
    setSuccess('');
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormFields(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (new Date(formFields.startDate) > new Date(formFields.endDate)) {
      setError('Start date cannot be after end date.');
      setModalLoading(false);
      return;
    }

    try {
      const res = await api.post('/leaves/apply', formFields);
      if (res.data.success) {
        setSuccess('Leave request submitted successfully.');
        setModalOpen(false);
        fetchLeaves();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit leave request.');
    } finally {
      setModalLoading(false);
    }
  };

  const columns = [
    {
      header: 'Leave Type',
      accessor: 'leave_type',
      render: (row) => <span className="font-bold text-slate-700 uppercase">{row.leave_type} Leave</span>
    },
    {
      header: 'Start Date',
      accessor: 'start_date',
      render: (row) => new Date(row.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
    {
      header: 'End Date',
      accessor: 'end_date',
      render: (row) => new Date(row.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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
        <div className="max-w-[200px] truncate text-xs text-slate-500 font-medium" title={row.remarks}>
          {row.remarks || '-'}
        </div>
      )
    },
    {
      header: 'Admin Comments',
      accessor: 'admin_comments',
      render: (row) => (
        <div className="max-w-[200px] truncate text-xs text-slate-400 italic" title={row.admin_comments}>
          {row.admin_comments || '-'}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-xs font-semibold text-rose-600 rounded-xl flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-600 rounded-xl flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <Card 
        title="Leave & Time-Off History" 
        subtitle="Manage your leave logs"
        actions={
          <Button variant="primary" size="sm" onClick={openApplyModal} icon={Plus}>
            Apply for Leave
          </Button>
        }
      >
        <Table
          columns={columns}
          data={leaves}
          loading={loading}
          emptyMessage="No leave requests logged."
        />
      </Card>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Request Leave / Time-Off"
        footer={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleFormSubmit} loading={modalLoading}>
              Submit Request
            </Button>
          </div>
        }
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-sm">
          
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-semibold text-slate-700">Leave Type</label>
            <select
              name="leaveType"
              value={formFields.leaveType}
              onChange={handleFormChange}
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="paid">Paid Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="unpaid">Unpaid Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              name="startDate"
              type="date"
              value={formFields.startDate}
              onChange={handleFormChange}
              required
            />
            <Input
              label="End Date"
              name="endDate"
              type="date"
              value={formFields.endDate}
              onChange={handleFormChange}
              required
            />
          </div>

          <Input
            label="Reason / Remarks"
            name="remarks"
            placeholder="Describe the reason for your leave request..."
            value={formFields.remarks}
            onChange={handleFormChange}
          />

        </form>
      </Modal>

    </div>
  );
};

export default LeavePage;
