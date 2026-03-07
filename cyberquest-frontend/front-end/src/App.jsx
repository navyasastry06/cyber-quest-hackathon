import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

// --- NEW PAGES ---
import Home from './pages/Home';
import Auth from './components/Auth';
import MLDetector from './pages/MLDetector';

// --- EXISTING COMPONENTS ---
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Simulator from './pages/Simulator';
import Tools from './pages/Tools';
import ChatPage from './pages/Chatbot';
import Challenges from './pages/Challenges';
import Profile from './pages/Profile';
import VaultIdScanner from './pages/VaultIdScan';

function App() {

  const [user, setUser] = useState({
    username: "Animation_Team",
    total_xp: 5000
  });

  const ProtectedLayout = ({ children }) => {

    if (!user) {
      return <Navigate to="/auth" />;
    }

    return (
      <div className="flex min-h-screen bg-[#f9fafb]">

        <Sidebar />

        <div className="flex-1 overflow-y-auto relative">

          <div className="absolute top-4 right-8 z-50 flex items-center gap-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-sm border border-gray-200">

            <Link
              to="/profile"
              className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Operative:
              <span className="text-blue-600 font-bold"> {user.username}</span>
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

          {children}

        </div>
      </div>
    );
  };

  return (
    <Router>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/auth"
          element={!user ? <Auth onLoginSuccess={setUser} /> : <Navigate to="/dashboard" />}
        />

        <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />

        <Route path="/simulator" element={<ProtectedLayout><Simulator /></ProtectedLayout>} />

        <Route path="/tools" element={<ProtectedLayout><Tools /></ProtectedLayout>} />

        {/* AI Intrusion Detection Page */}
        <Route path="/ai-detector" element={<ProtectedLayout><MLDetector /></ProtectedLayout>} />

        <Route path="/chat" element={<ProtectedLayout><ChatPage /></ProtectedLayout>} />

        <Route path="/challenges" element={<ProtectedLayout><Challenges /></ProtectedLayout>} />

        <Route path="/profile" element={<ProtectedLayout><Profile /></ProtectedLayout>} />

        <Route path="/vaultid" element={<ProtectedLayout><VaultIdScanner /></ProtectedLayout>} />

        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />

      </Routes>

    </Router>
  );
}

export default App;