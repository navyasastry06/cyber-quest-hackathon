import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Trophy, Zap, Target, Star, Terminal, Activity, ChevronRight, AlertTriangle } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import { useColors } from '../context/useColors';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch { return true; }
};

const Dashboard = () => {
  const c = useColors();
  const [userData, setUserData] = useState({ username: 'Operative', total_xp: 0, phishing_detected: 0, emails_clicked: 0, challenges_completed: 0 });
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const savedUser = localStorage.getItem('cyberquest_user');
      const token = localStorage.getItem('cyberquest_token');
      if (isTokenExpired(token)) {
        localStorage.removeItem('cyberquest_token');
        localStorage.removeItem('cyberquest_user');
        setSessionExpired(true); setLoading(false); return;
      }
      if (!savedUser) { setLoading(false); return; }
      const { email } = JSON.parse(savedUser);
      try {
        setError(null);
        const [statsRes, lbRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/user/stats/${email}`),
          fetch(`${API_BASE_URL}/api/user/leaderboard`)
        ]);
        if (!statsRes.ok) throw new Error('Failed to load your stats.');
        if (!lbRes.ok) throw new Error('Failed to load leaderboard.');
        setUserData(await statsRes.json());
        setLeaderboard(await lbRes.json());
      } catch (err) {
        setError(err.message || 'Could not connect to the server. Is the backend running?');
      } finally { setLoading(false); }
    };
    fetchDashboardData();
  }, []);

  if (sessionExpired) return <Navigate to="/auth" />;

  const accuracy = userData.phishing_detected + userData.emails_clicked > 0
    ? Math.round((userData.phishing_detected / (userData.phishing_detected + userData.emails_clicked)) * 100) : 0;

  const chartData = {
    labels: ['NEUTRALIZED', 'COMPROMISED'],
    datasets: [{ data: [userData.phishing_detected || 0, userData.emails_clicked || 0], backgroundColor: ['#15803d', '#ef4444'], borderRadius: 6, barThickness: 44 }],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: c.chartGrid }, ticks: { color: c.chartTick, font: { weight: 'bold' } } },
      x: { grid: { display: false }, ticks: { color: c.chartTick, font: { weight: 900 } } }
    }
  };

  const STAT_CARDS = [
    { label: 'Total XP',      val: userData.total_xp,         icon: Zap,    accent: '#f59e0b' },
    { label: 'Arena Success', val: userData.challenges_completed, icon: Target, accent: '#6366f1' },
    { label: 'Accuracy',      val: `${accuracy}%`,             icon: Star,   accent: '#10b981' },
  ];

  if (loading) return (
    <div style={{ minHeight: '100vh', background: c.bgPage, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#10b981', fontFamily: 'monospace', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Initialising Systems...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: c.bgPage, color: c.textPrimary, padding: '40px', fontFamily: 'inherit', transition: 'background 0.25s, color 0.25s' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        {}
        {error && (
          <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '14px 20px', borderRadius: 16 }}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 14 }}>{error}</span>
          </div>
        )}

        {}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, color: c.cyan, marginBottom: 8 }}>
              <Terminal size={16} />
              <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.25em' }}>Virtual Simulation</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', color: c.textPrimary, margin: '0 0 6px' }}>Operational Dashboard</h1>
            <p style={{ color: c.textSecondary, fontWeight: 600, margin: 0 }}>Monitor your security instincts and rank up.</p>
          </div>

          {}
          <div style={{ background: c.bgCard, border: `1px solid rgba(234,179,8,0.25)`, padding: '18px 28px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 16, boxShadow: c.isDark ? '0 0 20px rgba(234,179,8,0.08)' : '0 2px 12px rgba(0,0,0,0.08)' }}>
            <Trophy color="#f59e0b" size={28} />
            <div>
              <span style={{ display: 'block', fontSize: 10, fontWeight: 900, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Global Rank XP</span>
              <span style={{ fontSize: 28, fontWeight: 900, color: c.textPrimary }}>{userData.total_xp} XP</span>
            </div>
          </div>
        </div>

        {}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginBottom: 40 }}>
          {STAT_CARDS.map((card, i) => (
            <div key={i} style={{ background: c.bgCard, border: `1px solid ${card.accent}25`, padding: '28px 28px 24px', borderRadius: 24, position: 'relative', overflow: 'hidden', transition: 'background 0.2s, box-shadow 0.2s', boxShadow: c.isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
              <card.icon size={64} color={card.accent} style={{ position: 'absolute', right: -10, top: -10, opacity: 0.06 }} />
              <card.icon size={28} color={card.accent} style={{ marginBottom: 14 }} />
              <p style={{ color: c.textLabel, fontWeight: 900, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 6 }}>{card.label}</p>
              <p style={{ fontSize: 44, fontWeight: 900, color: c.textPrimary, letterSpacing: '-0.03em', margin: 0 }}>{card.val}</p>
            </div>
          ))}
        </div>

        {}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 28 }}>

          {}
          <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, padding: 32, borderRadius: 28, boxShadow: c.isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
              <Activity size={18} color={c.indigo} />
              <h3 style={{ color: c.textPrimary, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: 13, margin: 0 }}>Field Performance</h3>
            </div>
            <div style={{ height: 280 }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>

          {}
          <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 28, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: c.isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ padding: '24px 28px', borderBottom: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Trophy size={18} color="#f59e0b" />
              <h3 style={{ color: c.textPrimary, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: 13, margin: 0 }}>Leaderboard</h3>
            </div>

            <div style={{ padding: '16px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {leaderboard.length === 0 && !error ? (
                <p style={{ color: c.textMuted, fontSize: 13, textAlign: 'center', padding: '24px 0' }}>No operatives ranked yet.</p>
              ) : leaderboard.map((player, idx) => (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', borderRadius: 14,
                  background: player.username === userData.username ? `${c.indigo}18` : c.bgElevated,
                  border: player.username === userData.username ? `1px solid ${c.indigo}40` : `1px solid ${c.border}`,
                  transition: 'background 0.2s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, background: idx === 0 ? '#f59e0b' : c.bgCard, color: idx === 0 ? '#000' : c.textSecondary, border: `1px solid ${c.border}` }}>
                      {idx + 1}
                    </span>
                    <span style={{ fontWeight: 700, color: c.textPrimary, fontSize: 13 }}>{player.username}</span>
                  </div>
                  <span style={{ color: c.indigo, fontWeight: 900, fontSize: 11, textTransform: 'uppercase' }}>{player.total_xp} XP</span>
                </div>
              ))}
            </div>

            <button style={{ margin: 16, padding: '14px', background: c.bgElevated, border: `1px solid ${c.border}`, borderRadius: 16, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.25em', color: c.textSecondary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c.indigo; e.currentTarget.style.color = c.indigo; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textSecondary; }}>
              View Full Rankings <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;