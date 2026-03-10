import React, { useState } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Register = ({ onRegister }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState({ score: 0, text: '', color: '' });

  const evaluatePassword = (password) => {
    let score = 0;
    if (password.length > 5) score += 1;
    if (password.length > 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (password.length === 0) return { score: 0, text: '', color: '' };
    if (score <= 2) return { score: 33, text: 'Weak', color: '#ef4444' };
    if (score <= 4) return { score: 66, text: 'Medium', color: '#eab308' };
    return { score: 100, text: 'Strong', color: '#10b981' };
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === 'password') {
      setStrength(evaluatePassword(value));
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/google`, {
        credential: credentialResponse.credential
      });
      localStorage.setItem('token', res.data.token);
      onRegister();
    } catch (err) {
      setError('Google registration failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (strength.score < 66) {
      setError('Please use a stronger password (at least medium strength).');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, form);
      localStorage.setItem('token', res.data.token);
      onRegister();
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="card animate-fade-in" style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
      <form onSubmit={handleSubmit}>
        <h2 style={{ justifyContent: 'center', marginBottom: '30px' }}>Create Account</h2>
        <div className="form-group">
          <label>Name</label>
          <input name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input name="password" type="password" placeholder="Min 6 chars, uppercase, and number" value={form.password} onChange={handleChange} required minLength={6} />
          {form.password && (
            <>
              <div className="password-strength-container">
                <div className="password-strength-bar" style={{ width: `${strength.score}%`, backgroundColor: strength.color }}></div>
              </div>
              <span className="password-feedback" style={{ color: strength.color }}>Security: {strength.text}</span>
            </>
          )}
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading || (form.password && strength.score < 66)} style={{ marginTop: '10px' }}>
          {loading ? 'Registering...' : 'Create Account'}
        </button>
        {error && <div style={{ color: 'var(--danger)', marginTop: '15px', textAlign: 'center' }}>{error}</div>}

        <div style={{ textAlign: 'center', margin: '20px 0', color: '#6b7280' }}>OR</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Auth Failed')}
            useOneTap
          />
        </div>
      </form>
    </div>
  );
};

export default Register;
