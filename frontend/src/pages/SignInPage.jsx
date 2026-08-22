import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignInPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setGeneralError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setGeneralError('');

    const res = await login(formData.email, formData.password);
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setGeneralError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E9ECF4] px-4 py-12 font-sans">
      <div className="w-full max-w-[420px] z-10">
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-[#7C3AED] p-3 rounded-xl text-white shadow-[4px_4px_10px_rgba(163,169,183,0.3)] mb-4">
            <span className="font-extrabold text-[18px] tracking-wider">DF</span>
          </div>
          <h2 className="text-[28px] font-bold text-[#252A34] tracking-tight">Welcome to Dayflow</h2>
          <p className="text-[11px] text-[#687080] font-semibold tracking-wide uppercase mt-1">Every workday, perfectly aligned</p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#EEF1F7] p-8 rounded-xl border border-[rgba(255,255,255,0.8)] shadow-[8px_8px_18px_rgba(163,169,183,0.28),-6px_-6px_14px_rgba(255,255,255,0.9)]">
          <h3 className="text-[18px] font-bold text-[#252A34] mb-6 text-center">Sign In</h3>

          {generalError && (
            <div className="mb-6 p-4 rounded-xl bg-[#EEF1F7] shadow-[inset_2px_2px_5px_rgba(163,169,183,0.18),inset_-2px_-2px_5px_rgba(255,255,255,0.75)] border border-[rgba(255,255,255,0.8)] text-[12px] font-semibold text-rose-600 leading-relaxed text-center">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col space-y-1.5 w-full">
              <label htmlFor="email" className="text-[12px] font-semibold text-[#687080]">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full h-[40px] px-3.5 bg-[#EEF1F7] rounded-md border border-[rgba(255,255,255,0.8)] shadow-[inset_2px_2px_5px_rgba(163,169,183,0.18),inset_-2px_-2px_5px_rgba(255,255,255,0.75)] text-[13px] text-[#252A34] focus:outline-none focus:border-[#7C3AED]/40 focus:ring-1 focus:ring-[#7C3AED]/30 transition-all placeholder:text-[#687080]/50"
              />
              {errors.email && <span className="text-[11px] text-rose-500 font-medium">{errors.email}</span>}
            </div>
            
            <div className="flex flex-col space-y-1.5 w-full">
              <label htmlFor="password" className="text-[12px] font-semibold text-[#687080]">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full h-[40px] px-3.5 bg-[#EEF1F7] rounded-md border border-[rgba(255,255,255,0.8)] shadow-[inset_2px_2px_5px_rgba(163,169,183,0.18),inset_-2px_-2px_5px_rgba(255,255,255,0.75)] text-[13px] text-[#252A34] focus:outline-none focus:border-[#7C3AED]/40 focus:ring-1 focus:ring-[#7C3AED]/30 transition-all placeholder:text-[#687080]/50"
              />
              {errors.password && <span className="text-[11px] text-rose-500 font-medium">{errors.password}</span>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[42px] mt-2 bg-[#EEF1F7] text-[#252A34] font-bold text-[13px] rounded-lg border border-[rgba(255,255,255,0.8)] shadow-[4px_4px_10px_rgba(163,169,183,0.28),-4px_-4px_10px_rgba(255,255,255,0.9)] hover:text-[#7C3AED] hover:shadow-[2px_2px_5px_rgba(163,169,183,0.28),-2px_-2px_5px_rgba(255,255,255,0.9)] active:shadow-[inset_2px_2px_5px_rgba(163,169,183,0.18),inset_-2px_-2px_5px_rgba(255,255,255,0.75)] active:border-transparent transition-all flex items-center justify-center disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Nav option */}
          <div className="mt-8 text-center text-[12px] font-semibold text-[#687080]">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#7C3AED] hover:text-[#6D28D9] transition-colors ml-1">
              Request access / Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
