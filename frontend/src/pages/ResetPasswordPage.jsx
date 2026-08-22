import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../services/api';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Invalid reset link token.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await api.post('/auth/reset-password', { token, password });
      setMessage(response.data?.message || 'Your password has been successfully reset.');
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Token may have expired.');
    } finally {
      setLoading(false);
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

        {/* Reset Password Card */}
        <div className="bg-[#F0F0F0] p-8 rounded-xl border border-[rgba(255,255,255,0.8)] shadow-[8px_8px_18px_rgba(0,0,0,0.1),-6px_-6px_14px_rgba(255,255,255,0.9)]">
          <h3 className="text-[18px] font-bold text-black mb-4 text-center">Reset Password</h3>
          <p className="text-[12px] text-[#555555] font-semibold mb-6 text-center leading-relaxed">
            Enter your new password below to reset your credentials.
          </p>

          {!token && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-[12px] font-bold text-red-600 leading-relaxed text-center">
              Error: Missing password reset token. Please check your email link.
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 rounded-xl bg-[#F0F0F0] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.08),inset_-2px_-2px_5px_rgba(255,255,255,0.75)] border border-[rgba(255,255,255,0.8)] text-[12px] font-bold text-black leading-relaxed text-center">
              {message} <br />
              <span className="text-[11px] font-normal text-gray-500">Redirecting you to sign in...</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[#F0F0F0] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.08),inset_-2px_-2px_5px_rgba(255,255,255,0.75)] border border-[rgba(255,255,255,0.8)] text-[12px] font-bold text-black leading-relaxed text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col space-y-1.5 w-full">
              <label htmlFor="password" className="text-[12px] font-bold text-[#555555]">New Password</label>
              <div className="relative w-full">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  required
                  disabled={!token}
                  className="w-full h-[40px] pl-3.5 pr-10 bg-[#F0F0F0] rounded-md border border-[rgba(255,255,255,0.8)] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.08),inset_-2px_-2px_5px_rgba(255,255,255,0.75)] text-[13px] text-black focus:outline-none focus:border-black/40 focus:ring-1 focus:ring-black/20 transition-all placeholder:text-[#888888] disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#888888] hover:text-black transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col space-y-1.5 w-full">
              <label htmlFor="confirmPassword" className="text-[12px] font-bold text-[#555555]">Confirm New Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                required
                disabled={!token}
                className="w-full h-[40px] px-3.5 bg-[#F0F0F0] rounded-md border border-[rgba(255,255,255,0.8)] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.08),inset_-2px_-2px_5px_rgba(255,255,255,0.75)] text-[13px] text-black focus:outline-none focus:border-black/40 focus:ring-1 focus:ring-black/20 transition-all placeholder:text-[#888888] disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full h-[42px] mt-2 bg-[#F0F0F0] text-black font-bold text-[13px] rounded-lg border border-[rgba(255,255,255,0.8)] shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)] hover:shadow-[2px_2px_5px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.9)] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.08),inset_-2px_-2px_5px_rgba(255,255,255,0.75)] active:border-transparent transition-all flex items-center justify-center disabled:opacity-50"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>

          {/* Back to signin */}
          <div className="mt-8 text-center text-[12px] font-semibold text-[#555555]">
            Cancel reset?{' '}
            <Link to="/signin" className="text-black font-bold underline hover:text-[#555555] transition-colors ml-1">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
