import React, { useState } from 'react';
import { Search, ShieldCheck, AlertTriangle, Terminal, Zap } from 'lucide-react';
import Lottie from 'lottie-react';
import sadBotAnim from '../assets/sadbot.json';
import API_BASE_URL from '../config';
import { useColors } from '../context/useColors';

const VaultIdScanner = () => {
  const c = useColors();
  const [targetEmail, setTargetEmail] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!targetEmail.trim()) return;
    setIsScanning(true); setScanResult(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/vaultid/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderEmail: targetEmail })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Scan failed.');
      setScanResult(data);
    } catch (err) {
      setScanResult({ error: err.message.includes('fetch') ? `Cannot reach backend at ${API_BASE_URL}. Start with: npm start` : err.message });
    } finally { setIsScanning(false); }
  };


  const isThreat = scanResult && !scanResult.error && scanResult.trustScore < 50;

  return (
    <div style={{ minHeight:'100%', background: c.bgPage, padding:'32px 36px', fontFamily:'inherit', transition:'background 0.25s' }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, color: c.cyan, marginBottom: 8 }}>
            <Terminal size={14} />
            <span style={{ fontSize:11, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.25em' }}>Threat Intelligence</span>
          </div>
          <h1 style={{ fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:900, textTransform:'uppercase', letterSpacing:'-0.02em', color: c.textPrimary, margin:'0 0 6px' }}>VaultID Scanner</h1>
          <p style={{ color: c.textSecondary, margin:0 }}>AI-powered email reputation analysis. Know who is behind every message.</p>
        </div>

        {/* Scan form */}
        <form onSubmit={handleScan} style={{ marginBottom: 28 }}>
          <div style={{ display:'flex', gap:12 }}>
            <div style={{ flex:1, position:'relative' }}>
              <div style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color: c.textMuted }}><Search size={17} /></div>
              <input type="email" value={targetEmail} onChange={e => setTargetEmail(e.target.value)}
                placeholder="Enter sender email to analyse..."
                style={{ width:'100%', background: c.bgInput, border:`1px solid ${c.border}`, color: c.textPrimary, borderRadius:14, padding:'14px 16px 14px 44px', fontSize:14, outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'border 0.2s' }}
                onFocus={e => e.target.style.borderColor=c.cyan} onBlur={e => e.target.style.borderColor=c.border} />
            </div>
            <button type="submit" disabled={isScanning || !targetEmail.trim()}
              style={{ padding:'14px 28px', borderRadius:14, border:'none', background:`linear-gradient(135deg,${c.indigo},${c.cyan})`, color:'white', fontWeight:900, fontSize:13, textTransform:'uppercase', letterSpacing:'0.1em', cursor:isScanning||!targetEmail.trim()?'not-allowed':'pointer', opacity:isScanning||!targetEmail.trim()?0.6:1, display:'flex', alignItems:'center', gap:8, flexShrink:0, boxShadow:'0 0 20px rgba(99,102,241,0.3)', transition:'all 0.2s' }}>
              <Zap size={16} /> {isScanning ? 'Scanning...' : 'Scan'}
            </button>
          </div>
        </form>

        {/* Scanning animation */}
        {isScanning && (
          <div style={{ background: c.bgCard, border:`1px solid ${c.border}`, borderRadius:20, padding:40, textAlign:'center' }}>
            <div style={{ width:60, height:60, borderRadius:'50%', border:`3px solid ${c.cyan}`, borderTopColor:'transparent', margin:'0 auto 20px', animation:'spin 0.8s linear infinite' }} />
            <p style={{ color: c.textSecondary, fontFamily:'monospace', fontSize:14 }}>Analysing email reputation...</p>
          </div>
        )}

        {/* Result */}
        {scanResult && !isScanning && (
          scanResult.error ? (
            <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:20, padding:28, display:'flex', alignItems:'flex-start', gap:14 }}>
              <AlertTriangle size={22} color="#ef4444" style={{ flexShrink:0, marginTop:2 }} />
              <div>
                <p style={{ color:'#ef4444', fontWeight:900, fontSize:14, margin:'0 0 4px' }}>Scan Failed</p>
                <p style={{ color:'#f87171', fontSize:13, margin:0 }}>{scanResult.error}</p>
              </div>
            </div>
          ) : (
            <div style={{ background: c.bgCard, border:`1px solid ${isThreat ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)'}`, borderRadius:20, overflow:'hidden', boxShadow: c.isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
              {/* Result header */}
              <div style={{ padding:'20px 28px', background: isThreat ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)', display:'flex', alignItems:'center', gap:14, borderBottom:`1px solid ${c.border}` }}>
                <div style={{ width:48, height:48, borderRadius:'50%', background: isThreat ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)', border:`2px solid ${isThreat?'#ef4444':'#10b981'}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {isThreat ? <AlertTriangle size={24} color="#ef4444" /> : <ShieldCheck size={24} color="#10b981" />}
                </div>
                <div>
                  <p style={{ fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color: c.textMuted, margin:0 }}>VaultID Verdict • Score: {scanResult.trustScore ?? 'N/A'}/100</p>
                  <h2 style={{ fontSize:22, fontWeight:900, color: isThreat ? '#ef4444' : '#10b981', margin:0 }}>
                    {isThreat ? '⚠ PHISHING DETECTED' : '✓ SENDER VERIFIED'}
                  </h2>
                </div>
              </div>
              {/* Analysis */}
              <div style={{ padding:'20px 28px', display:'flex', gap:24, flexWrap:'wrap' }}>
                <div style={{ flex:1, minWidth:250 }}>
                  <p style={{ fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color: c.textMuted, marginBottom:8 }}>AI Analysis</p>
                  <p style={{ color: c.textPrimary, fontSize:14, lineHeight:1.7, margin:0 }}>{scanResult.analysis}</p>
                </div>
                
                {/* Lottie Error Animation Integration */}
                {isThreat && (
                  <div style={{ width:120, height:120, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', opacity:0.9 }}>
                    <Lottie animationData={sadBotAnim} loop={true} />
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {/* Placeholder */}
        {!scanResult && !isScanning && (
          <div style={{ background: c.bgCard, border:`2px dashed ${c.border}`, borderRadius:20, padding:'48px 32px', textAlign:'center' }}>
            <Search size={36} color={c.textMuted} style={{ marginBottom:14 }} />
            <p style={{ color: c.textSecondary, fontSize:14, margin:'0 0 6px', fontWeight:600 }}>Enter a sender email above to analyse it</p>
            <p style={{ color: c.textMuted, fontSize:12, margin:0 }}>The AI will check reputation, sender patterns, and phishing indicators.</p>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default VaultIdScanner;