import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { UserCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { ThemeProvider, useTheme } from './context/ThemeContext';
import { useColors } from './context/useColors';

import Home from './pages/Home';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Simulator from './pages/Simulator';
import Tools from './pages/Tools';
import ChatPage from './pages/Chatbot';
import Challenges from './pages/Challenges';
import Profile from './pages/Profile';
import VaultIdScanner from './pages/VaultIdScan';

const getValidUser = () => {
  const token = localStorage.getItem('cyberquest_token');
  const savedUser = localStorage.getItem('cyberquest_user');
  if (!token || !savedUser) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('cyberquest_token');
      localStorage.removeItem('cyberquest_user');
      return null;
    }
    return JSON.parse(savedUser);
  } catch {
    localStorage.removeItem('cyberquest_token');
    localStorage.removeItem('cyberquest_user');
    return null;
  }
};

// ── Toggle switch (defined outside — stable reference) ───────────────
const ThemeToggle = () => {
  const { isDark, toggle } = useTheme();
  return (
    <label className="theme-toggle" title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
      <input type="checkbox" checked={!isDark} onChange={toggle} />
      <div className="theme-toggle-track" />
      <div className="theme-toggle-thumb">{isDark ? '🌙' : '☀️'}</div>
    </label>
  );
};

// ── Header bar (reads theme for colors) ─────────────────────────────
const HeaderBar = ({ user, onLogout }) => {
  const c = useColors();
  const { t, i18n } = useTranslation();

  return (
    <div style={{ padding: '14px 28px', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '8px 16px', borderRadius: 20,
        background: c.isDark ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.85)',
        border: `1px solid ${c.border}`,
        backdropFilter: 'blur(12px)',
        boxShadow: c.isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.07)',
        transition: 'background 0.25s, border-color 0.25s',
      }}>
        <ThemeToggle />

        <div style={{ width: 1, height: 16, background: c.border }} />

        <select 
          value={i18n.language.split('-')[0]} 
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          style={{
            background: 'transparent', border: 'none', color: c.textSecondary, 
            fontSize: 12, fontWeight: 700, outline: 'none', cursor: 'pointer',
            paddingRight: 4, fontFamily: 'inherit'
          }}
        >
          <option value="en" style={{ color: '#000' }}>EN</option>
          <option value="es" style={{ color: '#000' }}>ES</option>
          <option value="hi" style={{ color: '#000' }}>HI</option>
        </select>

        <div style={{ width: 1, height: 16, background: c.border }} />

        <Link to="/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${c.indigo}18`, border: `1px solid ${c.indigo}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.indigo }}>
            <UserCircle2 size={18} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: c.textSecondary }}>
            {t('operative')}: <strong style={{ color: c.indigo }}>{user?.username}</strong>
          </span>
        </Link>

        <div style={{ width: 1, height: 16, background: c.border }} />

        <button onClick={onLogout}
          style={{ fontSize: 11, fontWeight: 900, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.05em' }}>
          {t('logout')}
        </button>
      </div>
    </div>
  );
};

// ── Protected layout (defined OUTSIDE AppInner — stable component reference) ──
// Receives user + onLogout as props so it doesn't need the AppInner closure.
const ProtectedLayout = ({ children, user, onLogout }) => {
  if (!user) return <Navigate to="/auth" />;
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden' }}>
      <div id="gradient-bg" />
      <div id="grid-overlay" />

      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0, position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        <HeaderBar user={user} onLogout={onLogout} />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// ── Inner app (has access to ThemeContext) ───────────────────────────
function AppInner() {
  const [user, setUser] = useState(() => getValidUser());

  const handleLogout = () => {
    localStorage.removeItem('cyberquest_token');
    localStorage.removeItem('cyberquest_user');
    setUser(null);
  };

  // Helper to wrap a page in ProtectedLayout with stable props
  const wrap = (page) => (
    <ProtectedLayout user={user} onLogout={handleLogout}>
      {page}
    </ProtectedLayout>
  );

  return (
    <Router>
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/auth"       element={!user ? <Auth onLoginSuccess={setUser} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard"  element={wrap(<Dashboard />)} />
        <Route path="/simulator"  element={wrap(<Simulator />)} />
        <Route path="/tools"      element={wrap(<Tools />)} />
        <Route path="/chat"       element={wrap(<ChatPage />)} />
        <Route path="/challenges" element={wrap(<Challenges />)} />
        <Route path="/profile"    element={wrap(<Profile />)} />
        <Route path="/vaultid"    element={wrap(<VaultIdScanner />)} />
        <Route path="*"           element={<Navigate to={user ? '/dashboard' : '/'} />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}