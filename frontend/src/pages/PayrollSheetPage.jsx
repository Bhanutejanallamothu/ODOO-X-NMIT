import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import { CreditCard, FileSpreadsheet, Plus, AlertCircle, Edit, FileText, Printer, Copy, Check } from 'lucide-react';

const PayrollSheetPage = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Upsert Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [formFields, setFormFields] = useState({
    userId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    baseSalary: 0,
    allowances: 0,
    deductions: 0
  });

  // Slip Text Modal state
  const [slipModalOpen, setSlipModalOpen] = useState(false);
  const [slipText, setSlipText] = useState('');
  const [slipLoading, setSlipLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch Employees list
      const empRes = await api.get('/profiles/employees');
      if (empRes.data.success) {
        setEmployees(empRes.data.employees);
      }

      // Fetch Payroll sheets
      const payRes = await api.get('/payroll/all');
      if (payRes.data.success) {
        setPayrolls(payRes.data.payrolls);
      }
    } catch (err) {
      console.error('Error fetching payroll data:', err);
      setError('Could not load payroll records database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openUpsertModal = (payroll = null) => {
    if (payroll) {
      setSelectedPayroll(payroll);
      setFormFields({
        userId: payroll.user_id,
        month: payroll.month,
        year: payroll.year,
        baseSalary: parseFloat(payroll.base_salary),
        allowances: parseFloat(payroll.allowances),
        deductions: parseFloat(payroll.deductions)
      });
    } else {
      setSelectedPayroll(null);
      setFormFields({
        userId: employees[0]?.id || '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        baseSalary: 3000,
        allowances: 200,
        deductions: 100
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
      const res = await api.post('/payroll/upsert', formFields);
      if (res.data.success) {
        setModalOpen(false);
        fetchData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update payroll.');
    } finally {
      setModalLoading(false);
    }
  };

  const openSlipModal = async (payroll) => {
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
      setSlipText('Failed to generate salary slip.');
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
      header: 'Period',
      accessor: 'month',
      render: (row) => <span className="font-semibold text-slate-600">{getMonthName(row.month)} {row.year}</span>
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
      header: 'Net Payable',
      accessor: 'net_salary',
      render: (row) => <span className="font-extrabold text-slate-800">$${parseFloat(row.net_salary).toFixed(2)}</span>
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => openSlipModal(row)} title="View Slip">
            <FileText className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => openUpsertModal(row)} title="Edit Payroll">
            <Edit className="h-3.5 w-3.5" />
          </Button>
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

      <Card 
        title="Company Payroll Database" 
        subtitle="Manage employee pay sheets"
        actions={
          <Button variant="primary" size="sm" onClick={() => openUpsertModal(null)} icon={Plus}>
            Generate Payroll
          </Button>
        }
      >
        <Table
          columns={columns}
          data={payrolls}
          loading={loading}
          emptyMessage="No payroll sheets initialized yet."
        />
      </Card>

      {/* Upsert Payroll Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedPayroll ? 'Edit Employee Payroll Record' : 'Generate Employee Payroll Record'}
        footer={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleFormSubmit} loading={modalLoading}>
              Save Record
            </Button>
          </div>
        }
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-sm">
          {!selectedPayroll && (
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

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-semibold text-slate-700">Month</label>
              <select
                name="month"
                value={formFields.month}
                onChange={handleFormChange}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              >
                {[...Array(12).keys()].map(m => (
                  <option key={m + 1} value={m + 1}>{getMonthName(m + 1)}</option>
                ))}
              </select>
            </div>
            <Input
              label="Year"
              name="year"
              type="number"
              value={formFields.year}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Base Salary ($)"
              name="baseSalary"
              type="number"
              step="0.01"
              value={formFields.baseSalary}
              onChange={handleFormChange}
              required
            />
            <Input
              label="Allowances ($)"
              name="allowances"
              type="number"
              step="0.01"
              value={formFields.allowances}
              onChange={handleFormChange}
              required
            />
            <Input
              label="Deductions ($)"
              name="deductions"
              type="number"
              step="0.01"
              value={formFields.deductions}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
            <span className="font-semibold text-slate-500">Calculated Net Salary:</span>
            <span className="font-extrabold text-lg text-slate-800">
              ${(parseFloat(formFields.baseSalary || 0) + parseFloat(formFields.allowances || 0) - parseFloat(formFields.deductions || 0)).toFixed(2)}
            </span>
          </div>

        </form>
      </Modal>

      {/* Slip Text Modal */}
      <Modal
        isOpen={slipModalOpen}
        onClose={() => setSlipModalOpen(false)}
        title="Employee Salary Slip"
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

export default PayrollSheetPage;
