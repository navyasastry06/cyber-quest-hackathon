import React, { useState, useEffect } from 'react';
import { User, Mail, Zap, Shield, Trophy, Loader2, Terminal, Fingerprint, Trash2 } from 'lucide-react';
import API_BASE_URL from '../config';
import { useColors } from '../context/useColors';

export const getRankInfo = (xp) => {
  if (xp >= 5000) return { rank: 'Shadow Architect', color: '#a855f7', next: null, nextXp: null };
  if (xp >= 2000) return { rank: 'Zero-Day Hunter', color: '#ef4444', next: 'Shadow Architect', nextXp: 5000 };
  if (xp >= 1000) return { rank: 'Threat Analyst', color: '#f59e0b', next: 'Zero-Day Hunter', nextXp: 2000 };
  if (xp >= 500)  return { rank: 'Cyber Scout', color: '#06b6d4', next: 'Threat Analyst', nextXp: 1000 };
  if (xp >= 100)  return { rank: 'Recruit',    color: '#10b981', next: 'Cyber Scout', nextXp: 500 };
  return                  { rank: 'Civilian',  color: '#64748b', next: 'Recruit', nextXp: 100 };
};

const Profile = () => {
  const c = useColors();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('cyberquest_user');
    if (!savedUser) { setLoading(false); return; }
    const { email } = JSON.parse(savedUser);
    fetch(`${API_BASE_URL}/api/user/stats/${email}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setStats(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    const savedUser = localStorage.getItem('cyberquest_user');
    if (!savedUser) return;
    const { email } = JSON.parse(savedUser);
    const confirmDeletion = window.confirm('⚠️ CRITICAL: Terminate operative identity? All XP and records will be purged.');
    if (!confirmDeletion) return;
    const token = localStorage.getItem('cyberquest_token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ email })
      });
      if (response.ok) {
        localStorage.removeItem('cyberquest_token');
        localStorage.removeItem('cyberquest_user');
        setShowSuccess(true);
        setTimeout(() => window.location.href = '/', 2500);
      }
    } catch (err) { console.error('Delete failed:', err); }
  };

  const rankInfo = getRankInfo(stats?.total_xp || 0);
  const accuracy = stats && (stats.phishing_detected + stats.emails_clicked) > 0
    ? Math.round((stats.phishing_detected / (stats.phishing_detected + stats.emails_clicked)) * 100) : 0;
  const nextProgress = rankInfo.nextXp
    ? Math.min(Math.round(((stats?.total_xp || 0) / rankInfo.nextXp) * 100), 100) : 100;

  const statCard = (icon, color, label, value) => (
    <div style={{ background: c.bgCard, border:`1px solid ${c.border}`, borderRadius:18, padding:'20px 24px', display:'flex', alignItems:'center', gap:14, boxShadow: c.isDark?'none':'0 2px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ width:44, height:44, borderRadius:12, background:`${color}15`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        {React.createElement(icon, { size:22, color })}
      </div>
      <div>
        <p style={{ fontSize:10, fontWeight:900, color: c.textMuted, textTransform:'uppercase', letterSpacing:'0.15em', margin:'0 0 4px' }}>{label}</p>
        <p style={{ fontSize:24, fontWeight:900, color: c.textPrimary, margin:0 }}>{value}</p>
      </div>
    </div>
  );

  if (loading) return (
    <div style={{ minHeight:'100vh', background: c.bgPage, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <Loader2 size={32} color={c.cyan} style={{ animation:'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight:'100%', background: c.bgPage, padding:'32px 36px', fontFamily:'inherit', transition:'background 0.25s' }}>
      {showSuccess && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50 }}>
          <div style={{ background: c.bgCard, border:`1px solid ${c.border}`, borderRadius:24, padding:'48px 56px', textAlign:'center' }}>
            <p style={{ fontSize:28, fontWeight:900, color: c.textPrimary, marginBottom:8 }}>Identity Purged</p>
            <p style={{ color: c.textSecondary }}>Redirecting to Home...</p>
          </div>
        </div>
      )}

      <div style={{ maxWidth:900, margin:'0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom:32 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, color: c.cyan, marginBottom:8 }}>
            <Terminal size={13} /><span style={{ fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.25em' }}>Operative File</span>
          </div>
          <h1 style={{ fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:900, textTransform:'uppercase', color: c.textPrimary, margin:0 }}>Agent Profile</h1>
        </div>

        {/* Identity card */}
        <div style={{ background: c.bgCard, border:`1px solid ${c.border}`, borderRadius:24, padding:'28px 32px', marginBottom:24, display:'flex', alignItems:'center', gap:24, boxShadow: c.isDark?'none':'0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ width:72, height:72, borderRadius:20, background:`linear-gradient(135deg,${c.indigo},${c.cyan})`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`0 0 24px ${c.indigo}40` }}>
            <Fingerprint size={36} color="white" />
          </div>
          <div style={{ flex:1 }}>
            <h2 style={{ fontSize:24, fontWeight:900, color: c.textPrimary, margin:'0 0 4px' }}>
              {stats?.username || 'Unknown Operative'}
            </h2>
            <div style={{ display:'flex', alignItems:'center', gap:8, color: c.textSecondary, fontSize:13 }}>
              <Mail size={14} />{stats?.email || '—'}
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <span style={{ fontSize:11, fontWeight:900, color: rankInfo.color, textTransform:'uppercase', letterSpacing:'0.1em', background:`${rankInfo.color}18`, border:`1px solid ${rankInfo.color}35`, padding:'6px 14px', borderRadius:99, display:'block', marginBottom:6 }}>
              {rankInfo.rank}
            </span>
            <span style={{ fontSize:12, color: c.textMuted, fontWeight:600 }}>{stats?.total_xp || 0} XP total</span>
          </div>
        </div>

        {/* Rank progress */}
        {rankInfo.nextXp && (
          <div style={{ background: c.bgCard, border:`1px solid ${c.border}`, borderRadius:20, padding:'20px 28px', marginBottom:24 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
              <span style={{ fontSize:12, fontWeight:700, color: c.textSecondary }}>Progress to <strong style={{ color: rankInfo.color }}>{rankInfo.next}</strong></span>
              <span style={{ fontSize:12, color: rankInfo.color, fontWeight:900 }}>{stats?.total_xp || 0} / {rankInfo.nextXp} XP</span>
            </div>
            <div style={{ height:8, background: c.bgElevated, borderRadius:999, overflow:'hidden', border:`1px solid ${c.border}` }}>
              <div style={{ height:'100%', width:`${nextProgress}%`, background:`linear-gradient(90deg,${c.indigo},${rankInfo.color})`, borderRadius:999, transition:'width 0.8s ease' }} />
            </div>
          </div>
        )}

        {/* Stats grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:32 }}>
          {statCard(Zap,    c.yellow,  'Total XP',   stats?.total_xp || 0)}
          {statCard(Shield, c.green,   'Threats Caught', stats?.phishing_detected || 0)}
          {statCard(Trophy, c.indigo,  'Accuracy',   `${accuracy}%`)}
        </div>

        {/* Danger zone */}
        <div style={{ background:'rgba(239,68,68,0.05)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:20, padding:'24px 28px' }}>
          <h3 style={{ color:'#ef4444', fontWeight:900, fontSize:14, textTransform:'uppercase', letterSpacing:'0.15em', margin:'0 0 8px', display:'flex', alignItems:'center', gap:8 }}>
            <Trash2 size={16} /> Danger Zone
          </h3>
          <p style={{ color: c.textMuted, fontSize:13, margin:'0 0 16px' }}>Permanently delete your operative profile. This cannot be undone.</p>
          <button onClick={handleDelete} style={{ padding:'10px 20px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.4)', borderRadius:12, color:'#ef4444', fontWeight:900, fontSize:12, textTransform:'uppercase', letterSpacing:'0.1em', cursor:'pointer', display:'flex', alignItems:'center', gap:8, transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background='#ef4444'; e.currentTarget.style.color='white'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(239,68,68,0.1)'; e.currentTarget.style.color='#ef4444'; }}>
            <Trash2 size={14} /> Terminate Identity
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;