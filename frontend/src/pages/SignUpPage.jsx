import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

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
      setSuccessMessage(res.message || 'Registration successful!');
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

  const idIcon = (
    <svg viewBox="0 0 24 24"><path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" /></svg>
  );
  
  const mailIcon = (
    <svg viewBox="0 0 24 24"><path d="M4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M4,6V8L12,13L20,8V6L12,11L4,6Z" /></svg>
  );

  const lockIcon = (
    <svg viewBox="0 0 24 24"><path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" /></svg>
  );

  return (
    <div className="auth-container">
      {successMessage ? (
        <div className="auth-form" style={{ transform: 'none', background: 'white', padding: '2rem' }}>
          <h2 className="auth-h2" style={{ color: 'green' }}>Registration Complete</h2>
          <p style={{ margin: '1rem 0' }}>{successMessage}</p>
          <div className="btn-group">
            <Link to="/signin">
              <button className="auth-btn btn--primary">Proceed to Login</button>
            </Link>
          </div>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="form-inner">
            <h2 className="auth-h2">Register</h2>

            {generalError && <div className="auth-general-error">{generalError}</div>}

            <div className="input-wrapper">
              <label className="auth-label" htmlFor="employeeId">Employee ID</label>
              <div className="input-group">
                <span className="icon">{idIcon}</span>
                <input
                  type="text"
                  id="employeeId"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  data-lpignore="true"
                  required
                />
              </div>
              {errors.employeeId && <span className="auth-error">{errors.employeeId}</span>}
            </div>

            <div className="input-wrapper">
              <label className="auth-label" htmlFor="name">Full Name</label>
              <div className="input-group">
                <span className="icon">{idIcon}</span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  data-lpignore="true"
                  required
                />
              </div>
              {errors.name && <span className="auth-error">{errors.name}</span>}
            </div>

            <div className="input-wrapper">
              <label className="auth-label" htmlFor="email">Email</label>
              <div className="input-group">
                <span className="icon">{mailIcon}</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  data-lpignore="true"
                  required
                />
              </div>
              {errors.email && <span className="auth-error">{errors.email}</span>}
            </div>

            <div className="input-wrapper">
              <label className="auth-label" htmlFor="password">Password</label>
              <div className="input-group">
                <span className="icon">{lockIcon}</span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  data-lpignore="true"
                  required
                />
              </div>
              {errors.password && <span className="auth-error">{errors.password}</span>}
            </div>
            
            <div className="input-wrapper" style={{ marginTop: '1rem' }}>
              <label className="auth-label">Role</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  <input type="radio" name="role" value="employee" checked={formData.role === 'employee'} onChange={handleChange} />
                  Employee
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  <input type="radio" name="role" value="admin" checked={formData.role === 'admin'} onChange={handleChange} />
                  Admin / HR
                </label>
              </div>
            </div>

            <div className="btn-group">
              <button type="submit" disabled={loading} className="auth-btn btn--primary" style={{ width: '100%', justifyContent: 'center' }}>
                {loading ? 'Registering...' : 'Sign Up'}
              </button>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <Link className="auth-link" style={{ fontSize: '0.8rem', fontWeight: 'bold' }} to="/signin">Already have an account? Sign In</Link>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default SignUpPage;
