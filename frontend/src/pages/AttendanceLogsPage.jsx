import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import { CalendarDays, AlertCircle, Edit, Plus } from 'lucide-react';

const AttendanceLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter variables
  const [filterDate, setFilterDate] = useState('');
  const [filterEmployeeId, setFilterEmployeeId] = useState('');

  // Upsert Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formFields, setFormFields] = useState({
    userId: '',
    date: new Date().toLocaleDateString('en-CA'),
    checkIn: '',
    checkOut: '',
    status: 'present'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch Employees
      const empRes = await api.get('/profiles/employees');
      if (empRes.data.success) {
        setEmployees(empRes.data.employees);
      }

      // Fetch Attendance records
      let url = '/attendance/all';
      const params = [];
      if (filterDate) params.push(`date=${filterDate}`);
      if (filterEmployeeId) params.push(`userId=${filterEmployeeId}`);
      
      if (params.length > 0) {
        url += '?' + params.join('&');
      }

      const attRes = await api.get(url);
      if (attRes.data.success) {
        setLogs(attRes.data.records);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError('Could not fetch attendance database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterDate, filterEmployeeId]);

  const openUpsertModal = (record = null) => {
    if (record) {
      setSelectedRecord(record);
      // Format timestamps for datetime-local input fields (e.g. YYYY-MM-DDTHH:MM)
      const formatDT = (isoString) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        // adjust to local YYYY-MM-DDTHH:MM format
        const pad = (num) => String(num).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      };

      setFormFields({
        userId: record.user_id,
        date: record.date.slice(0, 10),
        checkIn: formatDT(record.check_in),
        checkOut: formatDT(record.check_out),
        status: record.status
      });
    } else {
      setSelectedRecord(null);
      setFormFields({
        userId: employees[0]?.id || '',
        date: new Date().toLocaleDateString('en-CA'),
        checkIn: '',
        checkOut: '',
        status: 'present'
      });
    }
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

    try {
      const res = await api.post('/attendance/admin-update', formFields);
      if (res.data.success) {
        setModalOpen(false);
        fetchData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit log entry.');
    } finally {
      setModalLoading(false);
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
      header: 'Date',
      accessor: 'date',
      render: (row) => new Date(row.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    },
    {
      header: 'Check-In',
      accessor: 'check_in',
      render: (row) => <span className="font-semibold">{formatTime(row.check_in)}</span>
    },
    {
      header: 'Check-Out',
      accessor: 'check_out',
      render: (row) => <span className="font-semibold">{formatTime(row.check_out)}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        const type = 
          row.status === 'present' ? 'success' : 
          row.status === 'half-day' ? 'warning' :
          row.status === 'leave' ? 'info' : 'danger';
        return <Badge type={type}>{row.status}</Badge>;
      }
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <Button variant="outline" size="sm" onClick={() => openUpsertModal(row)}>
          <Edit className="h-3.5 w-3.5" />
        </Button>
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

      {/* Filter panel */}
      <Card title="Attendance Database Filters" bodyClassName="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Filter Date"
            name="filterDate"
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-semibold text-slate-700">Filter Employee</label>
            <select
              value={filterEmployeeId}
              onChange={(e) => setFilterEmployeeId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="">All Employees</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} ({emp.employee_id})</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card 
        title="Employee Clock Sheets" 
        subtitle="Manage employee check-ins"
        actions={
          <Button variant="primary" size="sm" onClick={() => openUpsertModal(null)} icon={Plus}>
            Log Record
          </Button>
        }
      >
        <Table
          columns={columns}
          data={logs}
          loading={loading}
          emptyMessage="No attendance records match your filter criteria."
        />
      </Card>

      {/* Log Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedRecord ? 'Edit Clock Log' : 'Create Clock Log'}
        footer={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleFormSubmit} loading={modalLoading}>
              Save Log
            </Button>
          </div>
        }
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-sm">
          {!selectedRecord && (
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-semibold text-slate-700">Select Employee</label>
              <select
                name="userId"
                value={formFields.userId}
                onChange={handleFormChange}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              >
                <option value="">Select...</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
          )}

          <Input
            label="Log Date"
            name="date"
            type="date"
            value={formFields.date}
            onChange={handleFormChange}
            disabled={!!selectedRecord}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Clock In Time"
              name="checkIn"
              type="datetime-local"
              value={formFields.checkIn}
              onChange={handleFormChange}
            />
            <Input
              label="Clock Out Time"
              name="checkOut"
              type="datetime-local"
              value={formFields.checkOut}
              onChange={handleFormChange}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-semibold text-slate-700">Attendance Status</label>
            <select
              name="status"
              value={formFields.status}
              onChange={handleFormChange}
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="half-day">Half-day</option>
              <option value="leave">Leave</option>
            </select>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default AttendanceLogsPage;
