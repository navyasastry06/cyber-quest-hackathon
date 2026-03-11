import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, Wrench, Bot, Shield, Trophy, Search, Crosshair, Activity } from 'lucide-react';
import { useColors } from '../context/useColors';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/simulator', icon: ShieldAlert, label: 'Simulator' },
  { to: '/tools', icon: Wrench, label: 'Threat Tools' },
  { to: '/ai-detector', icon: Shield, label: 'Intrusion Detector' },
  { to: '/chat', icon: Bot, label: 'AI Copilot' },
  { to: '/vaultid', icon: Search, label: 'Intel Scanner' },
  { to: '/challenges', icon: Trophy, label: 'Challenges' },
  { to: '/attack-surface', icon: Crosshair, label: 'Attack Surface' },
  { to: '/identity-timeline', icon: Activity, label: 'Identity Timeline' },
];

const Sidebar = () => {
  const location = useLocation();
  const c = useColors();
  const isActive = (path) => location.pathname === path;

  return (
    <div style={{
      width: 240, background: c.sidebarBg, color: c.textPrimary,
      display: 'flex', flexDirection: 'column', height: '100vh',
      borderRight: `1px solid ${c.sidebarBorder}`, flexShrink: 0,
      transition: 'background 0.25s, color 0.25s, border-color 0.25s',
    }}>

      {}
      <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${c.sidebarBorder}` }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#4f46e5,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(79,70,229,0.35)', flexShrink: 0 }}>
          <Shield size={20} color="white" />
        </div>
        <div>
          <p style={{ color: c.textPrimary, fontWeight: 900, fontSize: 14, margin: 0, lineHeight: 1.2 }}>CyberQuest</p>
          <p style={{ color: c.indigo, fontWeight: 700, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>Operative Hub</p>
        </div>
      </div>

      {}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <p style={{ color: c.textMuted, fontWeight: 900, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.2em', padding: '8px 10px 4px', margin: 0 }}>Modules</p>
        {NAV_ITEMS.map(({ to, icon, label }) => {
          const active = isActive(to);
          const IconCmp = icon;
          return (
            <Link key={to} to={to} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 12, marginBottom: 2,
                background: active ? c.sidebarActive : 'transparent',
                border: active ? `1px solid ${c.indigo}35` : '1px solid transparent',
                color: active ? c.indigo : c.sidebarText,
                fontWeight: 600, fontSize: 13, cursor: 'pointer',
                transition: 'all 0.18s',
              }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = c.bgHover; e.currentTarget.style.color = c.textPrimary; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = c.sidebarText; } }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? `${c.indigo}20` : 'transparent', flexShrink: 0 }}>
                  <IconCmp size={16} />
                </div>
                <span>{label}</span>
                {active && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: c.indigo, boxShadow: `0 0 6px ${c.indigo}` }} />}
              </div>
            </Link>
          );
        })}
      </nav>

      {}
      <div style={{ padding: 12, borderTop: `1px solid ${c.sidebarBorder}` }}>
        <div style={{ background: c.bgHover, border: `1px solid ${c.border}`, borderRadius: 12, padding: '10px 14px', textAlign: 'center' }}>
          <p style={{ color: c.textMuted, fontWeight: 900, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', margin: '0 0 4px' }}>System Status</p>
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, margin: 0, color: c.textSecondary, fontWeight: 600, fontSize: 12 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', display: 'inline-block' }} />
            Online & Secure
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;