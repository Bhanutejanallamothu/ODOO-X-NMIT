import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import { Users, Edit, AlertCircle } from 'lucide-react';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Editing Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formFields, setFormFields] = useState({
    name: '',
    phone: '',
    address: '',
    jobTitle: '',
    department: ''
  });

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/profiles/employees');
      if (res.data.success) {
        setEmployees(res.data.employees);
      }
    } catch (err) {
      console.error('Error fetching employees list:', err);
      setError('Could not retrieve company employee directories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const openEditModal = async (emp) => {
    setSelectedUser(emp);
    setEditModalOpen(true);
    setModalLoading(true);

    try {
      // Fetch full profile info for editing
      const res = await api.get(`/profiles/${emp.id}`);
      if (res.data.success) {
        const prof = res.data.profile;
        setFormFields({
          name: prof.name || '',
          phone: prof.phone || '',
          address: prof.address || '',
          jobTitle: prof.job_title || '',
          department: prof.department || ''
        });
      }
    } catch (err) {
      console.error('Error fetching full profile:', err);
      setError('Failed to fetch full employee profile for editing.');
    } finally {
      setModalLoading(false);
    }
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
      const res = await api.put(`/profiles/${selectedUser.id}`, formFields);
      if (res.data.success) {
        setEditModalOpen(false);
        fetchEmployees();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update employee details.');
    } finally {
      setModalLoading(false);
    }
  };

  const columns = [
    {
      header: 'Employee Code',
      accessor: 'employee_id',
      render: (row) => <span className="font-bold text-slate-500">#{row.employee_id}</span>
    },
    {
      header: 'Full Name',
      accessor: 'name',
      render: (row) => <span className="font-bold text-slate-700">{row.name}</span>
    },
    {
      header: 'Email Address',
      accessor: 'email'
    },
    {
      header: 'Job Title',
      accessor: 'job_title',
      render: (row) => row.job_title || <span className="text-slate-300 italic">Unassigned</span>
    },
    {
      header: 'Department',
      accessor: 'department',
      render: (row) => row.department || <span className="text-slate-300 italic">Unassigned</span>
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <Button variant="outline" size="sm" onClick={() => openEditModal(row)} icon={Edit}>
          Edit Profile
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
        title="Employee Directory" 
        subtitle="Manage active company workforce profiles"
        actions={
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
            <Users className="h-4 w-4 text-slate-400" />
            <span>Headcount: {employees.length}</span>
          </div>
        }
      >
        <Table
          columns={columns}
          data={employees}
          loading={loading}
          emptyMessage="No employees found."
        />
      </Card>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Employee Profile"
        footer={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleFormSubmit} loading={modalLoading}>
              Save Profile
            </Button>
          </div>
        }
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-sm">
          
          <Input
            label="Full Name"
            name="name"
            value={formFields.name}
            onChange={handleFormChange}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Job Title"
              name="jobTitle"
              value={formFields.jobTitle}
              onChange={handleFormChange}
            />
            <Input
              label="Department"
              name="department"
              value={formFields.department}
              onChange={handleFormChange}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Contact Number"
              name="phone"
              value={formFields.phone}
              onChange={handleFormChange}
            />
            <Input
              label="Home Address"
              name="address"
              value={formFields.address}
              onChange={handleFormChange}
            />
          </div>

        </form>
      </Modal>

    </div>
  );
};

export default EmployeesPage;
