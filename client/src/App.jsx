import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';

import './App.css';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import ContactsDirectory from './pages/ContactsDirectory';
import ContactFormPage from './pages/ContactFormPage';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [authMode, setAuthMode] = useState('login');
  
  // Custom Protected Route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
      <BrowserRouter>
        <Toaster position="top-right" />
        
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? (
                <div className="auth-wrapper min-h-screen bg-gray-50 flex items-center justify-center p-4">
                  <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="flex justify-center mb-8">
                      <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-md">N</div>
                    </div>
                    <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">Nexus Contacts</h2>
                    
                    <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
                      <button 
                        onClick={() => setAuthMode('login')} 
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${authMode === 'login' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Sign In
                      </button>
                      <button 
                        onClick={() => setAuthMode('register')} 
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${authMode === 'register' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Create Account
                      </button>
                    </div>
                    
                    {authMode === 'login' ? 
                      <Login onLogin={() => setIsAuthenticated(true)} /> : 
                      <Register onRegister={() => setIsAuthenticated(true)} />
                    }
                  </div>
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />

          {/* Protected Routes inside MainLayout */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainLayout setIsAuthenticated={setIsAuthenticated} />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="contacts" element={<ContactsDirectory />} />
            <Route path="contacts/new" element={<ContactFormPage />} />
            <Route path="contacts/edit/:id" element={<ContactFormPage />} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;