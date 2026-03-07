import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Terminal, Zap, Eye, Code2, Trophy, ChevronRight, Lock, Cpu, Globe, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const FEATURES = [
  { icon: Eye,    color: '#06b6d4', title: 'Phishing Simulator',  desc: 'Train against real-world emails. Spot threats before they reach your network.' },
  { icon: Code2,  color: '#a855f7', title: 'Code Auditor',        desc: 'Find security flaws in vulnerable code before attackers exploit them.' },
  { icon: Cpu,    color: '#10b981', title: 'VaultID Scanner',     desc: 'AI-powered email reputation scanner. Know who is in your inbox.' },
  { icon: Globe,  color: '#6366f1', title: 'Threat Arsenal',      desc: 'IP tracer, password strength meter, and cryptographic forge.' },
  { icon: Trophy, color: '#f59e0b', title: 'Ranked Leaderboard',  desc: 'Compete globally — earn XP for every threat detected and challenge won.' },
  { icon: Lock,   color: '#ef4444', title: 'CyberGuard AI',       desc: 'Your AI copilot for threats, laws, and vulnerability queries.' },
];

const TERMINAL_LINES = [
  { prefix: '$', text: 'cyberquest --init-training',          color: '#10b981' },
  { prefix: '✓', text: 'Loading phishing simulator...',       color: '#06b6d4' },
  { prefix: '✓', text: 'Connecting to threat database...',    color: '#06b6d4' },
  { prefix: '!', text: 'Suspicious email detected',           color: '#f59e0b' },
  { prefix: '✓', text: 'AI analysis complete: PHISHING',      color: '#ef4444' },
  { prefix: '$', text: 'award-xp --user operative --amt 100', color: '#10b981' },
  { prefix: '✓', text: '+100 XP awarded. Rank: Analyst',      color: '#a855f7' },
  { prefix: '$', text: 'run challenges --mode code-audit',    color: '#10b981' },
];

