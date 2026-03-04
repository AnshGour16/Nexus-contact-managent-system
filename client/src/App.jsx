import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [authMode, setAuthMode] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  // Always use the base API URL, not the contacts endpoint directly
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const API_URL = `${API_BASE}/api/contacts`;

  const fetchContacts = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error", err);
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    if (isAuthenticated) fetchContacts();
  }, [isAuthenticated, fetchContacts]);

  const validate = (name, value) => {
    let msg = '';
    if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) msg = "Invalid email format";
    // Phone validation: Must be 10 digits (we already restrict input to numbers only in handleChange)
    if (name === 'phone' && value && value.length < 10) msg = "Phone must be at least 10 digits";

    setErrors(prev => ({ ...prev, [name]: msg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // --- FEATURE: BLOCK NON-NUMBERS ---
    // If the field is 'phone', we check if the value contains anything that is NOT a number.
    // If it does, we simply return (ignore the keystroke).
    if (name === 'phone') {
      // Regex: /^\d*$/ matches only strings that contain 0-9 or are empty
      if (!/^\d*$/.test(value)) return;
    }

    setFormData({ ...formData, [name]: value });
    validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Double check before sending
    if (!formData.name || !formData.email || !formData.phone || errors.email || errors.phone) return;

    try {
      const token = localStorage.getItem('token');
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setContacts(contacts.map(c => c._id === editingId ? { ...formData, _id: editingId } : c));
        setEditingId(null);
      } else {
        const res = await axios.post(API_URL, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setContacts([res.data, ...contacts]);
      }
      setFormData({ name: '', email: '', phone: '', message: '' });
      setErrors({}); // Clear errors on success
    } catch {
      alert("Something went wrong. Please try again.");
    }
  };

  const handleEdit = (contact) => {
    setFormData(contact);
    setEditingId(contact._id);
    setErrors({}); // Clear errors when starting edit
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(contacts.filter(c => c._id !== id));
    } catch {
      alert("Error deleting contact");
    }
  };

  const getInitials = (name) => name ? name.charAt(0).toUpperCase() : '?';

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  // --- FEATURE: STRICT BUTTON LOGIC ---
  // The button is valid ONLY if:
  // 1. Name is not empty
  // 2. Email is not empty AND has no errors
  // 3. Phone is not empty AND has no errors
  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.phone.trim() !== "" &&
    !errors.email &&
    !errors.phone;

  if (!isAuthenticated) {
    return (
      <div className="auth-wrapper">
        <div className="auth-toggle">
          <button onClick={() => setAuthMode('login')} className={authMode === 'login' ? 'active' : ''}>Login</button>
          <button onClick={() => setAuthMode('register')} className={authMode === 'register' ? 'active' : ''}>Register</button>
        </div>
        {authMode === 'login' ? <Login onLogin={() => setIsAuthenticated(true)} /> : <Register onRegister={() => setIsAuthenticated(true)} />}
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <div className="header-section">
        <div className="brand-logo">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 3H7C4.79086 3 3 4.79086 3 7V17C3 19.2091 4.79086 21 7 21H17C19.2091 21 21 19.2091 21 17V7C21 4.79086 19.2091 3 17 3ZM12 14C9.33 14 6 15.34 6 18V19H18V18C18 15.34 14.67 14 12 14ZM12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z" fill="currentColor" />
          </svg>
        </div>
        <h1>Nexus Contacts</h1>
        <p>Your professional network, dynamically organized.</p>
        <button className="btn btn-secondary" style={{ width: 'auto', padding: '8px 20px', marginTop: '20px', borderRadius: '30px', fontSize: '0.9rem' }} onClick={() => { localStorage.removeItem('token'); setIsAuthenticated(false); }}>
          Sign Out
        </button>
      </div>
      <div className="container">
        {/* Left: Form */}
        <div className="card form-card">
          <h2>{editingId ? '✏️ Edit Contact' : '✨ Add New Contact'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" placeholder="ex. John Doe" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input name="email" placeholder="ex. john@company.com" value={formData.email} onChange={handleChange} required />
              {errors.email && <span className="error-msg" style={{ color: 'red', fontSize: '0.8em' }}>{errors.email}</span>}
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              {/* Input restricted to numbers by handleChange logic */}
              <input name="phone" placeholder="ex. 9876543210" value={formData.phone} onChange={handleChange} required />
              {errors.phone && <span className="error-msg" style={{ color: 'red', fontSize: '0.8em' }}>{errors.phone}</span>}
            </div>
            <div className="form-group">
              <label>Notes (Optional)</label>
              <textarea name="message" placeholder="Role, Company, or details..." value={formData.message} onChange={handleChange} />
            </div>
            <button className="btn btn-primary" type="submit" disabled={!isFormValid}>
              {editingId ? 'Update Contact' : 'Save Contact'}
            </button>
            {editingId && <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setFormData({ name: '', email: '', phone: '', message: '' }); setErrors({}); }}>Cancel Edit</button>}
          </form>
        </div>
        {/* Right: List */}
        <div className="card list-card">
          <div className="list-header">
            <h2>Your Contacts <span style={{ color: '#6b7280', fontSize: '0.9em', fontWeight: 'normal' }}>({filteredContacts.length})</span></h2>
            <input className="search-input" placeholder="🔍 Search contacts..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          {loading ? <p style={{ textAlign: 'center', color: '#6b7280' }}>Loading...</p> : (
            <div className="contact-list-container">
              {filteredContacts.length === 0 ? <div className="empty-state">No contacts found. Start adding some!</div> :
                <ul className="contact-list">
                  {filteredContacts.map(c => (
                    <li key={c._id} className="contact-item">
                      <div className="avatar">{getInitials(c.name)}</div>
                      <div className="contact-info">
                        <strong>{c.name}</strong>
                        <p>{c.email}</p>
                        <p style={{ fontSize: '0.8em', color: '#9ca3af' }}>{c.phone}</p>
                      </div>
                      <div className="actions">
                        <button className="btn-icon" onClick={() => handleEdit(c)}>Edit</button>
                        <button className="btn-icon delete" onClick={() => handleDelete(c._id)}>Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;