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
                <div className="min-h-screen w-full bg-[#0f172a] flex">
                  {/* Left Side: Illustration */}
                  <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden border-r border-white/10">
                    {/* Pulsing background behind image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 mix-blend-overlay"></div>
                    <img 
                      src="/login-bg.png" 
                      alt="Nexus CRM Network" 
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    <div className="relative z-10 p-12 text-center backdrop-blur-md bg-black/20 rounded-3xl border border-white/10 mx-8">
                      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 mb-4">
                        Connect. Manage. Grow.
                      </h1>
                      <p className="text-indigo-100/80 text-lg">
                        The ultimate intelligent contact management platform.
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Form */}
                  <div className="flex-1 flex items-center justify-center p-8 sm:p-12 relative overflow-hidden">
                    {/* Animated Background Elements for Right Side */}
                    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                    
                    <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/10 relative z-10">
                      <div className="flex justify-center mb-6">
                        <div className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-indigo-500/30">N</div>
                      </div>
                      <h2 className="text-center text-3xl font-bold text-white mb-2">Nexus Connect</h2>
                      <p className="text-center text-indigo-200/80 mb-8 text-sm">Sign in to access your dashboard</p>
                      
                      <div className="flex bg-black/30 p-1.5 rounded-xl mb-8 backdrop-blur-md">
                      <button 
                        onClick={() => setAuthMode('login')} 
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${authMode === 'login' ? 'bg-white text-indigo-900 shadow-md transform scale-100' : 'text-indigo-200 hover:text-white transform scale-95'}`}
                      >
                        Sign In
                      </button>
                      <button 
                        onClick={() => setAuthMode('register')} 
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${authMode === 'register' ? 'bg-white text-indigo-900 shadow-md transform scale-100' : 'text-indigo-200 hover:text-white transform scale-95'}`}
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