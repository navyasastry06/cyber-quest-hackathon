import React, { useState, useEffect } from 'react';
import { Trophy, Zap, Target, ChevronRight, CheckCircle2, AlertTriangle, Code2, Shield, Eye, Search, Loader2 } from 'lucide-react';
import Lottie from 'lottie-react';
import API_BASE_URL from '../config';
import { useColors } from '../context/useColors';

// Import our new Lottie animations
import happyRobotAnim from '../assets/happy-robot.json';
import confettiAnim from '../assets/confetti.json';

const CHALLENGE_META = {
  'Threat Quiz':    { icon: Eye,    color: '#06b6d4', desc: 'Multiple-choice phishing and threat identification questions.' },
  'Code Auditor':   { icon: Code2,  color: '#a855f7', desc: 'Find the security flaw in vulnerable code snippets.' },
  'Log Detective':  { icon: Search, color: '#10b981', desc: 'Scan network logs to pinpoint malicious IP behaviour.' },
};

const QUESTIONS_PER_LEVEL = 5; 

const Challenges = () => {
  const c = useColors();
  
  // Arena State
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [challenges, setChallenges] = useState([]);
  
  // Level Progression State
  const [currentLevel, setCurrentLevel] = useState(1);
  const [questionsAnsweredInLevel, setQuestionsAnsweredInLevel] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  
  // Question State
  const [currentQ, setCurrentQ] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [sessionScore, setSessionScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/challenges/list`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setChallenges(Array.isArray(data) ? data : []))
      .catch(() => setChallenges([]));
  }, []);

  const fetchQuestion = async (type, levelArg = currentLevel, indexArg = questionsAnsweredInLevel) => {
    setIsLoading(true); setFeedback(null); setAnswered(false); setSelectedIdx(null);
    try {
      const token = localStorage.getItem('cyberquest_token');
      const res = await fetch(`${API_BASE_URL}/api/challenges/question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ type, level: levelArg, index: indexArg })
      });
      const data = await res.json();
      setCurrentQ(data);
    } catch { setCurrentQ(null); }
    finally { setIsLoading(false); }
  };

  const startChallenge = (type) => {
    setActiveChallenge(type); 
    setSessionScore(0); 
    setCurrentLevel(1);
    setQuestionsAnsweredInLevel(0);
    setLevelCompleted(false);
    fetchQuestion(type, 1, 0);
  };

  const submitAnswer = async (selected) => {
    if (answered) return;
    setAnswered(true); setSelectedIdx(selected);
    const token = localStorage.getItem('cyberquest_token');
    const savedUser = JSON.parse(localStorage.getItem('cyberquest_user'));
    const selectedText = currentQ?.options?.[selected];
    try {
      const res = await fetch(`${API_BASE_URL}/api/challenges/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ type: activeChallenge, level: currentLevel, index: questionsAnsweredInLevel, selectedAnswer: selectedText, userEmail: savedUser?.email })
      });
      const data = await res.json();
      setFeedback(data);
      if (data.correct) setSessionScore(s => s + (data.xpEarned || 100));
    } catch { setFeedback({ correct: false, explanation: 'Could not reach server.' }); }
  };

  const nextQuestionOrLevel = () => {
    const nextQCount = questionsAnsweredInLevel + 1;
    if (nextQCount >= QUESTIONS_PER_LEVEL) {
      setLevelCompleted(true);
    } else {
      setQuestionsAnsweredInLevel(nextQCount);
      fetchQuestion(activeChallenge, currentLevel, nextQCount);
    }
  };

  const startNextLevel = () => {
    setCurrentLevel(l => l + 1);
    setQuestionsAnsweredInLevel(0);
    setLevelCompleted(false);
    fetchQuestion(activeChallenge, currentLevel + 1, 0);
  };

  const TYPES = ['Threat Quiz', 'Code Auditor', 'Log Detective'];
  const cardStyle = { background: c.bgCard, border:`1px solid ${c.border}`, borderRadius:24, transition:'all 0.25s', boxShadow: c.isDark?'none':'0 2px 12px rgba(0,0,0,0.06)' };

  return (
    <div style={{ minHeight:'100%', background: c.bgPage, padding:'28px 32px', fontFamily:'inherit', transition:'background 0.25s' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28, flexWrap:'wrap', gap:16 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:6, color: c.cyan, marginBottom:6 }}>
              <Trophy size={14} /><span style={{ fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.25em' }}>Training Arena</span>
            </div>
            <h1 style={{ fontSize:'clamp(1.6rem,3vw,2.5rem)', fontWeight:900, textTransform:'uppercase', letterSpacing:'-0.02em', color: c.textPrimary, margin:0 }}>Challenges</h1>
          </div>
          {activeChallenge && (
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ background: c.bgCard, border:`1px solid ${c.border}`, borderRadius:14, padding:'10px 20px', display:'flex', alignItems:'center', gap:8 }}>
                <Zap size={16} color={c.yellow} />
                <span style={{ color: c.textPrimary, fontWeight:900, fontSize:15 }}>{sessionScore} XP</span>
              </div>
              <button onClick={() => { setActiveChallenge(null); setCurrentQ(null); setFeedback(null); setAnswered(false); setLevelCompleted(false); }}
                style={{ padding:'10px 18px', borderRadius:12, border:`1px solid ${c.border}`, background: c.bgCard, color: c.textSecondary, fontWeight:700, fontSize:12, cursor:'pointer' }}>
                ← Exit
              </button>
            </div>
          )}
        </div>

        {/* Challenge card grid */}
        {!activeChallenge && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:20 }}>
            {TYPES.map(type => {
              const meta = CHALLENGE_META[type];
              return (
                <div key={type} style={{ ...cardStyle, padding:'28px', cursor:'pointer', display:'flex', flexDirection:'column' }}
                  onMouseEnter={e => { e.currentTarget.style.border=`1px solid ${meta.color}50`; e.currentTarget.style.background=`${meta.color}06`; e.currentTarget.style.transform='translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.border=`1px solid ${c.border}`; e.currentTarget.style.background=c.bgCard; e.currentTarget.style.transform='translateY(0)'; }}>
                  <div style={{ width:52, height:52, borderRadius:16, background:`${meta.color}15`, border:`1px solid ${meta.color}30`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
                    <meta.icon size={26} color={meta.color} />
                  </div>
                  <h3 style={{ fontSize:18, fontWeight:900, color: c.textPrimary, margin:'0 0 8px' }}>{type}</h3>
                  <p style={{ fontSize:13, color: c.textSecondary, lineHeight:1.6, margin:'0 0 20px', flex:1 }}>{meta.desc}</p>
                  <button onClick={() => startChallenge(type)}
                    style={{ width:'100%', padding:'12px', borderRadius:14, border:`1px solid ${meta.color}50`, background:`${meta.color}12`, color: meta.color, fontWeight:900, fontSize:12, textTransform:'uppercase', letterSpacing:'0.12em', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6, transition:'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background=meta.color; e.currentTarget.style.color='#000'; }}
                    onMouseLeave={e => { e.currentTarget.style.background=`${meta.color}12`; e.currentTarget.style.color=meta.color; }}>
                    Initiate <ChevronRight size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Active challenge */}
        {activeChallenge && (
          <div style={{ ...cardStyle, position: 'relative', overflow: 'hidden' }}>
            
            {levelCompleted ? (
              /* --- LEVEL COMPLETE SCREEN --- */
              <div style={{ padding: '64px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                  <Lottie animationData={confettiAnim} loop={false} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ width: 160, height: 160, margin: '0 auto 16px' }}>
                    <Lottie animationData={happyRobotAnim} loop={true} />
                  </div>
                  
                  <h2 style={{ color: CHALLENGE_META[activeChallenge].color, fontWeight: 900, fontSize: 32, marginBottom: 8 }}>
                    LEVEL {currentLevel} CLEARED!
                  </h2>
                  <p style={{ color: c.textSecondary, fontSize: 16, marginBottom: 32 }}>
                    Perfect run. You earned <span style={{ color: c.yellow, fontWeight: 900 }}>{sessionScore} XP</span> total so far.
                  </p>
                  
                  <button onClick={startNextLevel}
                    style={{ padding:'16px 40px', borderRadius:16, border:'none', background:`linear-gradient(135deg,${c.indigo},${c.cyan})`, color:'white', fontWeight:900, fontSize:15, cursor:'pointer', boxShadow:'0 10px 30px rgba(99,102,241,0.4)', transition:'transform 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                    Start Level {currentLevel + 1}
                  </button>
                </div>
              </div>
            ) : (
              /* --- QUESTION SCREEN --- */
              <>
                {/* Progress bar */}
                <div style={{ height:3, background: c.bgElevated }}>
                  <div style={{ height:'100%', width:`${((questionsAnsweredInLevel) / QUESTIONS_PER_LEVEL) * 100}%`, background:`linear-gradient(90deg,${CHALLENGE_META[activeChallenge].color},${c.indigo})`, transition:'width 0.5s' }} />
                </div>

                <div style={{ padding:'28px 32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ padding: '4px 10px', borderRadius: 8, background: `${CHALLENGE_META[activeChallenge].color}20`, color: CHALLENGE_META[activeChallenge].color, fontSize: 11, fontWeight: 900, letterSpacing: '0.1em' }}>
                        LEVEL {currentLevel}
                      </span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: c.textMuted }}>
                      {questionsAnsweredInLevel} / {QUESTIONS_PER_LEVEL} Complete
                    </span>
                  </div>

                  {isLoading ? (
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 0' }}>
                      <Loader2 size={36} color={c.cyan} style={{ animation:'spin 1s linear infinite', marginBottom:14 }} />
                      <p style={{ color: c.textSecondary, fontFamily:'monospace', fontSize:13 }}>Generating question...</p>
                      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    </div>
                  ) : currentQ ? (
                    <>
                      {/* Question */}
                      <div style={{ background: c.bgElevated, border:`1px solid ${c.border}`, borderRadius:18, padding:'20px 24px', marginBottom:24 }}>
                        {activeChallenge === 'Code Auditor' ? (
                          <pre style={{ fontFamily:'monospace', fontSize:13, color: c.textPrimary, whiteSpace:'pre-wrap', wordBreak:'break-word', lineHeight:1.65, margin:0 }}>{currentQ.question}</pre>
                        ) : (
                          <p style={{ color: c.textPrimary, fontSize:15, lineHeight:1.65, margin:0, fontWeight:600 }}>{currentQ.question}</p>
                        )}
                      </div>

                      {/* Options */}
                      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
                        {(currentQ.options || []).map((opt, i) => {
                          const isSelected = selectedIdx === i;
                          const isCorrect = answered && feedback?.correctAnswer === opt;
                          const isWrong = answered && isSelected && !isCorrect;
                          return (
                            <button key={i} onClick={() => !answered && submitAnswer(i)}
                              style={{ padding:'13px 20px', borderRadius:14, border:`1px solid ${isCorrect ? '#10b981' : isWrong ? '#ef4444' : isSelected ? c.indigo : c.border}`, background: isCorrect ? 'rgba(16,185,129,0.12)' : isWrong ? 'rgba(239,68,68,0.12)' : isSelected ? `${c.indigo}12` : c.bgElevated, color: isCorrect ? '#10b981' : isWrong ? '#ef4444' : c.textPrimary, fontWeight:600, fontSize:14, cursor:answered?'default':'pointer', textAlign:'left', display:'flex', alignItems:'center', justifyContent:'space-between', transition:'all 0.15s' }}>
                              <span>{opt}</span>
                              {isCorrect && <CheckCircle2 size={18} color="#10b981" />}
                              {isWrong && <AlertTriangle size={18} color="#ef4444" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Feedback */}
                      {feedback && (
                        <div style={{ background: feedback.correct ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border:`1px solid ${feedback.correct?'rgba(16,185,129,0.35)':'rgba(239,68,68,0.35)'}`, borderRadius:16, padding:'16px 20px', marginBottom:20, display:'flex', alignItems:'flex-start', gap:12 }}>
                          {feedback.correct ? <CheckCircle2 size={18} color="#10b981" style={{ flexShrink:0, marginTop:2 }} /> : <AlertTriangle size={18} color="#ef4444" style={{ flexShrink:0, marginTop:2 }} />}
                          <div>
                            <p style={{ fontWeight:900, fontSize:14, color: feedback.correct ? '#10b981' : '#ef4444', margin:'0 0 4px' }}>
                              {feedback.correct ? `✔ Correct! +${feedback.xpEarned || 100} XP` : '✘ Incorrect'}
                            </p>
                            <p style={{ color: c.textSecondary, fontSize:13, lineHeight:1.6, margin:0 }}>{feedback.explanation}</p>
                          </div>
                        </div>
                      )}

                      {/* Next button (Question OR Level) */}
                      {answered && (
                        <button onClick={nextQuestionOrLevel}
                          style={{ padding:'12px 28px', borderRadius:14, border:'none', background:`linear-gradient(135deg,${c.indigo},${c.cyan})`, color:'white', fontWeight:900, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:8, boxShadow:'0 0 20px rgba(99,102,241,0.3)' }}>
                          {questionsAnsweredInLevel + 1 >= QUESTIONS_PER_LEVEL ? 'Complete Level' : 'Next Question'} <ChevronRight size={16} />
                        </button>
                      )}
                    </>
                  ) : (
                    <p style={{ color: c.textMuted, textAlign:'center', padding:'40px 0' }}>Could not load question. Check backend.</p>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Challenges;