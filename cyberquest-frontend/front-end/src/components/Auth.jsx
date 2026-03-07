import React, { useState } from 'react';
import { Shield, Lock, Mail, User, ArrowRight, AlertTriangle } from 'lucide-react';
import Lottie from 'lottie-react';
import API_BASE_URL from '../config';
import { useColors } from '../context/useColors';
import { useTheme } from '../context/ThemeContext';
import authAnimation from '../assets/auth-animation.json';

// Theme toggle reusing the index.css component
const AuthThemeToggle = () => {
  const { isDark, toggle } = useTheme();
  return (
    <label className="theme-toggle" title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'} style={{ flexShrink: 0 }}>
      <input type="checkbox" checked={!isDark} onChange={toggle} />
      <div className="theme-toggle-track" />
      <div className="theme-toggle-thumb">{isDark ? '🌙' : '☀️'}</div>
    </label>
  );
};

// Field defined OUTSIDE Auth so it has a stable reference across renders.
// Receives c, formData, handleChange as props instead of via closure.
const Field = ({ label, icon: Icon, type, name, placeholder, inputStyle, c, value, onChange, children }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: c.textLabel, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>{label}</label>
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: c.textMuted }}><Icon size={17} /></div>
      <input type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} style={inputStyle}
        onFocus={e => e.target.style.borderColor = c.indigo}
        onBlur={e => e.target.style.borderColor = c.border} />
      {children}
    </div>
  </div>
);

