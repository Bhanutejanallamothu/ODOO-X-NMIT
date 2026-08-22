import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import { Shield, RefreshCw } from 'lucide-react';
import Button from '../components/common/Button';

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/profile/audit-logs');
      if (res.data.success) {
        setLogs(res.data.logs);
      }
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setError('Could not load audit logs. Ensure you have administrator privileges.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatDetails = (detailsStr) => {
    if (!detailsStr) return '-';
    try {
      const obj = JSON.parse(detailsStr);
      return (
        <div className="text-[11px] font-medium text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 max-w-[320px] overflow-hidden whitespace-normal">
          {Object.entries(obj).map(([key, value]) => {
            const displayValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
            return (
              <div key={key} className="flex justify-between space-x-2 py-0.5">
                <span className="font-bold text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                <span className="text-slate-700 break-all">{displayValue}</span>
              </div>
            );
          })}
        </div>
      );
    } catch (e) {
      return <span className="text-xs font-mono text-slate-500">{detailsStr}</span>;
    }
  };

  const columns = [
    {
      header: 'Timestamp',
      accessor: 'created_at',
      render: (row) => (
        <span className="text-xs font-semibold text-slate-500">
          {new Date(row.created_at).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </span>
      )
    },
    {
      header: 'Admin Actor',
      accessor: 'admin_name',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-700 text-sm">{row.admin_name}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{row.admin_employee_id}</span>
        </div>
      )
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (row) => {
        let type = 'info';
        if (row.action.includes('REJECT') || row.action.includes('DELETE')) type = 'danger';
        if (row.action.includes('APPROVE') || row.action.includes('CREATE')) type = 'success';
        if (row.action.includes('UPDATE')) type = 'warning';
        return <Badge type={type}>{row.action.replace('_', ' ')}</Badge>;
      }
    },
    {
      header: 'Details & Changes',
      accessor: 'details',
      render: (row) => formatDetails(row.details)
    },
    {
      header: 'IP Address',
      accessor: 'ip_address',
      render: (row) => (
        <span className="text-xs font-mono text-slate-400 font-semibold">
          {row.ip_address || 'Internal'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-xs font-semibold text-rose-600 rounded-xl flex items-center space-x-2">
          <span>{error}</span>
        </div>
      )}

      <Card 
        title="Admin Audit Trail Ledger" 
        subtitle="System compliance and transaction logging logs"
        icon={Shield}
        actions={
          <Button variant="outline" size="sm" onClick={fetchLogs} icon={RefreshCw}>
            Refresh Ledger
          </Button>
        }
      >
        <Table
          columns={columns}
          data={logs}
          loading={loading}
          emptyMessage="No administrative actions logged yet."
        />
      </Card>
      
    </div>
  );
};

export default AuditLogsPage;
