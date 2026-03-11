import React, { useState, useEffect, useRef } from 'react';
import { useColors } from '../context/useColors';
import API_BASE_URL from '../config';
import { playCorrectSound, playWrongSound, playTimeUpSound } from '../utils/soundEffects';
import { Shield, UserX, UserCheck, Activity, EyeOff, HelpCircle, X } from 'lucide-react';

const EVENT_TYPES = [
  { type: 'SUCCESS', desc: 'Successful login from New York (IP: 192.168.1.5)', risk: 'Low' },
  { type: 'SUCCESS', desc: 'Successful login from Corporate VPN', risk: 'Low' },
  { type: 'FAILED', desc: 'Failed login attempt - Incorrect Password', risk: 'Medium' },
  { type: 'SUCCESS', desc: 'Password changed successfully', risk: 'Medium' },
  { type: 'ANOMALY', desc: 'Successful login from Russia (Impossible Travel - 5 mins since last NY login)', risk: 'High' },
  { type: 'ANOMALY', desc: '50 failed logins in 1 minute, followed by 1 Success', risk: 'High' },
  { type: 'ANOMALY', desc: 'Login from new Unrecognized Device without MFA', risk: 'High' }
];

const IdentityTimeline = () => {
  const c = useColors();
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [events, setEvents] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showShake, setShowShake] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const scrollRef = useRef(null);

  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  
  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft <= 0) {
      setTimeout(() => {
        setIsPlaying(false);
        playTimeUpSound();
        setShowShake(true);
        setTimeout(() => setShowShake(false), 600);
      }, 0);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  
  useEffect(() => {
    if (!isPlaying && timeLeft === 0 && score > 0 && !scoreSaved) {
      setTimeout(() => setScoreSaved(true), 0);
      
      const saveScore = async () => {
        const userStr = localStorage.getItem('cyberquest_user');
        const token = localStorage.getItem('cyberquest_token');
        if (!userStr || !token) return;

        try {
          const { email } = JSON.parse(userStr);
          await fetch(`${API_BASE_URL}/api/user/update-xp`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              email: email,
              xpGain: score,
              isChallenge: true
            })
          });
        } catch (err) {
          console.error('Failed to save gamification score:', err);
        }
      };
      
      saveScore();
    }
  }, [isPlaying, timeLeft, score, scoreSaved]);

  
  useEffect(() => {
    let spawner;
    let isActive = true;

    const spawnLog = () => {
      if (!isActive || !isPlaying) return;

      
      const isAnomaly = Math.random() > 0.85;
      let eventConfig;
      
      if (isAnomaly) {
          const anomalies = EVENT_TYPES.filter(e => e.type === 'ANOMALY');
          eventConfig = anomalies[Math.floor(Math.random() * anomalies.length)];
      } else {
          const normals = EVENT_TYPES.filter(e => e.type !== 'ANOMALY');
          eventConfig = normals[Math.floor(Math.random() * normals.length)];
      }

      const newEvent = {
          id: Date.now(),
          time: new Date().toLocaleTimeString(),
          ...eventConfig,
          handled: false
      };

      setEvents(prev => [...prev.slice(-20), newEvent]); 
      
      spawner = setTimeout(spawnLog, 1500 + Math.random() * 1000);
    };

    if (isPlaying) {
      spawner = setTimeout(spawnLog, 1500 + Math.random() * 1000);
    }

    return () => {
      isActive = false;
      clearTimeout(spawner);
    };
  }, [isPlaying]);


  const startGame = () => {
    setIsPlaying(true);
    setHasFinished(false);
    setScoreSaved(false);
    setScore(0);
    setTimeLeft(60);
    setEvents([]);
  };

  const handleLockAccount = () => {
    if (!isPlaying) return;

    
    
    
    let anomalyIndex = -1;
    for (let i = events.length - 1; i >= Math.max(0, events.length - 3); i--) {
        if (events[i].type === 'ANOMALY' && !events[i].handled) {
            anomalyIndex = i;
            break;
        }
    }

    if (anomalyIndex !== -1) {
        
        playCorrectSound();
        setScore(s => s + 20);
        
        
        setEvents(prev => {
           const next = [...prev];
           next[anomalyIndex] = { ...next[anomalyIndex], handled: true, locked: true };
           return next;
        });
    } else {
        
        playWrongSound();
        setScore(s => Math.max(0, s - 10));
        
        
        setEvents(prev => [...prev, {
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            type: 'SYSTEM',
            desc: 'FALSE POSITIVE: Locked a legitimate user account. Support ticket generated.',
            risk: 'System',
            handled: true
        }]);
    }
  };


  const getEventStyle = (type, handled) => {
      if (handled) return { color: '#10b981', bg: '#10b98115', border: '#10b981' };
      switch(type) {
          case 'SUCCESS': return { color: c.textSecondary, bg: c.bgHover, border: c.border };
          case 'FAILED': return { color: '#f59e0b', bg: '#f59e0b15', border: '#f59e0b40' };
          case 'ANOMALY': return { color: '#ef4444', bg: '#ef444415', border: '#ef4444' };
          case 'SYSTEM': return { color: c.indigo, bg: `${c.indigo}15`, border: c.indigo };
          default: return { color: c.textSecondary, bg: c.bgHover, border: c.border };
      }
  };

  return (
    <>
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
            20%, 40%, 60%, 80% { transform: translateX(8px); }
          }
          @keyframes popIn {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
      
      {!isPlaying && timeLeft === 0 && !hasFinished && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: c.cardBg, border: `1px solid ${c.border}`, borderRadius: 24,
            padding: '40px 32px', textAlign: 'center', maxWidth: 400, width: '100%',
            boxShadow: `0 20px 60px rgba(0,0,0,0.5)`, color: c.textPrimary,
            animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
          }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#ef4444', margin: '0 0 8px' }}>TIME'S UP!</h2>
            <p style={{ fontSize: 18, color: c.textSecondary, marginBottom: 32, fontWeight: 600 }}>
              Final Score: <span style={{ color: c.indigo, fontSize: 24, fontWeight: 900 }}>{score}</span> XP 
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                onClick={startGame}
                style={{
                  flex: 1, background: `linear-gradient(135deg, ${c.indigo}, #06b6d4)`, color: 'white', border: 'none', padding: '16px 20px', 
                  borderRadius: 14, fontWeight: 900, fontSize: 15, cursor: 'pointer',
                  boxShadow: `0 8px 25px ${c.indigo}50`, transition: 'transform 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                PLAY AGAIN
              </button>
              <button 
                onClick={() => setHasFinished(true)}
                style={{
                  flex: 1, background: 'transparent', color: c.textSecondary, border: `2px solid ${c.border}`, padding: '16px 20px', 
                  borderRadius: 14, fontWeight: 900, fontSize: 15, cursor: 'pointer', transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = c.bgHover; e.currentTarget.style.color = c.textPrimary; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = c.textSecondary; }}
              >
                FINISH
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: '24px 32px', maxWidth: 1000, margin: '0 auto', color: c.textPrimary, animation: showShake ? 'shake 0.5s ease-in-out' : 'none' }}>
        
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
              <h1 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Activity color={c.indigo} size={32} />
              Identity Timeline Analytics
              </h1>
              <p style={{ color: c.textSecondary, margin: 0, maxWidth: 600 }}>
              Monitor the live Active Directory identity feed. If you spot Business Email Compromise (BEC) indicators like Impossible Travel, lock the account immediately!
              </p>
          </div>
          
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <button onClick={() => setShowHelp(true)} style={{ background: c.cardBg, border:`1px solid ${c.border}`, borderRadius:14, padding:'10px', display:'flex', alignItems:'center', justifyContent:'center', color: c.textSecondary, cursor:'pointer', transition:'all 0.2s', height: 48, width: 48 }} onMouseEnter={e => e.currentTarget.style.color = c.cyan} onMouseLeave={e => e.currentTarget.style.color = c.textSecondary}>
              <HelpCircle size={22} />
            </button>
            <div style={{ background: c.cardBg, border: `1px solid ${c.border}`, padding: '0 24px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 24, height: 48 }}>
                <div>
                    <p style={{ margin: 0, fontSize: 10, fontWeight: 900, color: c.textMuted, textTransform: 'uppercase', lineHeight: 1 }}>Time</p>
                    <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: c.textPrimary, lineHeight: 1 }}>{timeLeft}s</p>
                </div>
                <div>
                    <p style={{ margin: 0, fontSize: 10, fontWeight: 900, color: c.textMuted, textTransform: 'uppercase', lineHeight: 1 }}>Score</p>
                    <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: c.indigo, lineHeight: 1 }}>{score}</p>
                </div>
            </div>
          </div>
        </div>

      {}
      {showHelp && (
        <div style={{ position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:60, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)' }}>
          <div style={{ background: c.cardBg, border:`1px solid ${c.border}`, borderRadius:20, padding:'32px', maxWidth:500, width:'100%', position:'relative', boxShadow:'0 10px 40px rgba(0,0,0,0.2)' }}>
            <button onClick={() => setShowHelp(false)} style={{ position:'absolute', top:20, right:20, background:'transparent', border:'none', color: c.textSecondary, cursor:'pointer' }}>
              <X size={24} />
            </button>
            <h2 style={{ fontSize:24, fontWeight:900, color: c.textPrimary, marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
              <HelpCircle color={c.cyan} size={28} /> How to Play
            </h2>
            <div style={{ color: c.textSecondary, fontSize:15, lineHeight:1.7, display:'flex', flexDirection:'column', gap:12 }}>
              <p>Welcome to <strong>Identity Timeline Analytics</strong>! Your objective is to act as an Incident Responder and monitor live Active Directory logs.</p>
              <ul style={{ paddingLeft:20, margin:0, display:'flex', flexDirection:'column', gap:8 }}>
                <li>Watch the activity feed scroll by on the left.</li>
                <li>Most logins will be <span style={{color: '#10b981', fontWeight:700}}>SUCCESS</span> or normal <span style={{color: '#f59e0b', fontWeight:700}}>FAILED</span> attempts.</li>
                <li>If you spot an <span style={{color: '#ef4444', fontWeight:900}}>ANOMALY</span> (like Impossible Travel or 50 failed logins followed by a success), you must hit the big red <strong>LOCK ACCOUNT</strong> button immediately!</li>
                <li>Locking an anomaly earns XP. Locking a normal login will dock you points for a false positive!</li>
              </ul>
            </div>
            <button onClick={() => setShowHelp(false)} style={{ width:'100%', marginTop:24, padding:'12px', background: c.indigo, color:'white', borderRadius:12, border:'none', fontWeight:900, cursor:'pointer' }}>
              Understood!
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, height: 500 }}>
        
        {}
        <div 
            ref={scrollRef}
            style={{ 
                background: c.cardBg, border: `1px solid ${c.border}`, borderRadius: 16, padding: 24,
                overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12
            }}
        >
            {events.length === 0 ? (
                <div style={{ margin: 'auto', textAlign: 'center', color: c.textMuted }}>
                    <EyeOff size={48} style={{ opacity: 0.2, marginBottom: 12 }} />
                    <p style={{ fontWeight: 600 }}>Waiting for identity logs...</p>
                </div>
            ) : null}

            {events.map((ev) => {
                const style = getEventStyle(ev.type, ev.locked);
                return (
                    <div key={ev.id} style={{
                        padding: 16, borderRadius: 12, border: `1px solid ${style.border}`,
                        background: style.bg, display: 'flex', gap: 16, alignItems: 'flex-start',
                        transition: 'all 0.3s'
                    }}>
                        <div style={{ width: 60, flexShrink: 0, fontSize: 12, fontWeight: 700, color: c.textMuted, paddingTop: 2 }}>
                            {ev.time}
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: style.color }}>
                                {ev.desc}
                            </p>
                            <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: style.color, opacity: 0.8 }}>
                                RISK: {ev.risk} {ev.locked ? ' | MITIGATED' : ''}
                            </span>
                        </div>
                        {ev.locked && <UserCheck color="#10b981" size={20} />}
                    </div>
                );
            })}
        </div>

        {/* Right: Controls & Rules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: c.cardBg, border: `1px solid ${c.border}`, padding: 20, borderRadius: 16, flex: 1 }}>
                <h3 style={{ margin: '0 0 16px', color: c.textPrimary, fontSize: 14, fontWeight: 900, textTransform: 'uppercase' }}>Rules of Engagement</h3>
                <ul style={{ paddingLeft: 16, color: c.textSecondary, fontSize: 13, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <li>Monitor the log feed carefully.</li>
                    <li>Wait for <strong style={{color: '#ef4444'}}>High Risk Anomalies</strong>.</li>
                    <li>Press Lock Account to neutralize the threat.</li>
                    <li>Do not lock normal or failed logins.</li>
                </ul>
            </div>

            {!isPlaying ? (
                <button 
                    onClick={startGame}
                    style={{
                    background: c.bgHover, color: c.textPrimary, border: `1px solid ${c.border}`, padding: '16px', borderRadius: 12, 
                    fontWeight: 900, fontSize: 16, cursor: 'pointer'
                    }}>
                    {timeLeft === 0 ? 'PLAY AGAIN' : 'START MONITORING'}
                </button>
            ) : (
                <button
                    onClick={handleLockAccount}
                    style={{
                        background: '#ef4444', color: 'white', border: 'none', padding: '24px 16px', borderRadius: 12,
                        fontWeight: 900, fontSize: 20, cursor: 'pointer', boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
                    }}
                >
                    <UserX size={32} />
                    LOCK ACCOUNT
                </button>
            )}
        </div>

      </div>
    </div>
    </>
  );
};

export default IdentityTimeline;
