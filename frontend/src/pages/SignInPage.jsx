import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Lock, Mail } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 relative overflow-hidden">
      {/* Background shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-100/40 filter blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-100/40 filter blur-3xl" />

      <div className="w-full max-w-md z-10">
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-brand-600 p-3.5 rounded-2xl text-white shadow-xl shadow-brand-500/20 mb-4">
            <span className="font-extrabold text-xl tracking-wider">DF</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Welcome to Dayflow</h2>
          <p className="text-sm text-slate-400 font-semibold tracking-wide uppercase mt-1">Every workday, perfectly aligned</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/40">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Sign In</h3>

          {generalError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-xs font-semibold text-rose-600 leading-relaxed">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
            
            <div className="relative">
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

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full py-3 mt-2"
            >
              Sign In
            </Button>
          </form>

          {/* Nav option */}
          <div className="mt-6 text-center text-xs font-semibold text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-600 hover:text-brand-700 transition-colors">
              Request access / Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
