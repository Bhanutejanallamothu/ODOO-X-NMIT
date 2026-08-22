import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const SignUpPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employeeId: '',
    email: '',
    password: '',
    role: 'employee',
    name: '',
    phone: '',
    address: '',
    jobTitle: '',
    department: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setGeneralError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.employeeId) newErrors.employeeId = 'Employee ID is required';
    if (!formData.name) newErrors.name = 'Full name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setGeneralError('');
    setSuccessMessage('');

    const res = await register(formData);
    setLoading(false);

    if (res.success) {
      setSuccessMessage(res.message || 'Registration successful! A mock verification email link has been outputted to the server console.');
      setFormData({
        employeeId: '',
        email: '',
        password: '',
        role: 'employee',
        name: '',
        phone: '',
        address: '',
        jobTitle: '',
        department: '',
      });
    } else {
      setGeneralError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-100/40 filter blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-100/40 filter blur-3xl" />

      <div className="w-full max-w-lg z-10">
        {/* Logo header */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-brand-600 p-3.5 rounded-2xl text-white shadow-xl shadow-brand-500/20 mb-4">
            <span className="font-extrabold text-xl tracking-wider">DF</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Create your Account</h2>
          <p className="text-sm text-slate-400 font-semibold tracking-wide uppercase mt-1">Every workday, perfectly aligned</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/40">
          
          {successMessage ? (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Check Your Email</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                {successMessage}
              </p>
              <div className="flex justify-center space-x-4">
                <Link to="/signin">
                  <Button variant="primary">Proceed to Login</Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-bold text-slate-800 mb-6">Employee Registration</h3>
              
              {generalError && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-xs font-semibold text-rose-600">
                  {generalError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Employee ID"
                    name="employeeId"
                    placeholder="e.g. DF-EMP-05"
                    value={formData.employeeId}
                    onChange={handleChange}
                    error={errors.employeeId}
                    required
                  />
                  <Input
                    label="Full Name"
                    name="name"
                    placeholder="e.g. Robert Downey"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                  />
                  <Input
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    required
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Account Role</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex items-center justify-center p-3 rounded-lg border text-sm font-bold cursor-pointer transition-all ${
                      formData.role === 'employee' 
                        ? 'border-brand-500 bg-brand-50/50 text-brand-700' 
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}>
                      <input 
                        type="radio" 
                        name="role" 
                        value="employee" 
                        checked={formData.role === 'employee'} 
                        onChange={handleChange} 
                        className="sr-only" 
                      />
                      Employee
                    </label>
                    <label className={`flex items-center justify-center p-3 rounded-lg border text-sm font-bold cursor-pointer transition-all ${
                      formData.role === 'admin' 
                        ? 'border-brand-500 bg-brand-50/50 text-brand-700' 
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}>
                      <input 
                        type="radio" 
                        name="role" 
                        value="admin" 
                        checked={formData.role === 'admin'} 
                        onChange={handleChange} 
                        className="sr-only" 
                      />
                      HR / Admin
                    </label>
                  </div>
                </div>

                <hr className="border-slate-100 my-4" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Professional Details (Optional)</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Job Title"
                    name="jobTitle"
                    placeholder="e.g. Sales Lead"
                    value={formData.jobTitle}
                    onChange={handleChange}
                  />
                  <Input
                    label="Department"
                    name="department"
                    placeholder="e.g. Operations"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Phone"
                    name="phone"
                    placeholder="e.g. +1 555-0199"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <Input
                    label="Home Address"
                    name="address"
                    placeholder="City, Country"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className="w-full py-3 mt-4"
                >
                  Register Account
                </Button>
              </form>

              {/* Login redirection option */}
              <div className="mt-6 text-center text-xs font-semibold text-slate-400">
                Already have an account?{' '}
                <Link to="/signin" className="text-brand-600 hover:text-brand-700 transition-colors">
                  Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
