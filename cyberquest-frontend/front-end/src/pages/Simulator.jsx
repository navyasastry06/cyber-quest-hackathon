import React, { useState } from 'react';
import emailsData from '../data/emails.json';
import { AlertTriangle, CheckCircle, Mail } from 'lucide-react';

const Simulator = () => {
  // State to track which email is currently selected
  const [selectedEmail, setSelectedEmail] = useState(emailsData[0]);
  // State for the gamification score
  const [score, setScore] = useState(0);

  // The game logic function
  const handleDecision = (decision) => {
    if (decision === 'report' && selectedEmail.isPhishing) {
      setScore(score + 100);
      alert("Correct! Threat neutralized. (+100 XP)");
    } else if (decision === 'safe' && !selectedEmail.isPhishing) {
      setScore(score + 50);
      alert("Correct! That was a safe email. (+50 XP)");
    } else {
      setScore(score - 50);
      alert(`SYSTEM COMPROMISED! You fell for it.\n\nClue: ${selectedEmail.explanation}`);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 p-6">
      {/* Top Header / Scoreboard */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-brand-blue tracking-tight">Active Inbox Simulation</h1>
          <p className="text-sm text-gray-500 font-medium">Identify the threats. Protect the network.</p>
        </div>
        <div className="bg-brand-blue text-white px-6 py-2 rounded-lg shadow-md">
          <span className="text-sm uppercase tracking-wider font-semibold opacity-80">Risk Score</span>
          <div className="text-3xl font-black">{score}</div>
        </div>
      </div>

      {/* Main Mail Interface */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        
        {/* Left Column: Inbox List */}
        <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-100 bg-gray-50 font-semibold text-gray-700">
            Inbox ({emailsData.length})
          </div>
          <div className="divide-y divide-gray-100">
            {emailsData.map((email) => (
              <div 
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className={`p-4 cursor-pointer transition-colors ${selectedEmail.id === email.id ? 'bg-blue-50 border-l-4 border-brand-blue' : 'hover:bg-gray-50'}`}
              >
                <div className="font-bold text-gray-800">{email.senderName}</div>
                <div className="text-sm font-semibold text-gray-900 truncate">{email.subject}</div>
                <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{email.difficulty}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Reading Pane */}
        <div className="w-2/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          {/* Email Header */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedEmail.subject}</h2>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-blue">
                <Mail size={20} />
              </div>
              <div>
                <div className="font-bold text-gray-900">{selectedEmail.senderName}</div>
                <div className="text-gray-500">&lt;{selectedEmail.senderEmail}&gt;</div>
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div className="p-6 flex-1 text-gray-800 whitespace-pre-wrap leading-relaxed">
            {selectedEmail.body}
          </div>

          {/* Action Footer (The Game Buttons) */}
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4 justify-end rounded-b-xl">
            <button 
              onClick={() => handleDecision('safe')}
              className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors shadow-sm"
            >
              <CheckCircle size={18} className="text-green-600" />
              Mark as Safe
            </button>
            <button 
              onClick={() => handleDecision('report')}
              className="flex items-center gap-2 px-6 py-2 bg-red-600 rounded-lg text-white font-semibold hover:bg-red-700 transition-colors shadow-sm"
            >
              <AlertTriangle size={18} />
              Report Phishing
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Simulator;