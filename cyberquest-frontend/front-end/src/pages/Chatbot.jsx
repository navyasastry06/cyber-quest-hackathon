import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ShieldAlert, Terminal, Activity } from 'lucide-react';
import API_BASE_URL from '../config';
import { useColors } from '../context/useColors';

const ChatPage = () => {
  const c = useColors();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "System Online. I am CyberGuard, your AI security copilot. Ask me anything about the IT Act 2000, data privacy, or threat analysis.", isBot: true }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userText = input;
    setMessages(prev => [...prev, { text: userText, isBot: false }]);
    setInput(''); setIsLoading(true);
    try {
      const token = localStorage.getItem('cyberquest_token');
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ message: userText }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { text: data.reply, isBot: true }]);
      } else {
        
        setMessages(prev => [...prev, { text: `⚠️ ${data.error || "System busy. Please try again."}`, isBot: true }]);
      }
    } catch (err) {
      console.error("Chat fetch error:", err);
      setMessages(prev => [...prev, { text: "🚨 Connection to CyberGuard servers lost. Check your backend.", isBot: true }]);
    } finally { 
      setIsLoading(false); 
    }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background: c.bgPage, padding:'24px 32px', minWidth:0, fontFamily:'inherit', transition:'background 0.25s' }}>

      {}
      <div style={{ marginBottom:20, display:'flex', alignItems:'center', gap:16, paddingBottom:16, borderBottom:`1px solid ${c.border}` }}>
        <div style={{ width:48, height:48, background:`${c.cyan}15`, border:`1px solid ${c.cyan}50`, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', color: c.cyan, flexShrink:0 }}>
          <ShieldAlert size={24} />
        </div>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:6, color: c.cyan, marginBottom:2 }}>
            <Activity size={12} />
            <span style={{ fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.25em' }}>Secure Comm-Link</span>
          </div>
          <h1 style={{ fontSize:24, fontWeight:900, textTransform:'uppercase', letterSpacing:'-0.02em', color: c.textPrimary, margin:0 }}>CyberGuard AI</h1>
        </div>
      </div>

      {}
      <div style={{ flex:1, background: c.bgCard, borderRadius:24, border:`1px solid ${c.border}`, display:'flex', flexDirection:'column', overflow:'hidden', minHeight:0, boxShadow: c.isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>

        {}
        <div style={{ flex:1, padding:'24px', overflowY:'auto', display:'flex', flexDirection:'column', gap:20 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display:'flex', justifyContent: msg.isBot ? 'flex-start' : 'flex-end' }}>
              <div style={{ display:'flex', gap:12, maxWidth:'80%', flexDirection: msg.isBot ? 'row' : 'row-reverse' }}>
                {}
                <div style={{ width:36, height:36, borderRadius:10, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${msg.isBot ? c.cyan+'50' : c.border}`, background: msg.isBot ? `${c.cyan}12` : c.bgElevated, color: msg.isBot ? c.cyan : c.textSecondary }}>
                  {msg.isBot ? <Bot size={18} /> : <User size={18} />}
                </div>
                {}
                <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                  <span style={{ fontSize:9, fontFamily:'monospace', fontWeight:900, letterSpacing:'0.2em', textTransform:'uppercase', opacity:0.5, color: msg.isBot ? c.cyan : c.textSecondary, textAlign: msg.isBot ? 'left' : 'right', paddingInline:4 }}>
                    {msg.isBot ? 'SYS_RESPONSE' : 'OPERATIVE_INPUT'}
                  </span>
                  <div style={{ padding:'12px 16px', borderRadius:16, fontSize:14, lineHeight:1.65, wordBreak:'break-word', background: msg.isBot ? (c.isDark ? 'rgba(6,182,212,0.08)' : 'rgba(6,182,212,0.06)') : c.bgElevated, border:`1px solid ${msg.isBot ? c.cyan+'35' : c.border}`, color: c.textPrimary }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ display:'flex', justifyContent:'flex-start' }}>
              <div style={{ display:'flex', gap:12, maxWidth:'80%' }}>
                <div style={{ width:36, height:36, borderRadius:10, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${c.cyan}50`, background:`${c.cyan}12`, color: c.cyan }}>
                  <Terminal size={18} />
                </div>
                <div style={{ padding:'12px 20px', borderRadius:16, background:`${c.cyan}10`, border:`1px solid ${c.cyan}35`, display:'flex', gap:6, alignItems:'center' }}>
                  {[0,1,2].map(i => <span key={i} style={{ width:8, height:8, borderRadius:'50%', background: c.cyan, display:'inline-block', animation:`bounce 1s ${i*0.15}s infinite` }} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {}
        <div style={{ padding:'16px 20px', borderTop:`1px solid ${c.border}`, background: c.bgElevated, flexShrink:0 }}>
          <form onSubmit={sendMessage} style={{ display:'flex', gap:10, maxWidth:900, margin:'0 auto' }}>
            <input type="text" value={input} onChange={e => setInput(e.target.value)}
              placeholder="Enter query parameters..."
              disabled={isLoading}
              style={{ flex:1, background: c.bgInput, border:`1px solid ${c.border}`, borderRadius:12, padding:'12px 16px', fontSize:14, color: c.textPrimary, fontFamily:'monospace', outline:'none', minWidth:0, transition:'border 0.2s' }}
              onFocus={e => e.target.style.borderColor = c.cyan}
              onBlur={e => e.target.style.borderColor = c.border}
            />
            <button type="submit" disabled={isLoading || !input.trim()}
              style={{ padding:'12px 24px', borderRadius:12, border:`1px solid ${c.cyan}50`, background:`${c.cyan}18`, color: c.cyan, fontWeight:900, fontSize:12, textTransform:'uppercase', letterSpacing:'0.1em', cursor:'pointer', display:'flex', alignItems:'center', gap:8, flexShrink:0, opacity: (isLoading||!input.trim()) ? 0.4 : 1, transition:'all 0.2s' }}
              onMouseEnter={e => { if(!isLoading && input.trim()) { e.currentTarget.style.background = c.cyan; e.currentTarget.style.color = '#000'; } }}
              onMouseLeave={e => { e.currentTarget.style.background = `${c.cyan}18`; e.currentTarget.style.color = c.cyan; }}>
              <Send size={16} /> Transmit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;