// Theme toggle — reuses CSS class from index.css
const HomeThemeToggle = () => {
  const { isDark, toggle } = useTheme();
  return (
    <label className="theme-toggle" title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'} style={{ flexShrink: 0 }}>
      <input type="checkbox" checked={!isDark} onChange={toggle} />
      <div className="theme-toggle-track" />
      <div className="theme-toggle-thumb">{isDark ? '🌙' : '☀️'}</div>
    </label>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [visibleLines, setVisibleLines] = useState(1);
  const [blink, setBlink] = useState(true);

  // ── Dynamic palette based on current theme ──────────────────────────
  const C = {
    // Page & card backgrounds
    pageBg:    isDark ? 'linear-gradient(160deg,#0d1020 0%,#0b1628 40%,#0d0b20 100%)'
                      : 'linear-gradient(160deg,#e8f0ff 0%,#f0f4ff 40%,#e8eeff 100%)',
    cardBg:    isDark ? '#0a0d16' : '#ffffff',
    elevated:  isDark ? '#111827' : '#f1f5f9',
    border:    isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.09)',
    // Text
    textHero:  isDark ? '#ffffff' : '#0f172a',
    textBody:  isDark ? '#94a3b8' : '#475569',
    textMuted: isDark ? '#475569' : '#94a3b8',
    textDim:   isDark ? '#374151' : '#94a3b8',
    // Terminal
    termBg:    isDark ? '#0a0d16' : '#1e2030',
    termBar:   isDark ? '#111827' : '#161927',
    // Glows
    glowL: isDark
      ? 'radial-gradient(circle,rgba(99,102,241,0.13) 0%,transparent 70%)'
      : 'radial-gradient(circle,rgba(99,102,241,0.09) 0%,transparent 70%)',
    glowR: isDark
      ? 'radial-gradient(circle,rgba(6,182,212,0.1) 0%,transparent 70%)'
      : 'radial-gradient(circle,rgba(6,182,212,0.07) 0%,transparent 70%)',
    // footer text
    accent: '#6366f1',
  };

  useEffect(() => {
    if (visibleLines < TERMINAL_LINES.length) {
      const t = setTimeout(() => setVisibleLines(v => v + 1), 650);
      return () => clearTimeout(t);
    }
  }, [visibleLines]);

  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 520);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ position:'fixed', inset:0, zIndex:50, overflowY:'auto', fontFamily:'inherit', background: C.pageBg, transition:'background 0.4s ease' }}>

      {/* Grid overlay */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none',
        backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`,
        backgroundSize:'60px 60px' }} />

      {/* Glow accents */}
      <div style={{ position:'fixed', top:'-200px', left:'-100px', width:'600px', height:'600px', borderRadius:'50%', pointerEvents:'none', background: C.glowL }} />
      <div style={{ position:'fixed', bottom:'-100px', right:'-100px', width:'500px', height:'500px', borderRadius:'50%', pointerEvents:'none', background: C.glowR }} />

      <div style={{ maxWidth:1280, margin:'0 auto', padding:'48px 24px', position:'relative', zIndex:10 }}>

        {/* ── NAV ── */}
        <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'80px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#4f46e5,#06b6d4)', boxShadow:'0 0 20px rgba(79,70,229,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Shield size={20} color="white" />
            </div>
            <div>
              <p style={{ color: C.textHero, fontWeight:900, fontSize:16, margin:0, lineHeight:1.1 }}>CyberQuest</p>
              <p style={{ color:'#6366f1', fontWeight:700, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', margin:0 }}>Security Training</p>
            </div>
          </div>
          {/* Toggle + Login */}
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <HomeThemeToggle />
            <div style={{ width:1, height:20, background: C.border }} />
            <button onClick={() => navigate('/auth')}
              style={{ color: C.textBody, fontWeight:700, fontSize:14, background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:4, transition:'color 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.color=C.textHero}
              onMouseLeave={e=>e.currentTarget.style.color=C.textBody}>
              Login <ChevronRight size={15} />
            </button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'64px', alignItems:'center', marginBottom:'96px' }}>

          {/* LEFT */}
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 16px', borderRadius:999, border:'1px solid rgba(99,102,241,0.3)', background:'rgba(99,102,241,0.1)', color:'#818cf8', fontSize:11, fontWeight:900, letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:32 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#6366f1', animation:'pulse 2s infinite' }} />
              Gamified Cybersecurity Training
            </div>

            <h1 style={{ fontWeight:900, lineHeight:1.05, letterSpacing:'-0.03em', marginBottom:24, color: C.textHero, fontSize:'clamp(2.6rem,5.5vw,4.5rem)', transition:'color 0.3s' }}>
              Train Like a{' '}
              <span style={{ background:'linear-gradient(90deg,#06b6d4,#6366f1)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Hacker.</span>
              <br />
              Defend Like a{' '}
              <span style={{ background:'linear-gradient(90deg,#10b981,#06b6d4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Pro.</span>
            </h1>

            <p style={{ color: C.textBody, fontSize:18, lineHeight:1.7, marginBottom:40, maxWidth:480, transition:'color 0.3s' }}>
              The ultimate gamified arena for security operatives. Detect phishing, audit code, hunt threats — and earn XP for every win.
            </p>

            <div style={{ display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
              <button onClick={() => navigate('/auth')}
                style={{ display:'flex', alignItems:'center', gap:10, color:'white', fontWeight:900, fontSize:16, padding:'14px 28px', borderRadius:16, border:'none', cursor:'pointer', background:'linear-gradient(135deg,#4f46e5,#06b6d4)', boxShadow:'0 0 30px rgba(79,70,229,0.4)', transition:'transform 0.2s,box-shadow 0.2s' }}
                onMouseEnter={e=>{ e.currentTarget.style.transform='scale(1.04)'; e.currentTarget.style.boxShadow='0 0 45px rgba(79,70,229,0.6)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='0 0 30px rgba(79,70,229,0.4)'; }}>
                <Terminal size={20} /> Initialize Access <ArrowRight size={18} />
              </button>
              <p style={{ color: C.textMuted, fontSize:13, margin:0 }}>
                <span style={{ color:'#10b981' }}>✓</span> Free to join · No credit card
              </p>
            </div>
          </div>

          {/* RIGHT — Terminal */}
          <div style={{ position:'relative' }}>
            <div style={{ position:'absolute', inset:0, borderRadius:24, background:'radial-gradient(ellipse,rgba(99,102,241,0.2) 0%,transparent 70%)', filter:'blur(20px)', zIndex:-1 }} />
            <div style={{ borderRadius:20, overflow:'hidden', border:`1px solid ${C.border}`, boxShadow:'0 30px 70px rgba(0,0,0,0.5)', background: C.termBg, transition:'background 0.3s, border-color 0.3s' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 20px', background: C.termBar, borderBottom:`1px solid ${C.border}` }}>
                <div style={{ width:12, height:12, borderRadius:'50%', background:'#ef4444' }} />
                <div style={{ width:12, height:12, borderRadius:'50%', background:'#f59e0b' }} />
                <div style={{ width:12, height:12, borderRadius:'50%', background:'#10b981' }} />
                <span style={{ marginLeft:12, fontFamily:'monospace', fontSize:12, fontWeight:700, color:'#4b5563' }}>cyberquest — threat-terminal</span>
              </div>
              <div style={{ padding:'24px', fontFamily:'monospace', fontSize:13, minHeight:300, display:'flex', flexDirection:'column', gap:10 }}>
                {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                    <span style={{ color:line.color, fontWeight:900, flexShrink:0 }}>{line.prefix}</span>
                    <span style={{ color: i===visibleLines-1 ? '#e2e8f0' : '#4b5563' }}>{line.text}</span>
                  </div>
                ))}
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ color:'#10b981', fontWeight:900 }}>$</span>
                  <span style={{ width:8, height:16, borderRadius:2, background:'#10b981', opacity:blink?1:0, transition:'opacity 0.1s' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:'96px' }}>
          {[
            { val:'6+', label:'Training Modules', color:'#6366f1' },
            { val:'AI', label:'Powered Analysis',  color:'#06b6d4' },
            { val:'∞', label:'Threat Scenarios',  color:'#10b981' },
            { val:'Live',label:'Gmail Extension',  color:'#f59e0b' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign:'center', padding:'32px 16px', borderRadius:16, border:`1px solid ${C.border}`, background: isDark ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.7)', backdropFilter:'blur(8px)', transition:'background 0.3s, border-color 0.3s' }}>
              <div style={{ color:s.color, fontWeight:900, fontSize:36, marginBottom:8 }}>{s.val}</div>
              <div style={{ color: C.textMuted, fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:'0.12em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── FEATURES ── */}
        <div style={{ marginBottom:'96px' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <p style={{ color:'#6366f1', fontWeight:900, fontSize:11, textTransform:'uppercase', letterSpacing:'0.25em', marginBottom:12, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              <Zap size={12} /> Operational Modules
            </p>
            <h2 style={{ color: C.textHero, fontWeight:900, letterSpacing:'-0.02em', fontSize:'clamp(1.8rem,3.5vw,2.8rem)', lineHeight:1.2, transition:'color 0.3s' }}>
              Everything you need to master<br />
              <span style={{ color: C.textBody }}>cybersecurity.</span>
            </h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
            {FEATURES.map((f, i) => (
              <div key={i}
                style={{ padding:'28px', borderRadius:20, border:`1px solid ${C.border}`, background: isDark ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.7)', backdropFilter:'blur(8px)', cursor:'default', transition:'all 0.25s' }}
                onMouseEnter={e=>{ e.currentTarget.style.border=`1px solid ${f.color}50`; e.currentTarget.style.background=`${f.color}0d`; e.currentTarget.style.transform='translateY(-4px)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.border=`1px solid ${C.border}`; e.currentTarget.style.background=isDark?'rgba(255,255,255,0.025)':'rgba(255,255,255,0.7)'; e.currentTarget.style.transform='translateY(0)'; }}>
                <div style={{ width:48, height:48, borderRadius:14, background:`${f.color}18`, border:`1px solid ${f.color}30`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
                  <f.icon size={22} color={f.color} />
                </div>
                <h3 style={{ color: C.textHero, fontWeight:900, fontSize:15, marginBottom:8 }}>{f.title}</h3>
                <p style={{ color: C.textBody, fontSize:13, lineHeight:1.65, margin:0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{ textAlign:'center', padding:'80px 24px', borderRadius:28, marginBottom:48, background:`linear-gradient(135deg,rgba(79,70,229,0.12) 0%,rgba(6,182,212,0.06) 100%)`, border:`1px solid rgba(99,102,241,0.2)`, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% 0%,rgba(99,102,241,0.18) 0%,transparent 60%)', pointerEvents:'none' }} />
          <h2 style={{ color: C.textHero, fontWeight:900, letterSpacing:'-0.02em', fontSize:'clamp(1.8rem,3.5vw,3rem)', marginBottom:16, position:'relative', transition:'color 0.3s' }}>
            Ready to become an{' '}
            <span style={{ background:'linear-gradient(90deg,#06b6d4,#6366f1)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Elite Operative?</span>
          </h2>
          <p style={{ color: C.textBody, fontSize:18, marginBottom:40, position:'relative', transition:'color 0.3s' }}>Join the CyberQuest network. Your mission starts now.</p>
          <button onClick={() => navigate('/auth')}
            style={{ color:'#0f172a', fontWeight:900, fontSize:16, padding:'16px 48px', borderRadius:16, border:'none', cursor:'pointer', background:'#f1f5f9', boxShadow:'0 0 40px rgba(255,255,255,0.1)', transition:'transform 0.2s,background 0.2s', position:'relative' }}
            onMouseEnter={e=>{ e.currentTarget.style.background='#ffffff'; e.currentTarget.style.transform='scale(1.04)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.background='#f1f5f9'; e.currentTarget.style.transform='scale(1)'; }}>
            Get Started — It's Free
          </button>
        </div>

        <p style={{ textAlign:'center', color: C.textDim, fontSize:11, fontFamily:'monospace', letterSpacing:'0.15em', textTransform:'uppercase', transition:'color 0.3s' }}>
          CyberQuest © 2026 — Hackathon Edition
        </p>
      </div>
    </div>
  );
};

export default Home;