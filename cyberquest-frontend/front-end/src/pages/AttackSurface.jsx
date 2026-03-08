import React, { useState, useEffect } from 'react';
import { useColors } from '../context/useColors';
import API_BASE_URL from '../config';
import { playCorrectSound, playWrongSound, playTimeUpSound } from '../utils/soundEffects';
import { Shield, Server, AlertTriangle, CheckCircle } from 'lucide-react';

const VULNERABILITIES = [
  { id: 'port_open', label: 'Open Port 22 Detected', fix: 'Close Port' },
  { id: 'unpatched', label: 'Critical OS Patch Missing', fix: 'Apply Patch' },
  { id: 'no_mfa', label: 'Admin Login without MFA', fix: 'Enforce MFA' },
  { id: 's3_public', label: 'Public S3 Bucket Exposed', fix: 'Make Private' },
];

const ACTIONS = ['Close Port', 'Apply Patch', 'Enforce MFA', 'Make Private', 'Ignore'];

const AttackSurface = () => {
  const c = useColors();
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [networkHealth, setNetworkHealth] = useState(100);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showShake, setShowShake] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  
  // Array of 9 servers
  const [servers, setServers] = useState(Array(9).fill({ isVulnerable: false, vulnType: null, timer: 0 }));
  const [selectedServer, setSelectedServer] = useState(null);

  // Main game loop for ticking time
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

  // Save score to backend when game finishes
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

  // Main game loop for spawning vulnerabilities
  useEffect(() => {
    let spawner;
    if (isPlaying) {
      spawner = setInterval(() => {
        setServers(prev => {
          const newServers = [...prev];
          
          // Count active vulnerabilities
          const activeCount = newServers.filter(s => s.isVulnerable).length;
          
          // Spawn new vulnerability if less than 3 active
          if (activeCount < 3 && Math.random() > 0.4) {
            const availableIndexes = newServers.map((s, i) => s.isVulnerable ? -1 : i).filter(i => i !== -1);
            if (availableIndexes.length > 0) {
              const spawnIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
              const randomVuln = VULNERABILITIES[Math.floor(Math.random() * VULNERABILITIES.length)];
              
              newServers[spawnIndex] = {
                isVulnerable: true,
                vulnType: randomVuln,
                spawnTime: Date.now()
              };
            }
          }
          
          // Penalize for unhandled vulnerabilities (alive for > 5 seconds)
          let penalty = 0;
          const currentTime = Date.now();
          for (let i = 0; i < newServers.length; i++) {
             if (newServers[i].isVulnerable && (currentTime - newServers[i].spawnTime > 5000)) {
                 // Remove it and penalize
                 newServers[i] = { isVulnerable: false, vulnType: null };
                 penalty += 5;
             }
          }
          if (penalty > 0) {
              setNetworkHealth(h => Math.max(0, h - penalty));
          }

          return newServers;
        });
      }, 1000);
    }
    return () => clearInterval(spawner);
  }, [isPlaying]);


  const startGame = () => {
    setIsPlaying(true);
    setHasFinished(false);
    setScoreSaved(false);
    setScore(0);
    setNetworkHealth(100);
    setTimeLeft(60);
    setServers(Array(9).fill({ isVulnerable: false, vulnType: null }));
    setSelectedServer(null);
  };

  const handleServerClick = (index) => {
    if (!isPlaying) return;
    if (servers[index].isVulnerable) {
      setSelectedServer(index);
    } else {
      setSelectedServer(null);
    }
  };

  const handleActionClick = (action) => {
    if (selectedServer === null) return;
    
    const server = servers[selectedServer];
    
    if (server.vulnType.fix === action) {
      // Correct action
      playCorrectSound();
      setScore(s => s + 10);
      setNetworkHealth(h => Math.min(100, h + 2));
      
      // Heal server
      setServers(prev => {
        const next = [...prev];
        next[selectedServer] = { isVulnerable: false, vulnType: null };
        return next;
      });
      setSelectedServer(null);
    } else {
      // Wrong action
      playWrongSound();
      setScore(s => Math.max(0, s - 5));
      setNetworkHealth(h => Math.max(0, h - 5));
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
              <br/>
              Health: <span style={{ color: networkHealth > 50 ? '#10b981' : '#ef4444', fontWeight: 900 }}>{networkHealth}%</span>
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
        <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Shield color={c.indigo} size={32} />
          Attack Surface Management
        </h1>
        <p style={{ color: c.textSecondary, margin: 0 }}>
          Identify exposures in your network and apply the correct mitigation before attackers exploit them. (Based on CrowdStrike CTEM)
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 24 }}>
        
        {/* Left Panel: Status & Controls */}
        <div style={{ background: c.cardBg, border: `1px solid ${c.border}`, borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: 42, margin: 0, color: c.indigo, fontWeight: 900 }}>{timeLeft}s</h2>
            <p style={{ color: c.textMuted, margin: 0, textTransform: 'uppercase', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em' }}>Time Remaining</p>
          </div>

          <div style={{ background: `${c.bgHover}`, padding: 16, borderRadius: 12, border: `1px solid ${c.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: c.textSecondary, fontWeight: 600 }}>Score</span>
              <span style={{ color: c.indigo, fontWeight: 900, fontSize: 18 }}>{score}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: c.textSecondary, fontWeight: 600 }}>Network Health</span>
              <span style={{ color: networkHealth > 50 ? '#10b981' : '#ef4444', fontWeight: 900 }}>{networkHealth}%</span>
            </div>
            <div style={{ width: '100%', height: 8, background: c.border, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${networkHealth}%`, height: '100%', background: networkHealth > 50 ? '#10b981' : '#ef4444', transition: 'width 0.3s' }} />
            </div>
          </div>

          {!isPlaying ? (
             <button 
                onClick={startGame}
                style={{
                  background: c.indigo, color: 'white', border: 'none', padding: '14px', borderRadius: 12, 
                  fontWeight: 900, fontSize: 16, cursor: 'pointer', boxShadow: `0 4px 15px ${c.indigo}50`,
                  marginTop: 'auto'
                }}>
                {timeLeft === 0 ? 'PLAY AGAIN' : 'START SIMULATION'}
             </button>
          ) : (
             <div style={{ marginTop: 'auto', textAlign: 'center', color: c.textMuted, fontSize: 12, fontWeight: 600 }}>
                 Simulation Active...
             </div>
          )}
        </div>

        {/* Right Panel: Grid & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* The Network Grid */}
            <div style={{ 
                background: c.cardBg, border: `1px solid ${c.border}`, borderRadius: 16, padding: 32,
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, flex: 1
            }}>
                {servers.map((server, i) => (
                    <div 
                        key={i} 
                        onClick={() => handleServerClick(i)}
                        style={{
                            aspectRatio: '1', borderRadius: 16, border: `2px solid ${server.isVulnerable ? '#ef4444' : c.border}`,
                            background: server.isVulnerable ? '#ef444415' : c.bgHover,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
                            cursor: (isPlaying && server.isVulnerable) ? 'pointer' : 'default',
                            boxShadow: server.isVulnerable ? '0 0 20px rgba(239, 68, 68, 0.2)' : 'none',
                            transition: 'all 0.2s',
                            transform: selectedServer === i ? 'scale(0.95)' : 'scale(1)'
                        }}
                    >
                        <Server size={48} color={server.isVulnerable ? '#ef4444' : c.textSecondary} />
                        <span style={{ color: server.isVulnerable ? '#ef4444' : c.textMuted, fontWeight: 700, fontSize: 14 }}>
                            NODE {i+1}
                        </span>
                        {server.isVulnerable && (
                             <AlertTriangle size={24} color="#ef4444" style={{ position: 'absolute', top: 10, right: 10 }} />
                        )}
                    </div>
                ))}
            </div>

            {/* Action Panel (Shows when a vulnerable server is clicked) */}
            <div style={{ 
                background: c.cardBg, border: `1px solid ${c.border}`, borderRadius: 16, padding: 24,
                minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                {selectedServer !== null ? (
                    <div style={{ width: '100%' }}>
                        <p style={{ color: '#ef4444', fontWeight: 900, fontSize: 16, margin: '0 0 16px', textAlign: 'center' }}>
                            THREAT: {servers[selectedServer]?.vulnType?.label}
                        </p>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                            {ACTIONS.map(action => (
                                <button
                                    key={action}
                                    onClick={() => handleActionClick(action)}
                                    style={{
                                        background: c.bgHover, border: `1px solid ${c.indigo}40`, color: c.textPrimary,
                                        padding: '10px 20px', borderRadius: 8, fontWeight: 600, cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={e => e.target.style.background = `${c.indigo}20`}
                                    onMouseLeave={e => e.target.style.background = c.bgHover}
                                >
                                    {action}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p style={{ color: c.textMuted, fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CheckCircle size={20} color="#10b981" />
                        Select a vulnerable node to apply mitigations.
                    </p>
                )}
            </div>

        </div>

      </div>
    </div>
    </>
  );
};

export default AttackSurface;
