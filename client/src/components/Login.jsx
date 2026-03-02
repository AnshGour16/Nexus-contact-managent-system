


import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setSubmitError('');
  };

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!form.email) newErrors.email = 'Email is required';
    else if (!validateEmail(form.email)) newErrors.email = 'Invalid email format';
    if (!form.password) newErrors.password = 'Password is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setSubmitError('');
      try {
        const res = await axios.post(`${API_URL}/api/auth/login`, form);
        localStorage.setItem('token', res.data.token);
        if (onLogin) onLogin();
      } catch (err) {
        setSubmitError(err.response?.data?.error || 'Login failed');
      }
      setLoading(false);
    }
  };

  return (
    <div className="card animate-fade-in" style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
      <form onSubmit={handleSubmit} noValidate>
        <h2 style={{ justifyContent: 'center', marginBottom: '30px' }}>Welcome Back</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="username"
          />
          {errors.email && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '5px' }}>{errors.email}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: 'auto', marginTop: '0', padding: '0 20px' }}
              onClick={handleShowPassword}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '5px' }}>{errors.password}</div>}
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        {submitError && <div style={{ color: 'var(--danger)', marginTop: '15px', textAlign: 'center' }}>{submitError}</div>}
      </form>
    </div>
  );
};

export default Login;
