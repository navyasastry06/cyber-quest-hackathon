import React, { useState } from 'react';
import { Shield, Lock, Mail, User, ArrowRight, AlertTriangle } from 'lucide-react';

const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Determine which backend URL to hit
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    // If logging in, we only send email and password
    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Success! Save the secure token to the browser
      localStorage.setItem('cyberquest_token', data.token);
      localStorage.setItem('cyberquest_user', JSON.stringify(data.user));
      
      // Tell the main App that we are officially logged in
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-gray-950 p-8 text-center border-b border-gray-800">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
            <Shield size={32} className="text-blue-400" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            {isLogin ? 'SYSTEM LOGIN' : 'INITIATE ACCESS'}
          </h2>
          <p className="text-gray-400 mt-2">
            {isLogin ? 'Welcome back, operative.' : 'Create your operative profile.'}
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3">
              <AlertTriangle size={20} className="shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Operative Alias</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full bg-gray-950 border border-gray-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="hacker_one"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Encrypted Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-950 border border-gray-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="agent@cyberquest.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Passcode</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-950 border border-gray-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl mt-6 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'VERIFYING...' : (isLogin ? 'ACCESS MAINFRAME' : 'REGISTER PROFILE')}
              {!isLoading && <ArrowRight size={20} />}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
              {isLogin ? "Don't have clearance yet? " : "Already an operative? "}
              <span className="text-blue-400 underline decoration-blue-400/30 underline-offset-4">
                {isLogin ? "Request Access" : "Login Here"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;