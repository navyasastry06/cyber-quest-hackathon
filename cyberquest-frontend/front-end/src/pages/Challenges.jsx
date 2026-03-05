import React, { useState, useEffect } from 'react';
import { Trophy, Shield, Zap, CheckCircle, XCircle, ArrowLeft, Code, Terminal, BrainCircuit, AlertTriangle } from 'lucide-react';
import quizData from '../data/quiz.json';
import codeData from '../data/code.json';
import logData from '../data/log.json';

const challengesData = {
  quiz: quizData,
  code: codeData,
  log: logData
};

const Challenges = () => {
  const [activeGame, setActiveGame] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. FETCH INITIAL GLOBAL XP
  useEffect(() => {
    const fetchUserProgress = async () => {
      const savedUser = localStorage.getItem('cyberquest_user');
      if (!savedUser) return;
      const { email } = JSON.parse(savedUser);

      try {
        const response = await fetch(`http://localhost:5000/api/user/stats/${email}`);
        if (response.ok) {
          const data = await response.json();
          setScore(data.total_xp || 0);
        }
      } catch (err) {
        console.error("Initial XP fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProgress();
  }, []);

  const resetGame = () => {
    setActiveGame(null);
    setCurrentStep(0);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  // 2. SYNC XP UPDATES TO BACKEND
  const handleSelect = async (index, correctAnswer, points = 100) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const xpGain = points || 100;

    if (index === correctAnswer) {
      setScore(prev => prev + xpGain);

      const savedUser = JSON.parse(localStorage.getItem('cyberquest_user'));
      if (savedUser) {
        try {
          await fetch('http://localhost:5000/api/user/update-xp', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: savedUser.email,
              xpGain: xpGain,
              wasCorrect: true,
              isPhishing: false,
              isChallenge: true 
            })
          });
        } catch (err) {
          console.error("Arena DB Sync failed:", err);
        }
      }
    }
  };

  const nextQuestion = (gameType) => {
    if (currentStep < challengesData[gameType].length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      resetGame();
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-blue-400 font-mono">
      <Terminal className="animate-pulse mr-2" /> INITIALIZING DEFENSE PROTOCOLS...
    </div>
  );

  // --- REUSABLE RENDERERS ---
  const renderHeader = (title, colorClass) => (
    <div className="flex justify-between items-center mb-6">
      <button onClick={resetGame} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold transition-colors">
        <ArrowLeft size={20} /> Back to Hub
      </button>
      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold ${colorClass}`}>
        <Zap size={20} /> {score} Total XP
      </div>
    </div>
  );

  const renderFeedback = (challenge, gameType) => {
    const isCorrect = selectedOption === (challenge.correctAnswer ?? challenge.maliciousIndex);
    
    return isAnswered && (
      <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className={`p-6 rounded-2xl mb-6 flex flex-col md:flex-row items-center md:items-start gap-6 ${isCorrect ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
          
          {/* 🎬 LOTTIE ANIMATION DROP ZONE */}
          <div className="w-32 h-32 shrink-0 bg-white rounded-full shadow-inner flex items-center justify-center border-2 border-dashed border-gray-400">
            <p className="text-xs text-center text-gray-500 font-bold p-2 uppercase">
              {isCorrect ? "FRIENDS: PUT HAPPY LOTTIE HERE" : "FRIENDS: PUT SAD LOTTIE HERE"}
            </p>
            {/* INSTRUCTIONS FOR FRIENDS: 
                Replace the <p> tag above with your Lottie component:
                <Lottie animationData={isCorrect ? happyAnimation : sadAnimation} loop={!isCorrect} /> 
            */}
          </div>

          <div className="flex-1 text-center md:text-left pt-2">
            <h3 className="font-bold text-2xl mb-2 flex items-center justify-center md:justify-start gap-2">
              {isCorrect ? <CheckCircle size={28} /> : <AlertTriangle size={28} />}
              {isCorrect ? "Threat Neutralized! 🎯" : "Breach Detected! 🚨"}
            </h3>
            <p className="opacity-90 text-lg leading-relaxed">{challenge.explanation}</p>
          </div>
        </div>
        <button onClick={() => nextQuestion(gameType)} className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all shadow-lg active:scale-95">
          {currentStep < challengesData[gameType].length - 1 ? "Next Challenge" : "Finish Training"}
        </button>
      </div>
    );
  };

  // --- 1. HUB MENU ---
  if (!activeGame) {
    return (
      <div className="p-8 h-screen overflow-y-auto bg-gray-50">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-blue-600 tracking-tight mb-2">Training Arena</h1>
            <p className="text-gray-500 font-medium text-lg">Hone your security instincts.</p>
          </div>
          <div className="bg-yellow-100 px-6 py-3 rounded-2xl border border-yellow-200 flex items-center gap-3 shadow-sm">
            <Trophy size={24} className="text-yellow-600" />
            <span className="text-xl font-black text-yellow-700">{score} XP</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
          <button onClick={() => setActiveGame('quiz')} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all group text-left">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><BrainCircuit size={32} className="text-blue-600" /></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Threat Quiz</h2>
            <p className="text-gray-500 mb-6">Master core security concepts.</p>
            <div className="w-full bg-blue-50 text-blue-700 font-bold py-3 rounded-xl text-center group-hover:bg-blue-600 group-hover:text-white transition-colors">Start</div>
          </button>

          <button onClick={() => setActiveGame('code')} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:border-purple-500 hover:shadow-xl transition-all group text-left">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Code size={32} className="text-purple-600" /></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Code Auditor</h2>
            <p className="text-gray-500 mb-6">Find flaws in vulnerable logic.</p>
            <div className="w-full bg-purple-50 text-purple-700 font-bold py-3 rounded-xl text-center group-hover:bg-purple-600 group-hover:text-white transition-colors">Start</div>
          </button>

          <button onClick={() => setActiveGame('log')} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:border-green-500 hover:shadow-xl transition-all group text-left">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Terminal size={32} className="text-green-600" /></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Log Detective</h2>
            <p className="text-gray-500 mb-6">Analyze traffic for malicious IPs.</p>
            <div className="w-full bg-green-50 text-green-700 font-bold py-3 rounded-xl text-center group-hover:bg-green-600 group-hover:text-white transition-colors">Start</div>
          </button>
        </div>
      </div>
    );
  }

  // --- 2. QUIZ VIEW ---
  if (activeGame === 'quiz') {
    const challenge = challengesData.quiz[currentStep];
    return (
      <div className="p-8 h-screen overflow-y-auto bg-gray-50">
        {renderHeader("Threat Quiz", "bg-blue-50 text-blue-700 border-blue-200")}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-blue-600 p-8 text-white">
            <h2 className="text-xl font-bold mb-2 opacity-80">{challenge.title}</h2>
            <p className="text-2xl font-semibold leading-snug">{challenge.question}</p>
          </div>
          <div className="p-8 space-y-4">
            {challenge.options.map((option, index) => {
              let btnStyle = "bg-gray-50 border-gray-200 text-gray-700 hover:bg-blue-50";
              if (isAnswered) {
                if (index === challenge.correctAnswer) btnStyle = "bg-green-50 border-green-500 text-green-800";
                else if (index === selectedOption) btnStyle = "bg-red-50 border-red-500 text-red-800";
              }
              return (
                <button 
                  key={index} 
                  onClick={() => handleSelect(index, challenge.correctAnswer, challenge.points)} 
                  disabled={isAnswered} 
                  className={`w-full text-left p-5 rounded-2xl border-2 font-medium text-lg transition-all ${btnStyle}`}
                >
                  {option}
                </button>
              );
            })}
            {renderFeedback(challenge, 'quiz')}
          </div>
        </div>
      </div>
    );
  }

  // --- 3. CODE VIEW ---
  if (activeGame === 'code') {
    const challenge = challengesData.code[currentStep];
    return (
      <div className="p-8 h-screen overflow-y-auto bg-gray-50">
        {renderHeader("Code Auditor", "bg-purple-50 text-purple-700 border-purple-200")}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-900 p-8 text-white">
            <div className="flex items-center gap-2 mb-4 text-purple-400 font-mono text-sm"><Code size={16} /> secure_module.js</div>
            <pre className="font-mono text-sm sm:text-base text-gray-300 bg-black p-6 rounded-xl overflow-x-auto border border-gray-700 shadow-inner mb-6">
              <code>{challenge.codeSnippet}</code>
            </pre>
            <p className="text-xl font-semibold">{challenge.question}</p>
          </div>
          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {challenge.options.map((option, index) => {
              let btnStyle = "bg-gray-50 border-gray-200 text-gray-700 hover:bg-purple-50";
              if (isAnswered) {
                if (index === challenge.correctAnswer) btnStyle = "bg-green-50 border-green-500 text-green-800";
                else if (index === selectedOption) btnStyle = "bg-red-50 border-red-500 text-red-800";
              }
              return (
                <button 
                  key={index} 
                  onClick={() => handleSelect(index, challenge.correctAnswer, challenge.points)} 
                  disabled={isAnswered} 
                  className={`text-left p-4 rounded-xl border-2 font-medium transition-all ${btnStyle}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          <div className="px-8 pb-8">{renderFeedback(challenge, 'code')}</div>
        </div>
      </div>
    );
  }

  // --- 4. LOG VIEW ---
  if (activeGame === 'log') {
    const challenge = challengesData.log[currentStep];
    return (
      <div className="p-8 h-screen overflow-y-auto bg-gray-50">
        {renderHeader("Log Detective", "bg-green-50 text-green-700 border-green-200")}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-900 p-8 text-white">
            <h2 className="text-2xl font-bold text-green-400 mb-2 flex items-center gap-2"><Terminal size={24} /> {challenge.title}</h2>
            <p className="text-gray-400">{challenge.instruction}</p>
          </div>
          <div className="p-6 bg-black text-green-500 font-mono text-sm sm:text-base overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-12 gap-4 pb-2 border-b border-gray-800 text-gray-500 mb-2 px-4 uppercase text-xs tracking-widest">
                <div className="col-span-2">Time</div><div className="col-span-3">Source</div><div className="col-span-5">Request Path</div><div className="col-span-2 text-right">Status</div>
              </div>
              {challenge.logs.map((log, index) => {
                let rowStyle = "hover:bg-gray-800 cursor-pointer text-gray-300";
                if (isAnswered) {
                  if (index === challenge.maliciousIndex) rowStyle = "bg-green-900/50 text-green-400 border border-green-500/50";
                  else if (index === selectedOption) rowStyle = "bg-red-900/50 text-red-400 border border-red-500/50";
                  else rowStyle = "opacity-30 text-gray-600";
                }
                return (
                  <button 
                    key={index} 
                    onClick={() => handleSelect(index, challenge.maliciousIndex, challenge.points)} 
                    disabled={isAnswered} 
                    className={`w-full text-left grid grid-cols-12 gap-4 py-3 px-4 rounded transition-colors mb-1 ${rowStyle}`}
                  >
                    <div className="col-span-2">{log.time}</div><div className="col-span-3">{log.ip}</div><div className="col-span-5 truncate">{log.req}</div><div className="col-span-2 text-right font-bold">{log.status}</div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="px-8 pb-8 pt-4">{renderFeedback(challenge, 'log')}</div>
        </div>
      </div>
    );
  }

  return null;
};

export default Challenges;