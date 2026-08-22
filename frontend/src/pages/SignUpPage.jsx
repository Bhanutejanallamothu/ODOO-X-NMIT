import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

  const inputClasses = "w-full h-[40px] px-3.5 bg-[#F0F0F0] rounded-md border border-[rgba(255,255,255,0.8)] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.08),inset_-2px_-2px_5px_rgba(255,255,255,0.75)] text-[13px] text-black focus:outline-none focus:border-black/40 focus:ring-1 focus:ring-black/20 transition-all placeholder:text-[#888888]";
  const labelClasses = "text-[12px] font-bold text-[#555555]";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EBEBEB] px-4 py-12 font-sans">
      <div className="w-full max-w-[550px] z-10">
        {/* Logo header */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-black p-3 rounded-xl text-white shadow-[4px_4px_10px_rgba(0,0,0,0.15)] mb-4">
            <span className="font-extrabold text-[18px] tracking-wider">DF</span>
          </div>
          <h2 className="text-[28px] font-bold text-black tracking-tight">Create your Account</h2>
          <p className="text-[11px] text-[#555555] font-semibold tracking-wide uppercase mt-1">Every workday, perfectly aligned</p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#F0F0F0] p-8 rounded-xl border border-[rgba(255,255,255,0.8)] shadow-[8px_8px_18px_rgba(0,0,0,0.1),-6px_-6px_14px_rgba(255,255,255,0.9)]">
          
          {successMessage ? (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#F0F0F0] border border-[rgba(255,255,255,0.8)] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.08),inset_-2px_-2px_5px_rgba(255,255,255,0.75)] text-black mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-[18px] font-bold text-black mb-2">Check Your Email</h3>
              <p className="text-[12px] text-[#555555] font-bold leading-relaxed mb-6">
                {successMessage}
              </p>
              <div className="flex justify-center space-x-4">
                <Link to="/signin">
                  <button className="h-[42px] px-6 bg-[#F0F0F0] text-black font-bold text-[13px] rounded-lg border border-[rgba(255,255,255,0.8)] shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)] hover:shadow-[2px_2px_5px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.9)] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.08),inset_-2px_-2px_5px_rgba(255,255,255,0.75)] active:border-transparent transition-all flex items-center justify-center">
                    Proceed to Login
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-[18px] font-bold text-black mb-6 text-center">Employee Registration</h3>
              
              {generalError && (
                <div className="mb-6 p-4 rounded-xl bg-[#F0F0F0] border border-[rgba(255,255,255,0.8)] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.08),inset_-2px_-2px_5px_rgba(255,255,255,0.75)] text-[12px] font-bold text-black text-center">
                  {generalError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5 w-full">
                    <label htmlFor="employeeId" className={labelClasses}>Employee ID</label>
                    <input id="employeeId" name="employeeId" placeholder="e.g. DF-EMP-05" value={formData.employeeId} onChange={handleChange} required className={inputClasses} />
                    {errors.employeeId && <span className="text-[11px] text-black font-extrabold">{errors.employeeId}</span>}
                  </div>
                  <div className="flex flex-col space-y-1.5 w-full">
                    <label htmlFor="name" className={labelClasses}>Full Name</label>
                    <input id="name" name="name" placeholder="e.g. Robert Downey" value={formData.name} onChange={handleChange} required className={inputClasses} />
                    {errors.name && <span className="text-[11px] text-black font-extrabold">{errors.name}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5 w-full">
                    <label htmlFor="email" className={labelClasses}>Email Address</label>
                    <input id="email" name="email" type="email" placeholder="name@company.com" value={formData.email} onChange={handleChange} required className={inputClasses} />
                    {errors.email && <span className="text-[11px] text-black font-extrabold">{errors.email}</span>}
                  </div>
                  <div className="flex flex-col space-y-1.5 w-full">
                    <label htmlFor="password" className={labelClasses}>Password</label>
                    <input id="password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required className={inputClasses} />
                    {errors.password && <span className="text-[11px] text-black font-extrabold">{errors.password}</span>}
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5 mt-2">
                  <label className={labelClasses}>Account Role</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex items-center justify-center h-[40px] rounded-md border text-[13px] font-bold cursor-pointer transition-all ${
                      formData.role === 'employee' 
                        ? 'border-black/40 bg-[#F0F0F0] text-black shadow-[inset_2px_2px_5px_rgba(0,0,0,0.08),inset_-2px_-2px_5px_rgba(255,255,255,0.75)]' 
                        : 'border-[rgba(255,255,255,0.8)] bg-[#F0F0F0] text-[#555555] shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)] hover:text-black'
                    }`}>
                      <input type="radio" name="role" value="employee" checked={formData.role === 'employee'} onChange={handleChange} className="sr-only" />
                      Employee
                    </label>
                    <label className={`flex items-center justify-center h-[40px] rounded-md border text-[13px] font-bold cursor-pointer transition-all ${
                      formData.role === 'admin' 
                        ? 'border-black/40 bg-[#F0F0F0] text-black shadow-[inset_2px_2px_5px_rgba(0,0,0,0.08),inset_-2px_-2px_5px_rgba(255,255,255,0.75)]' 
                        : 'border-[rgba(255,255,255,0.8)] bg-[#F0F0F0] text-[#555555] shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)] hover:text-black'
                    }`}>
                      <input type="radio" name="role" value="admin" checked={formData.role === 'admin'} onChange={handleChange} className="sr-only" />
                      HR / Admin
                    </label>
                  </div>
                </div>

                <div className="py-2">
                  <div className="h-px bg-[#EBEBEB] shadow-[0px_1px_0px_rgba(255,255,255,1)] w-full my-2"></div>
                </div>
                <p className="text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-2">Professional Details (Optional)</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5 w-full">
                    <label htmlFor="jobTitle" className={labelClasses}>Job Title</label>
                    <input id="jobTitle" name="jobTitle" placeholder="e.g. Sales Lead" value={formData.jobTitle} onChange={handleChange} className={inputClasses} />
                  </div>
                  <div className="flex flex-col space-y-1.5 w-full">
                    <label htmlFor="department" className={labelClasses}>Department</label>
                    <input id="department" name="department" placeholder="e.g. Operations" value={formData.department} onChange={handleChange} className={inputClasses} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5 w-full">
                    <label htmlFor="phone" className={labelClasses}>Phone</label>
                    <input id="phone" name="phone" placeholder="e.g. +1 555-0199" value={formData.phone} onChange={handleChange} className={inputClasses} />
                  </div>
                  <div className="flex flex-col space-y-1.5 w-full">
                    <label htmlFor="address" className={labelClasses}>Home Address</label>
                    <input id="address" name="address" placeholder="City, Country" value={formData.address} onChange={handleChange} className={inputClasses} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[42px] mt-6 bg-[#F0F0F0] text-black font-bold text-[13px] rounded-lg border border-[rgba(255,255,255,0.8)] shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)] hover:shadow-[2px_2px_5px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.9)] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.08),inset_-2px_-2px_5px_rgba(255,255,255,0.75)] active:border-transparent transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Register Account'}
                </button>
              </form>

              {/* Login redirection option */}
              <div className="mt-8 text-center text-[12px] font-semibold text-[#555555]">
                Already have an account?{' '}
                <Link to="/signin" className="text-black font-bold underline hover:text-[#555555] transition-colors ml-1">
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
