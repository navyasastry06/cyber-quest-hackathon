import React, { useState } from 'react';
import emailsData from '../data/emails.json';
import { AlertTriangle, CheckCircle, Mail, Terminal, Shield, HelpCircle, X } from 'lucide-react';
import Lottie from 'lottie-react';
import API_BASE_URL from '../config';
import { useColors } from '../context/useColors';

import happyRobotAnim from '../assets/happy-robot.json';
import sadbotAnim from '../assets/sadbot.json';

const LEVELS = ['Easy', 'Medium', 'Hard'];

const Simulator = () => {
  const c = useColors();
  
  const [currentDifficulty, setCurrentDifficulty] = useState('Easy');
  const currentLevelEmails = emailsData.filter(e => {
    if (currentDifficulty === 'Hard') return e.difficulty === 'Hard' || e.difficulty === 'Very Hard';
    return e.difficulty === currentDifficulty;
  });

  const [selectedEmail, setSelectedEmail] = useState(currentLevelEmails[0] || emailsData[0]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [completedEmails, setCompletedEmails] = useState(new Set());
  const [showHelp, setShowHelp] = useState(false);

  const changeDifficulty = (diff) => {
    setCurrentDifficulty(diff);
    const nextLevelEmails = emailsData.filter(e => {
      if (diff === 'Hard') return e.difficulty === 'Hard' || e.difficulty === 'Very Hard';
      return e.difficulty === diff;
    });
    setSelectedEmail(nextLevelEmails[0] || emailsData[0]);
  };

  const handleDecision = async (decision) => {
    if (completedEmails.has(selectedEmail.id)) return;

    const isCorrect = (decision === 'report' && selectedEmail.isPhishing) || (decision === 'safe' && !selectedEmail.isPhishing);
    
    let basePoints = isCorrect ? 50 : -20;
    if (currentDifficulty === 'Medium') basePoints = isCorrect ? 100 : -50;
    if (currentDifficulty === 'Hard') basePoints = isCorrect ? 150 : -80;
    const points = basePoints;

    const savedUser = JSON.parse(localStorage.getItem('cyberquest_user'));
    if (savedUser) {
      const token = localStorage.getItem('cyberquest_token');
      try {
        await fetch(`${API_BASE_URL}/api/user/update-xp`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ email: savedUser.email, xpGain: points, wasCorrect: isCorrect, isPhishing: selectedEmail.isPhishing, isChallenge: false })
        });
      } catch (err) { console.error('Failed to sync:', err); }
    }
    setScore(prev => prev + points);
    setCompletedEmails(prev => new Set(prev).add(selectedEmail.id));
    setFeedback({ type: isCorrect ? 'success' : 'fail', message: isCorrect ? `+${points} XP Earned` : 'SECURITY BREACH', clue: selectedEmail.explanation });
    setTimeout(() => setFeedback(null), 3200);
  };

  const diffColor = (d) => d === 'hard' ? '#ef4444' : d === 'medium' ? '#f59e0b' : '#10b981';

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background: c.bgPage, padding:'20px 24px', fontFamily:'inherit', transition:'background 0.25s', position:'relative', overflow:'hidden' }}>

      {/* Feedback overlay */}
      {feedback && (
        <div style={{ position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, background: feedback.type==='success' ? 'rgba(5,40,20,0.92)' : 'rgba(40,5,5,0.92)', backdropFilter:'blur(6px)' }}>
          <div style={{ textAlign:'center', color:'white', padding:'40px 48px', maxWidth:500 }}>
            <div style={{ width:240, height:240, margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Lottie animationData={feedback.type === 'success' ? happyRobotAnim : sadbotAnim} loop={true} autoplay={true} />
            </div>
            <h2 style={{ fontSize:36, fontWeight:900, marginBottom:12 }}>{feedback.type==='success' ? '✅ THREAT NEUTRALIZED' : '⚠ SECURITY BREACH'}</h2>
            <p style={{ fontSize:20, fontWeight:700, opacity:0.8, marginBottom:16 }}>{feedback.message}</p>
            {feedback.type==='fail' && (
              <div style={{ background:'rgba(0,0,0,0.5)', padding:'16px 20px', borderRadius:16, border:'1px solid rgba(239,68,68,0.35)', textAlign:'left' }}>
                <p style={{ fontSize:10, color:'#ef4444', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', marginBottom:6 }}>Forensics Report</p>
                <p style={{ fontSize:13, color:'#cbd5e1', lineHeight:1.65, margin:0, fontStyle:'italic' }}>{feedback.clue}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16, background: c.bgCard, border:`1px solid ${c.border}`, padding:'14px 20px', borderRadius:18 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:6, color: c.cyan, marginBottom:4 }}>
            <Terminal size={13} />
            <span style={{ fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.25em' }}>Virtual Simulation</span>
          </div>
          <h1 style={{ fontSize:20, fontWeight:900, textTransform:'uppercase', letterSpacing:'-0.01em', color: c.textPrimary, margin:0 }}>Active Inbox Simulation</h1>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={() => setShowHelp(true)} style={{ background: c.bgElevated, border:`1px solid ${c.border}`, borderRadius:14, padding:'10px', display:'flex', alignItems:'center', justifyContent:'center', color: c.textSecondary, cursor:'pointer', transition:'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = c.cyan} onMouseLeave={e => e.currentTarget.style.color = c.textSecondary}>
            <HelpCircle size={22} />
          </button>
          <div style={{ background: c.bgElevated, border:`1px solid ${c.yellow}35`, padding:'12px 24px', borderRadius:14, display:'flex', alignItems:'center', gap:12 }}>
            <Shield size={18} color={c.yellow} />
            <div>
              <p style={{ fontSize:9, fontWeight:900, color: c.yellow, textTransform:'uppercase', letterSpacing:'0.2em', margin:0 }}>Risk Score</p>
              <p style={{ fontSize:22, fontWeight:900, color: c.textPrimary, margin:0, lineHeight:1.1 }}>{score}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div style={{ position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:60, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)' }}>
          <div style={{ background: c.bgCard, border:`1px solid ${c.border}`, borderRadius:20, padding:'32px', maxWidth:500, width:'100%', position:'relative', boxShadow:'0 10px 40px rgba(0,0,0,0.2)' }}>
            <button onClick={() => setShowHelp(false)} style={{ position:'absolute', top:20, right:20, background:'transparent', border:'none', color: c.textSecondary, cursor:'pointer' }}>
              <X size={24} />
            </button>
            <h2 style={{ fontSize:24, fontWeight:900, color: c.textPrimary, marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
              <HelpCircle color={c.cyan} size={28} /> How to Play
            </h2>
            <div style={{ color: c.textSecondary, fontSize:15, lineHeight:1.7, display:'flex', flexDirection:'column', gap:12 }}>
              <p>Welcome to the <strong>Virtual Inbox Simulation</strong>! Your objective is to identify phishing emails and separate them from legitimate ones.</p>
              <ul style={{ paddingLeft:20, margin:0, display:'flex', flexDirection:'column', gap:8 }}>
                <li>Select emails from the inbox on the left.</li>
                <li>Carefully read the email subject, sender address, and body. Look for clues like urgency, suspicious links, or weird sender domains.</li>
                <li>Choose <strong>Mark as Safe</strong> if the email is legitimate.</li>
                <li>Choose <strong>Report Phishing</strong> if the email is a scam or attack.</li>
              </ul>
              <p>You earn XP for correct choices, and lose XP for incorrect ones. Higher difficulties give more XP. Good luck!</p>
            </div>
            <button onClick={() => setShowHelp(false)} style={{ width:'100%', marginTop:24, padding:'12px', background: c.cyan, color:'#000', borderRadius:12, border:'none', fontWeight:900, cursor:'pointer' }}>
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Main split */}
      <div style={{ flex:1, display:'flex', gap:16, overflow:'hidden', minHeight:0 }}>

        {/* Inbox */}
        <div style={{ width:260, background: c.bgCard, border:`1px solid ${c.border}`, borderRadius:18, overflow:'hidden', display:'flex', flexDirection:'column', flexShrink:0 }}>
          <div style={{ padding:'12px 16px', borderBottom:`1px solid ${c.border}`, background: c.bgElevated, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <select
              value={currentDifficulty}
              onChange={(e) => changeDifficulty(e.target.value)}
              style={{ background: c.bgCard, color: c.textPrimary, border: `1px solid ${c.border}`, borderRadius: 8, padding: '4px 8px', fontSize: 11, fontWeight: 700, outline: 'none', cursor: 'pointer' }}
            >
              {LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            <span style={{ fontSize:10, fontWeight:700, color: c.textSecondary, background: c.bgCard, padding:'2px 6px', borderRadius:6 }}>{currentLevelEmails.filter(e => completedEmails.has(e.id)).length} / {currentLevelEmails.length}</span>
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            {currentLevelEmails.map(email => {
              const isCompleted = completedEmails.has(email.id);
              return (
                <div key={email.id} onClick={() => setSelectedEmail(email)}
                  style={{ padding:'12px 16px', cursor:'pointer', borderBottom:`1px solid ${c.border}`, borderLeft:`3px solid ${selectedEmail.id===email.id ? c.indigo : 'transparent'}`, background: selectedEmail.id===email.id ? `${c.indigo}10` : 'transparent', opacity: isCompleted ? 0.6 : 1, transition:'all 0.15s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <p style={{ fontWeight:700, fontSize:13, color: c.textPrimary, margin:'0 0 2px' }}>{email.senderName}</p>
                     {isCompleted && <CheckCircle size={14} color={c.textMuted} />}
                  </div>
                  <p style={{ fontSize:12, color: c.textSecondary, margin:'0 0 4px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{email.subject}</p>
                  <span style={{ fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.1em', color: diffColor(email.difficulty) }}>{email.difficulty}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Email viewer */}
        <div style={{ flex:1, background: c.bgCard, border:`1px solid ${c.border}`, borderRadius:18, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
          <div style={{ padding:'20px 24px', borderBottom:`1px solid ${c.border}`, background: c.bgElevated }}>
            <h2 style={{ fontSize:18, fontWeight:900, color: c.textPrimary, margin:'0 0 12px', lineHeight:1.3 }}>{selectedEmail.subject}</h2>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:38, height:38, borderRadius:10, background:`${c.blue}15`, border:`1px solid ${c.blue}30`, display:'flex', alignItems:'center', justifyContent:'center', color: c.blue }}>
                <Mail size={17} />
              </div>
              <div>
                <p style={{ fontWeight:700, color: c.textPrimary, fontSize:13, margin:0 }}>{selectedEmail.senderName}</p>
                <p style={{ color: c.textMuted, fontSize:11, fontFamily:'monospace', margin:0 }}>&lt;{selectedEmail.senderEmail}&gt;</p>
              </div>
            </div>
          </div>
          <div style={{ flex:1, padding:'20px 24px', color: c.textSecondary, lineHeight:1.7, overflowY:'auto', fontSize:14, whiteSpace:'pre-wrap' }}>
            {selectedEmail.body}
          </div>
          <div style={{ padding:'16px 20px', background: c.bgElevated, borderTop:`1px solid ${c.border}`, display:'flex', gap:10, justifyContent:'flex-end' }}>
            {completedEmails.has(selectedEmail.id) ? (
               <p style={{ color: c.textMuted, fontSize: 13, fontWeight: 700, margin: 0, padding: '10px 0' }}>Incident already handled.</p>
            ) : (
              <>
                <button onClick={() => handleDecision('safe')}
                  style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 20px', background: c.bgCard, border:`1px solid ${c.border}`, borderRadius:12, color: c.textSecondary, fontWeight:700, fontSize:13, cursor:'pointer', transition:'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='#10b981'; e.currentTarget.style.color='#10b981'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=c.border; e.currentTarget.style.color=c.textSecondary; }}>
                  <CheckCircle size={15} color="#10b981" /> Mark as Safe
                </button>
                <button onClick={() => handleDecision('report')}
                  style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 20px', background:'rgba(239,68,68,0.1)', border:`1px solid rgba(239,68,68,0.4)`, borderRadius:12, color:'#ef4444', fontWeight:700, fontSize:13, cursor:'pointer', transition:'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background='#ef4444'; e.currentTarget.style.color='white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(239,68,68,0.1)'; e.currentTarget.style.color='#ef4444'; }}>
                  <AlertTriangle size={15} /> Report Phishing
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulator;