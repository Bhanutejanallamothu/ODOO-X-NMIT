import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import { CalendarDays, AlertCircle } from 'lucide-react';

const AttendancePage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/attendance/me');
      if (res.data.success) {
        setLogs(res.data.records);
      }
    } catch (err) {
      console.error('Error fetching attendance logs:', err);
      setError('Could not retrieve attendance records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatTime = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const columns = [
    {
      header: 'Date',
      accessor: 'date',
      render: (row) => new Date(row.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    },
    {
      header: 'Check-In',
      accessor: 'check_in',
      render: (row) => (
        <span className="font-semibold text-slate-700">{formatTime(row.check_in)}</span>
      )
    },
    {
      header: 'Check-Out',
      accessor: 'check_out',
      render: (row) => (
        <span className="font-semibold text-slate-700">{formatTime(row.check_out)}</span>
      )
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

      <Card 
        title="My Attendance Ledger" 
        subtitle="Historical clock records"
        actions={
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            <span>Attendance Logged: {logs.length} days</span>
          </div>
        }
      >
        <Table
          columns={columns}
          data={logs}
          loading={loading}
          emptyMessage="You have not clocked in yet. Check in from the dashboard."
        />
      </Card>

    </div>
  );
};

export default AttendancePage;
