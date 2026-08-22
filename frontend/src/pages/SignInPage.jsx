import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const SignInPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-[#EBEBEB] px-4 py-12 font-sans">
      <div className="w-full max-w-[420px] z-10">
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-black p-3 rounded-xl text-white shadow-[4px_4px_10px_rgba(0,0,0,0.15)] mb-4">
            <span className="font-extrabold text-[18px] tracking-wider">DF</span>
          </div>
          <h2 className="text-[28px] font-bold text-black tracking-tight">Welcome to Dayflow</h2>
          <p className="text-[11px] text-[#555555] font-semibold tracking-wide uppercase mt-1">Every workday, perfectly aligned</p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#F0F0F0] p-8 rounded-xl border border-[rgba(255,255,255,0.8)] shadow-[8px_8px_18px_rgba(0,0,0,0.1),-6px_-6px_14px_rgba(255,255,255,0.9)]">
          <h3 className="text-[18px] font-bold text-black mb-6 text-center">Sign In</h3>

          {generalError && (
            <div className="mb-6 p-4 rounded-xl bg-[#F0F0F0] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.08),inset_-2px_-2px_5px_rgba(255,255,255,0.75)] border border-[rgba(255,255,255,0.8)] text-[12px] font-bold text-black leading-relaxed text-center">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col space-y-1.5 w-full">
              <label htmlFor="email" className="text-[12px] font-bold text-[#555555]">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full h-[40px] px-3.5 bg-[#F0F0F0] rounded-md border border-[rgba(255,255,255,0.8)] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.08),inset_-2px_-2px_5px_rgba(255,255,255,0.75)] text-[13px] text-black focus:outline-none focus:border-black/40 focus:ring-1 focus:ring-black/20 transition-all placeholder:text-[#888888]"
              />
              {errors.email && <span className="text-[11px] text-black font-extrabold">{errors.email}</span>}
            </div>
            
            <div className="flex flex-col space-y-1.5 w-full">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-[12px] font-bold text-[#555555]">Password</label>
                <Link to="/forgot-password" className="text-[11px] font-bold text-black hover:underline transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative w-full">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full h-[40px] pl-3.5 pr-10 bg-[#F0F0F0] rounded-md border border-[rgba(255,255,255,0.8)] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.08),inset_-2px_-2px_5px_rgba(255,255,255,0.75)] text-[13px] text-black focus:outline-none focus:border-black/40 focus:ring-1 focus:ring-black/20 transition-all placeholder:text-[#888888]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#888888] hover:text-black transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <span className="text-[11px] text-black font-extrabold">{errors.password}</span>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[42px] mt-2 bg-[#F0F0F0] text-black font-bold text-[13px] rounded-lg border border-[rgba(255,255,255,0.8)] shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)] hover:shadow-[2px_2px_5px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.9)] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.08),inset_-2px_-2px_5px_rgba(255,255,255,0.75)] active:border-transparent transition-all flex items-center justify-center disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Nav option */}
          <div className="mt-8 text-center text-[12px] font-semibold text-[#555555]">
            Don't have an account?{' '}
            <Link to="/signup" className="text-black font-bold underline hover:text-[#555555] transition-colors ml-1">
              Request access / Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
