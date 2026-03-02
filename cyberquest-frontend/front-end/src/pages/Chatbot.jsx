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
    <div className="h-screen flex flex-col bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
          <ShieldAlert size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-blue-600 tracking-tight">CyberGuard AI</h1>
          <p className="text-sm text-gray-500 font-medium">Your personal legal and security copilot.</p>
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        
        {/* Chat History */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
              <div className={`flex gap-4 max-w-[75%] ${msg.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center shadow-sm ${msg.isBot ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}>
                  {msg.isBot ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className={`p-4 rounded-2xl text-base leading-relaxed shadow-sm ${msg.isBot ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none'}`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-none text-gray-400 flex gap-2 items-center shadow-sm">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce delay-100">●</span>
                <span className="animate-bounce delay-200">●</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={sendMessage} className="flex gap-3 max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about hacking penalties, data privacy, or to analyze a threat..."
              className="flex-1 bg-gray-100 border border-gray-200 rounded-xl px-6 py-4 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-inner"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-800 disabled:opacity-50 transition-colors shadow-md flex items-center gap-2 font-bold tracking-wide"
            >
              <Send size={20} />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;