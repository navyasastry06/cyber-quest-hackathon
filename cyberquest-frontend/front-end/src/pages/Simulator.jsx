import React, { useState } from 'react';
import emailsData from '../data/emails.json';
import { AlertTriangle, CheckCircle, Mail } from 'lucide-react';

const Simulator = () => {
  const [selectedEmail, setSelectedEmail] = useState(emailsData[0]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const handleDecision = async (decision) => {
    let isCorrect = false;
    let points = 0;

    // Determination Logic
    if (decision === 'report' && selectedEmail.isPhishing) {
      isCorrect = true;
      points = 100;
    } else if (decision === 'safe' && !selectedEmail.isPhishing) {
      isCorrect = true;
      points = 50;
    } else {
      isCorrect = false;
      points = -50;
    }

    // 🔥 SYNC TO BACKEND
    const savedUser = JSON.parse(localStorage.getItem('cyberquest_user'));
    if (savedUser) {
      try {
        await fetch('http://localhost:5000/api/user/update-xp', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: savedUser.email,
            xpGain: points,             // Matches backend xpGain
            wasCorrect: isCorrect,       // Matches backend logic
            isPhishing: selectedEmail.isPhishing,
            isChallenge: false           // This is the Simulator, not the Arena
          })
        });
      } catch (err) {
        console.error("Failed to sync with security server:", err);
      }
    }

    // UI Feedback Logic
    if (isCorrect) {
      setScore(prev => prev + points);
      setFeedback({
        type: "success",
        message: `+${points} XP Earned`,
      });
    } else {
      setScore(prev => prev + points); // Adds the negative points
      setFeedback({
        type: "fail",
        message: "SYSTEM BREACHED",
        clue: selectedEmail.explanation,
      });
    }

    setTimeout(() => setFeedback(null), 3000); // Increased to 3s so the animation can play out
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 p-6 relative overflow-hidden">
      
      {/* FEEDBACK OVERLAY */}
      {feedback && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ${
            feedback.type === "success"
              ? "bg-green-600/95"
              : "bg-red-900/95 flash shake"
          }`}
        >
          <div className="text-center text-white px-8 animate-bounce-short flex flex-col items-center">
            
            {/* 🎬 LOTTIE ANIMATION DROP ZONE */}
            <div className="w-48 h-48 mb-6 shrink-0 bg-white/10 rounded-3xl shadow-sm flex items-center justify-center border-2 border-dashed border-white/50 backdrop-blur-sm">
              <p className="text-sm text-white font-bold px-4 text-center uppercase tracking-widest">
                {feedback.type === "success" ? "FRIENDS: PUT HAPPY LOTTIE HERE" : "FRIENDS: PUT SAD LOTTIE HERE"}
              </p>
              {/* INSTRUCTIONS FOR FRIENDS: 
                  Replace the <p> tag above with your Lottie component:
                  <Lottie animationData={feedback.type === "success" ? happyAnimation : sadAnimation} loop={feedback.type !== "success"} /> 
              */}
            </div>

            <h2 className={`text-6xl font-black mb-6 tracking-tight ${
                feedback.type === "fail" ? "glitch text-red-200" : ""
              }`}
            >
              {feedback.type === "success" ? "✅ ACCESS GRANTED" : "⚠ SECURITY BREACH ⚠"}
            </h2>
            <p className="text-3xl font-bold mb-6">{feedback.message}</p>
            {feedback.type === "fail" && (
              <div className="bg-black/40 p-6 rounded-xl max-w-xl mx-auto border border-red-500 shadow-2xl">
                <p className="text-lg font-semibold mb-2 text-red-300 uppercase tracking-widest">Forensics Report:</p>
                <p className="text-base text-gray-200 italic">{feedback.clue}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-blue-700 tracking-tight">Active Inbox Simulation</h1>
          <p className="text-sm text-gray-500 font-medium">Identify the threats. Protect the network.</p>
        </div>
        <div className="bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md flex flex-col items-center">
          <span className="text-xs uppercase tracking-wider font-semibold opacity-80">Risk Score</span>
          <div className="text-3xl font-black leading-none">{score}</div>
        </div>
      </div>

      {/* MAIN UI */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* INBOX LIST */}
        <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-100 bg-gray-50 font-semibold text-gray-700 sticky top-0 z-10">
            Inbox ({emailsData.length})
          </div>
          <div className="divide-y divide-gray-100">
            {emailsData.map((email) => (
              <div
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedEmail.id === email.id ? 'bg-blue-50 border-l-4 border-blue-700' : 'hover:bg-gray-50'
                }`}
              >
                <div className="font-bold text-gray-800">{email.senderName}</div>
                <div className="text-sm font-semibold text-gray-900 truncate">{email.subject}</div>
                <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{email.difficulty}</div>
              </div>
            ))}
          </div>
        </div>

        {/* EMAIL VIEW */}
        <div className="w-2/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedEmail.subject}</h2>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                <Mail size={20} />
              </div>
              <div>
                <div className="font-bold text-gray-900">{selectedEmail.senderName}</div>
                <div className="text-gray-500">&lt;{selectedEmail.senderEmail}&gt;</div>
              </div>
            </div>
          </div>

          <div className="p-6 flex-1 text-gray-800 whitespace-pre-wrap leading-relaxed overflow-y-auto">
            {selectedEmail.body}
          </div>

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