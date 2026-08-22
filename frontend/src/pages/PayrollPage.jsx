import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { CreditCard, FileText, AlertCircle, Printer, Copy, Check } from 'lucide-react';

const PayrollPage = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Slip Modal states
  const [slipModalOpen, setSlipModalOpen] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [slipText, setSlipText] = useState('');
  const [slipLoading, setSlipLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/payroll/me');
      if (res.data.success) {
        setPayrolls(res.data.payrolls);
      }
    } catch (err) {
      console.error('Error fetching payroll:', err);
      setError('Could not load salary history details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const openSlipModal = async (payroll) => {
    setSelectedSlip(payroll);
    setSlipText('');
    setSlipModalOpen(true);
    setSlipLoading(true);
    setCopied(false);

    try {
      const res = await api.get(`/payroll/${payroll.id}/slip`);
      if (res.data.success) {
        setSlipText(res.data.textSlip);
      }
    } catch (err) {
      console.error('Error fetching slip text:', err);
      setSlipText('Failed to generate salary slip. Please check with HR.');
    } finally {
      setSlipLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(slipText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Salary Slip</title>
          <style>
            body { font-family: monospace; padding: 20px; white-space: pre-wrap; font-size: 14px; line-height: 1.5; color: #1e293b; }
          </style>
        </head>
        <body>${slipText}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const getMonthName = (monthNumber) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1] || 'Unknown';
  };

  const columns = [
    {
      header: 'Pay Period',
      accessor: 'month',
      render: (row) => <span className="font-bold text-slate-700">{getMonthName(row.month)} {row.year}</span>
    },
    {
      header: 'Base Salary',
      accessor: 'base_salary',
      render: (row) => `$${parseFloat(row.base_salary).toFixed(2)}`
    },
    {
      header: 'Allowances',
      accessor: 'allowances',
      render: (row) => `$${parseFloat(row.allowances).toFixed(2)}`
    },
    {
      header: 'Deductions',
      accessor: 'deductions',
      render: (row) => `$${parseFloat(row.deductions).toFixed(2)}`
    },
    {
      header: 'Net Salary',
      accessor: 'net_salary',
      render: (row) => <span className="font-extrabold text-slate-800">$${parseFloat(row.net_salary).toFixed(2)}</span>
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <Button variant="outline" size="sm" onClick={() => openSlipModal(row)} icon={FileText}>
          View Slip
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

      <Card 
        title="My Payroll & Earnings" 
        subtitle="Historical monthly salary payouts"
        actions={
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
            <CreditCard className="h-4 w-4 text-slate-400" />
            <span>Records: {payrolls.length} months</span>
          </div>
        }
      >
        <Table
          columns={columns}
          data={payrolls}
          loading={loading}
          emptyMessage="No salary slips generated for your profile yet."
        />
      </Card>

      {/* Slip Text Modal */}
      <Modal
        isOpen={slipModalOpen}
        onClose={() => setSlipModalOpen(false)}
        title="Salary Slip Details"
        footer={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={copyToClipboard} icon={copied ? Check : Copy}>
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button variant="primary" onClick={handlePrint} icon={Printer}>
              Print Slip
            </Button>
          </div>
        }
      >
        {slipLoading ? (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : (
          <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs whitespace-pre-wrap leading-relaxed border border-slate-800 shadow-inner max-h-[60vh] overflow-y-auto">
            {slipText}
          </div>
        )}
      </Modal>

    </div>
  );
};

export default PayrollPage;
