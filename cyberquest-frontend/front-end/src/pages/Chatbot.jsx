import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ShieldAlert } from 'lucide-react';

const ChatPage = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "System Online. I am CyberGuard, your AI security copilot. Ask me anything about the IT Act 2000, data privacy, or threat analysis.", isBot: true }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setMessages((prev) => [...prev, { text: userText, isBot: false }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [...prev, { text: data.reply, isBot: true }]);
      } else {
        setMessages((prev) => [...prev, { text: "⚠️ System busy. Please wait 60 seconds and try again.", isBot: true }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { text: "🚨 Connection to CyberGuard servers lost. Check your backend.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 1. Reduced outer padding on mobile (p-2), spacious on desktop (md:p-6)
    <div className="flex-1 flex flex-col h-[100dvh] md:h-full bg-gray-100 p-2 md:p-6 min-w-0">
      
      {/* Header */}
      <div className="mb-3 md:mb-6 bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
          <ShieldAlert className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg md:text-2xl font-black text-blue-600 tracking-tight truncate">CyberGuard AI</h1>
          {/* Hide the subtitle on very small phone screens to save space */}
          <p className="text-xs md:text-sm text-gray-500 font-medium hidden sm:block truncate">Your personal legal and security copilot.</p>
        </div>
      </div>

      {/* Main Chat Window (min-h-0 is the magic fix for flexbox scrolling bugs!) */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden min-h-0">
        
        {/* Chat History */}
        <div className="flex-1 p-3 md:p-6 overflow-y-auto bg-gray-50 space-y-4 md:space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
              
              {/* 2. Chat Bubbles take 95% of screen on mobile, 75% on desktop */}
              <div className={`flex gap-2 md:gap-4 max-w-[95%] md:max-w-[75%] ${msg.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                
                <div className={`w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full flex items-center justify-center shadow-sm ${msg.isBot ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}>
                  {msg.isBot ? <Bot size={18} /> : <User size={18} />}
                </div>
                
                {/* 3. Added 'break-words' so long URLs or code blocks don't shatter your UI */}
                <div className={`p-3 md:p-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm break-words ${msg.isBot ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none'}`}>
                  {msg.text}
                </div>

              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 p-3 md:p-4 rounded-2xl rounded-tl-none text-gray-400 flex gap-2 items-center shadow-sm">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce delay-100">●</span>
                <span className="animate-bounce delay-200">●</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-2 md:p-4 bg-white border-t border-gray-100 shrink-0">
          <form onSubmit={sendMessage} className="flex gap-2 md:gap-3 max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask CyberGuard..."
              // 4. Input shrinks gracefully and won't push the send button off screen
              className="flex-1 bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 md:px-6 md:py-4 text-sm md:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-inner min-w-0"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 text-white px-4 py-3 md:px-6 md:py-4 rounded-xl hover:bg-blue-800 disabled:opacity-50 transition-colors shadow-md flex items-center justify-center gap-2 font-bold tracking-wide shrink-0"
            >
              <Send size={18} />
              {/* Hide the word "Send" on mobile, just show the paper airplane icon! */}
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;