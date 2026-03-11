import React, { useState } from 'react';
import { Search, Globe, Key, Hash, Copy, CheckCircle2 } from 'lucide-react';
import { useColors } from '../context/useColors';

const Tools = () => {
  const c = useColors();
  const [ipAddress, setIpAddress] = useState('');
  const [ipData, setIpData] = useState(null);
  const [isIpLoading, setIsIpLoading] = useState(false);
  const [ipError, setIpError] = useState('');
  const [password, setPassword] = useState('');
  const [hashInput, setHashInput] = useState('');
  const [hashResult, setHashResult] = useState('');
  const [hashMode, setHashMode] = useState('SHA-256');
  const [copied, setCopied] = useState(false);

  const handleIpScan = async (e) => {
    e.preventDefault();
    if (!ipAddress.trim()) return;
    setIsIpLoading(true); setIpError(''); setIpData(null);
    try {
      const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
      const data = await response.json();
      if (data.error) setIpError(data.reason || 'Invalid IP Address');
      else setIpData(data);
    } catch { setIpError('CONNECTION_INTERRUPTED'); }
    finally { setIsIpLoading(false); }
  };

  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'VOID', color: '#334155', textColor: '#64748b' };
    let score = 0;
    if (pwd.length > 8) score++;
    if (pwd.length > 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 2) return { score: 25, label: 'CRITICAL',    color: '#ef4444', textColor: '#ef4444' };
    if (score === 3) return { score: 50, label: 'VULNERABLE',  color: '#f59e0b', textColor: '#f59e0b' };
    if (score === 4) return { score: 75, label: 'SECURE',      color: '#6366f1', textColor: '#818cf8' };
    return            { score: 100, label: 'ENCRYPTED',  color: '#10b981', textColor: '#10b981' };
  };
  const strength = calculateStrength(password);

  const processHash = async () => {
    if (!hashInput) return;
    try {
      if (hashMode === 'BASE64 ENCODE') setHashResult(btoa(hashInput));
      else if (hashMode === 'BASE64 DECODE') {
        try { setHashResult(atob(hashInput)); } 
        catch { setHashResult('EXECUTION_FAILURE: INVALID BASE64 SEQUENCE'); }
      }
      else {
        const msgBuffer = new TextEncoder().encode(hashInput);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        setHashResult(Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2,'0')).join(''));
      }
    } catch { setHashResult('EXECUTION_FAILURE'); }
  };

  const cardStyle = { background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 24, padding: '28px', boxShadow: c.isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)', transition: 'background 0.25s' };
  const inputStyle = { width: '100%', background: c.bgInput, border: `1px solid ${c.border}`, color: c.textPrimary, borderRadius: 12, padding: '11px 16px', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border 0.2s' };
  const iconAccent = (color) => ({ width: 44, height: 44, background: `${color}12`, border: `1px solid ${color}25`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' });

  return (
    <div style={{ minHeight: '100%', background: c.bgPage, padding: '32px 36px', color: c.textPrimary, fontFamily: 'inherit', transition: 'background 0.25s' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {}
        <div style={{ marginBottom: 36, borderBottom: `1px solid ${c.border}`, paddingBottom: 24 }}>
          <p style={{ color: c.cyan, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: 6, display:'flex', gap:6, alignItems:'center' }}>
            <Search size={13} /> Field Equipment
          </p>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', color: c.textPrimary, margin: 0 }}>Threat Arsenal</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

          {}
          <div style={cardStyle}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 24 }}>
              <div style={iconAccent('#6366f1')}><Globe size={22} color="#6366f1" /></div>
              <div>
                <h2 style={{ color: c.textPrimary, fontWeight: 900, fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Origin Trace</h2>
                <p style={{ color: c.textMuted, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>Geospatial Reconnaissance</p>
              </div>
            </div>
            <form onSubmit={handleIpScan} style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <input type="text" value={ipAddress} onChange={e => setIpAddress(e.target.value)} placeholder="TARGET_IP_ADDRESS..."
                style={{ ...inputStyle, flex: 1 }}
                onFocus={e => e.target.style.borderColor='#6366f1'} onBlur={e => e.target.style.borderColor=c.border} />
              <button type="submit" style={{ padding: '11px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 12, fontWeight: 900, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}>Execute</button>
            </form>
            <div style={{ minHeight: 100, background: c.bgElevated, border: `1px solid ${c.border}`, borderRadius: 14, padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {isIpLoading ? <p style={{ color: c.textMuted, fontFamily: 'monospace', fontSize: 12, textAlign: 'center', margin: 0 }}>SCANNING...</p>
                : ipError ? <p style={{ color: '#ef4444', fontFamily: 'monospace', fontSize: 12, margin: 0 }}>{ipError}</p>
                : ipData ? (
                  <div style={{ fontFamily: 'monospace', fontSize: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: c.textMuted, fontWeight: 900 }}>LOCATION:</span><span style={{ color: '#818cf8', fontWeight: 700 }}>{ipData.city}, {ipData.country_name}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: c.textMuted, fontWeight: 900 }}>ISP NODE:</span><span style={{ color: '#818cf8', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '60%' }}>{ipData.org}</span></div>
                  </div>
                ) : <p style={{ color: c.textMuted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.3em', textAlign: 'center', margin: 0 }}>Awaiting Signal Lock...</p>}
            </div>
          </div>

          {}
          <div style={cardStyle}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 24 }}>
              <div style={iconAccent('#f59e0b')}><Key size={22} color="#f59e0b" /></div>
              <div>
                <h2 style={{ color: c.textPrimary, fontWeight: 900, fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Entropy Probe</h2>
                <p style={{ color: c.textMuted, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>Brute Force Resistance</p>
              </div>
            </div>
            <input type="text" value={password} onChange={e => setPassword(e.target.value)} placeholder="INPUT_KEY_SEQUENCE..."
              style={{ ...inputStyle, marginBottom: 20 }}
              onFocus={e => e.target.style.borderColor='#f59e0b'} onBlur={e => e.target.style.borderColor=c.border} />
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 900, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Integrity Rating</span>
                <span style={{ fontSize: 12, fontWeight: 900, color: strength.textColor }}>{strength.label}</span>
              </div>
              <div style={{ height: 6, background: c.bgElevated, borderRadius: 999, overflow: 'hidden', border: `1px solid ${c.border}` }}>
                <div style={{ height: '100%', width: `${strength.score}%`, background: strength.color, borderRadius: 999, transition: 'width 0.7s ease, background 0.4s' }} />
              </div>
            </div>
          </div>
        </div>

        {}
        <div style={{ ...cardStyle, padding: 32 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 28 }}>
            <div style={iconAccent('#6366f1')}><Hash size={22} color="#6366f1" /></div>
            <div>
              <h2 style={{ color: c.textPrimary, fontWeight: 900, fontSize: 18, textTransform: 'uppercase', letterSpacing: '-0.01em', margin: 0 }}>Cryptographic Forge</h2>
              <p style={{ color: c.textMuted, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>Data Morphing & Encryption Engine</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <textarea value={hashInput} onChange={e => setHashInput(e.target.value)} placeholder="ENTER RAW DATA PAYLOAD..."
                style={{ ...inputStyle, height: 160, resize: 'none', padding: '14px', fontFamily: 'monospace', marginBottom: 16 }}
                onFocus={e => e.target.style.borderColor='#6366f1'} onBlur={e => e.target.style.borderColor=c.border} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['SHA-256', 'BASE64 ENCODE', 'BASE64 DECODE'].map(mode => (
                  <button key={mode} onClick={() => setHashMode(mode)}
                    style={{ padding: '8px 14px', borderRadius: 10, fontSize: 10, fontWeight: 900, letterSpacing: '0.1em', border: `1px solid ${hashMode===mode ? '#6366f1' : c.border}`, background: hashMode===mode ? 'rgba(99,102,241,0.2)' : 'transparent', color: hashMode===mode ? '#818cf8' : c.textMuted, cursor: 'pointer', transition: 'all 0.15s' }}>
                    {mode}
                  </button>
                ))}
                <button onClick={processHash} style={{ marginLeft: 'auto', padding: '8px 20px', borderRadius: 10, fontSize: 11, fontWeight: 900, border: 'none', background: c.textPrimary, color: c.bgPage, cursor: 'pointer', transition: 'opacity 0.2s' }}>
                  Generate
                </button>
              </div>
            </div>

            <div style={{ background: c.bgElevated, border: `1px solid ${c.border}`, borderRadius: 16, padding: 18, display: 'flex', flexDirection: 'column', position: 'relative', minHeight: 200 }}>
              <p style={{ fontSize: 9, fontWeight: 900, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${c.border}`, margin: '0 0 12px' }}>
                Output 
              </p>
              <p style={{ fontFamily: 'monospace', fontSize: 13, color: '#10b981', wordBreak: 'break-all', lineHeight: 1.6, flex: 1 }}>
                {hashResult || <span style={{ color: c.textMuted }}>_WAITING_FOR_SEQUENCE_...</span>}
              </p>
              {hashResult && (
                <button onClick={() => { navigator.clipboard.writeText(hashResult); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  style={{ position: 'absolute', top: 14, right: 14, padding: 6, background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 8, cursor: 'pointer', color: copied ? '#10b981' : c.textMuted }}>
                  {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;