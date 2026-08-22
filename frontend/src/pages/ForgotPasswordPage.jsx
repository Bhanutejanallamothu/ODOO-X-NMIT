import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data?.message || 'If that email exists, a password reset link has been sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
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

        {/* Forgot Password Card */}
        <div className="bg-[#F0F0F0] p-8 rounded-xl border border-[rgba(255,255,255,0.8)] shadow-[8px_8px_18px_rgba(0,0,0,0.1),-6px_-6px_14px_rgba(255,255,255,0.9)]">
          <h3 className="text-[18px] font-bold text-black mb-4 text-center">Forgot Password</h3>
          <p className="text-[12px] text-[#555555] font-semibold mb-6 text-center leading-relaxed">
            Enter your registered email address and we'll send you a link to reset your password.
          </p>

          {message && (
            <div className="mb-6 p-4 rounded-xl bg-[#F0F0F0] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.08),inset_-2px_-2px_5px_rgba(255,255,255,0.75)] border border-[rgba(255,255,255,0.8)] text-[12px] font-bold text-black leading-relaxed text-center">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[#F0F0F0] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.08),inset_-2px_-2px_5px_rgba(255,255,255,0.75)] border border-[rgba(255,255,255,0.8)] text-[12px] font-bold text-black leading-relaxed text-center">
              {error}
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
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                required
                className="w-full h-[40px] px-3.5 bg-[#F0F0F0] rounded-md border border-[rgba(255,255,255,0.8)] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.08),inset_-2px_-2px_5px_rgba(255,255,255,0.75)] text-[13px] text-black focus:outline-none focus:border-black/40 focus:ring-1 focus:ring-black/20 transition-all placeholder:text-[#888888]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[42px] mt-2 bg-[#F0F0F0] text-black font-bold text-[13px] rounded-lg border border-[rgba(255,255,255,0.8)] shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)] hover:shadow-[2px_2px_5px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.9)] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.08),inset_-2px_-2px_5px_rgba(255,255,255,0.75)] active:border-transparent transition-all flex items-center justify-center disabled:opacity-50"
            >
              {loading ? 'Sending Link...' : 'Send Reset Link'}
            </button>
          </form>

          {/* Back to signin */}
          <div className="mt-8 text-center text-[12px] font-semibold text-[#555555]">
            Remember your password?{' '}
            <Link to="/signin" className="text-black font-bold underline hover:text-[#555555] transition-colors ml-1">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
