import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

// --- NEW PAGES ---
import Home from './pages/Home';
import Auth from './components/Auth';

// --- YOUR EXISTING COMPONENTS ---
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Simulator from './pages/Simulator';
import Tools from './pages/Tools';
import ChatPage from './pages/Chatbot';
import Challenges from './pages/Challenges';
import Profile from './pages/Profile';
import VaultIdScanner from './pages/VaultIdScan';

function App() {
  // ==========================================
  // 🔥 HACKATHON BYPASS MODE ACTIVATED 🔥
  // Tell your friends they don't need the database. 
  // Remember to change this back to localStorage before your final submission!
  // ==========================================
  const [user, setUser] = useState({ 
    username: "Animation_Team", 
    total_xp: 5000 
  });

  // 2. Create a "Security Wrapper" for your old layout
  // This layout includes your Sidebar, but only loads if they are logged in!
  const ProtectedLayout = ({ children }) => {
    if (!user) {
      return <Navigate to="/auth" />;
    }

    return (
      <div className="flex min-h-screen bg-[#f9fafb]">
        {/* Your exact Sidebar! */}
        <Sidebar />
        
        {/* We went exactly back to your original code here */}
        <div className="flex-1 overflow-y-auto relative">
          
          {/* FLOATING HEADER: This hovers over the page and won't mess up your alignment! */}
          <div className="absolute top-4 right-8 z-50 flex items-center gap-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-sm border border-gray-200">
            
            {/* 🔥 FIX 1: Wrapped the username in a clickable Link to the profile */}
            <Link to="/profile" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
              Operative: <span className="text-blue-600 font-bold">{user.username}</span>
            </Link>

            <div className="w-px h-4 bg-gray-300"></div>
            <button
              onClick={() => {
                localStorage.removeItem('cyberquest_token');
                localStorage.removeItem('cyberquest_user');
                setUser(null);
              }}
              className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
            >
              LOGOUT
            </button>
          </div>

          {/* This renders whichever page they clicked on exactly like it used to */}
          {children}
        </div>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<Home />} />
        <Route 
          path="/auth" 
          element={!user ? <Auth onLoginSuccess={setUser} /> : <Navigate to="/dashboard" />} 
        />

        {/* --- YOUR PROTECTED APP ROUTES --- */}
        <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
        <Route path="/simulator" element={<ProtectedLayout><Simulator /></ProtectedLayout>} />
        <Route path="/tools" element={<ProtectedLayout><Tools /></ProtectedLayout>} />
        <Route path="/chat" element={<ProtectedLayout><ChatPage /></ProtectedLayout>} />
        <Route path="/challenges" element={<ProtectedLayout><Challenges /></ProtectedLayout>} />
        
        {/* 🔥 FIX 2: Added the official route for the Profile page! */}
        <Route path="/profile" element={<ProtectedLayout><Profile /></ProtectedLayout>} />
        
        {/* 🔥 NEW: The VaultID Scanner Route! */}
        <Route path="/vaultid" element={<ProtectedLayout><VaultIdScanner /></ProtectedLayout>} />

        {/* Catch-all: If they type a weird URL, send them to dashboard if logged in, or home if not */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
      </Routes>
    </Router>
  );
}

export default App;