const Auth = ({ onLoginSuccess }) => {
  const c = useColors();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    if (!isLogin && formData.username.trim().length < 3) return 'Username must be at least 3 characters.';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Please enter a valid email address.';
    if (formData.password.length < 6) return 'Password must be at least 6 characters.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setIsLoading(true);
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin ? { email: formData.email, password: formData.password } : formData;
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Authentication failed');
      localStorage.setItem('cyberquest_token', data.token);
      localStorage.setItem('cyberquest_user', JSON.stringify(data.user));
      if (onLoginSuccess) onLoginSuccess(data.user);
    } catch (err) { setError(err.message); } finally { setIsLoading(false); }
  };

  const inputStyle = {
    width: '100%', background: c.bgInput, border: `1px solid ${c.border}`,
    color: c.textPrimary, borderRadius: 12, padding: '13px 16px 13px 44px',
    fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
    transition: 'border 0.2s',
  };

  const fieldProps = { inputStyle, c, onChange: handleChange };

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', background: c.bgPage, fontFamily: 'inherit', transition: 'background 0.25s' }}>

      {/* LEFT — Brand panel (hidden on small screens) */}
      <div className="hidden lg:flex" style={{ width: '50%', background: c.isDark ? '#070b14' : '#f0f4ff', borderRight: `1px solid ${c.border}`, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', position: 'relative', overflow: 'hidden' }}>
        {/* Glow */}
        <div style={{ position:'absolute', inset:0, background: c.isDark ? 'radial-gradient(ellipse at 50% 50%,rgba(99,102,241,0.12) 0%,transparent 70%)' : 'radial-gradient(ellipse at 50% 50%,rgba(99,102,241,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />
        {/* Grid */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:`linear-gradient(${c.border} 1px,transparent 1px),linear-gradient(90deg,${c.border} 1px,transparent 1px)`, backgroundSize:'60px 60px' }} />

        <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:400, textAlign:'center' }}>
          <div style={{ width:80, height:80, borderRadius:24, background:'linear-gradient(135deg,#4f46e5,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 32px', boxShadow:'0 0 40px rgba(79,70,229,0.4)', position:'relative', zIndex:2 }}>
            <Shield size={40} color="white" />
          </div>
          
          <div style={{ width:'100%', aspectRatio:'1', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12, marginTop:-20 }}>
            <Lottie animationData={authAnimation} loop={true} style={{ width: '120%', height: '120%' }} />
          </div>

          <h2 style={{ color: c.textPrimary, fontWeight:900, fontSize:28, marginBottom:12 }}>
            Welcome to <span style={{ background:'linear-gradient(90deg,#06b6d4,#6366f1)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>CyberQuest</span>
          </h2>
          <p style={{ color: c.textSecondary, fontSize:15, lineHeight:1.65 }}>The ultimate training ground for elite security operatives.</p>
        </div>
      </div>

      {/* RIGHT — Form */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px', background: c.bgCard, position:'relative' }}>

        {/* Theme toggle — top right corner */}
        <div style={{ position:'absolute', top:20, right:24 }}>
          <AuthThemeToggle />
        </div>

        <div style={{ width:'100%', maxWidth:420 }}>

          {/* Mobile logo (only shows on small screens) */}
          <div style={{ textAlign:'center', marginBottom:32 }} className="lg:hidden">
            <div style={{ width:60, height:60, borderRadius:16, background:'linear-gradient(135deg,#4f46e5,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', boxShadow:'0 0 20px rgba(79,70,229,0.3)' }}>
              <Shield size={28} color="white" />
            </div>
            <h1 style={{ color: c.textPrimary, fontWeight:900, fontSize:22 }}>CyberQuest</h1>
          </div>

          <div style={{ marginBottom:32 }}>
            <h2 style={{ color: c.textPrimary, fontWeight:900, fontSize:28, letterSpacing:'-0.02em', margin:'0 0 8px' }}>
              {isLogin ? 'SYSTEM LOGIN' : 'INITIATE ACCESS'}
            </h2>
            <p style={{ color: c.textSecondary, margin:0 }}>
              {isLogin ? 'Welcome back, operative. Please authenticate.' : 'Create your operative profile to begin training.'}
            </p>
          </div>

          {error && (
            <div style={{ marginBottom:20, display:'flex', alignItems:'center', gap:10, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.35)', color:'#ef4444', padding:'12px 16px', borderRadius:12 }}>
              <AlertTriangle size={17} style={{ flexShrink:0 }} />
              <span style={{ fontSize:13, fontWeight:500 }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <Field label="Operative Alias" icon={User} type="text" name="username"
                placeholder="hacker_one" value={formData.username} {...fieldProps} />
            )}
            <Field label="Encrypted Email" icon={Mail} type="email" name="email"
              placeholder="agent@cyberquest.com" value={formData.email} {...fieldProps} />

            <div style={{ marginBottom:18 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:900, color: c.textLabel, textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:8 }}>Passcode</label>
              <div style={{ position:'relative' }}>
                <div style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color: c.textMuted }}><Lock size={17} /></div>
                <input type="password" name="password" value={formData.password} onChange={handleChange}
                  placeholder="••••••••" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = c.indigo}
                  onBlur={e => e.target.style.borderColor = c.border} />
              </div>
              {!isLogin && formData.password.length > 0 && formData.password.length < 6 && (
                <p style={{ color:'#f59e0b', fontSize:12, marginTop:6 }}>Password must be at least 6 characters.</p>
              )}
            </div>

            <button type="submit" disabled={isLoading}
              style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', background:'linear-gradient(135deg,#4f46e5,#6366f1)', color:'white', fontWeight:900, fontSize:14, letterSpacing:'0.05em', cursor:isLoading?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:28, opacity:isLoading?0.7:1, boxShadow:'0 4px 20px rgba(79,70,229,0.35)', transition:'opacity 0.2s,transform 0.15s' }}
              onMouseEnter={e => { if(!isLoading) e.currentTarget.style.transform='scale(1.01)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; }}>
              {isLoading ? 'VERIFYING...' : (isLogin ? 'ACCESS MAINFRAME' : 'REGISTER PROFILE')}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <div style={{ marginTop:28, paddingTop:24, borderTop:`1px solid ${c.border}`, textAlign:'center' }}>
            <button type="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); setFormData({ username:'', email:'', password:'' }); }}
              style={{ background:'none', border:'none', cursor:'pointer', color: c.textSecondary, fontSize:13, fontWeight:500 }}>
              {isLogin ? "Don't have clearance yet? " : "Already an operative? "}
              <span style={{ color: c.indigo, fontWeight:700 }}>{isLogin ? 'Request Access' : 'Login Here'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;