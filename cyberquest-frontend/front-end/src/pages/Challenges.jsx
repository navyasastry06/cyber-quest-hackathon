import React, { useState } from 'react';
import { Trophy, Shield, Zap, CheckCircle, XCircle, ArrowLeft, Code, Terminal, BrainCircuit, AlertTriangle } from 'lucide-react';
import quizData from '../data/quiz.json';
import codeData from '../data/code.json';
import logData from '../data/log.json';

// We bundle them together here so the rest of your code works perfectly!
const challengesData = {
  quiz: quizData,
  code: codeData,
  log: logData
};

const Challenges = () => {
  const [activeGame, setActiveGame] = useState(null);
  
  // Shared Game State
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const resetGame = () => {
    setActiveGame(null);
    setCurrentStep(0);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const handleSelect = (index, correctAnswer, points) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === correctAnswer) setScore(score + points);
  };

  const nextQuestion = (gameType) => {
    if (currentStep < challengesData[gameType].length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      resetGame(); // For hackathon demo, just return to hub when done
    }
  };

  // --- MENU RENDERER ---
  if (!activeGame) {
    return (
      <div className="p-8 h-screen overflow-y-auto bg-gray-50">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-blue-600 tracking-tight mb-2">Training Arena</h1>
            <p className="text-gray-500 font-medium text-lg">Select a simulation to test your skills.</p>
          </div>
          <div className="bg-yellow-100 px-6 py-3 rounded-2xl border border-yellow-200 flex items-center gap-3 shadow-sm">
            <Trophy size={24} className="text-yellow-600" />
            <span className="text-xl font-black text-yellow-700">{score} Total XP</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
          <button onClick={() => setActiveGame('quiz')} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all group text-left flex flex-col items-start">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><BrainCircuit size={32} className="text-blue-600" /></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Threat Quiz</h2>
            <p className="text-gray-500 mb-6 flex-1">Test your knowledge on phishing and security concepts.</p>
            <div className="w-full bg-blue-50 text-blue-700 font-bold py-3 rounded-xl text-center group-hover:bg-blue-600 group-hover:text-white transition-colors">Enter Simulation</div>
          </button>

          <button onClick={() => setActiveGame('code')} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:border-purple-500 hover:shadow-xl transition-all group text-left flex flex-col items-start">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Code size={32} className="text-purple-600" /></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Code Auditor</h2>
            <p className="text-gray-500 mb-6 flex-1">Review live code snippets and identify vulnerabilities.</p>
            <div className="w-full bg-purple-50 text-purple-700 font-bold py-3 rounded-xl text-center group-hover:bg-purple-600 group-hover:text-white transition-colors">Enter Simulation</div>
          </button>

          <button onClick={() => setActiveGame('log')} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:border-green-500 hover:shadow-xl transition-all group text-left flex flex-col items-start">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Terminal size={32} className="text-green-600" /></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Log Detective</h2>
            <p className="text-gray-500 mb-6 flex-1">Analyze live firewall logs to hunt down malicious IPs.</p>
            <div className="w-full bg-green-50 text-green-700 font-bold py-3 rounded-xl text-center group-hover:bg-green-600 group-hover:text-white transition-colors">Enter Simulation</div>
          </button>
        </div>
      </div>
    );
  }

  // --- GAME RENDERER UTILS ---
  const renderHeader = (title, colorClass) => (
    <div className="flex justify-between items-center mb-6">
      <button onClick={resetGame} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold transition-colors">
        <ArrowLeft size={20} /> Back to Hub
      </button>
      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold ${colorClass}`}>
        <Zap size={20} /> {score} XP
      </div>
    </div>
  );

  const renderFeedback = (challenge, gameType) => (
    isAnswered && (
      <div className="mt-8 animate-fade-in-up">
        <div className={`p-6 rounded-2xl mb-6 flex gap-4 ${selectedOption === (challenge.correctAnswer ?? challenge.maliciousIndex) ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
          <div className="shrink-0 pt-1">
            {selectedOption === (challenge.correctAnswer ?? challenge.maliciousIndex) ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">{selectedOption === (challenge.correctAnswer ?? challenge.maliciousIndex) ? "Threat Neutralized! 🎯" : "Breach Detected! 🚨"}</h3>
            <p>{challenge.explanation}</p>
          </div>
        </div>
        <button onClick={() => nextQuestion(gameType)} className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-colors">
          Continue
        </button>
      </div>
    )
  );

  // --- SPECIFIC GAMES ---
  
  if (activeGame === 'quiz') {
    const challenge = challengesData.quiz[currentStep];
    return (
      <div className="p-8 h-screen overflow-y-auto bg-gray-50">
        {renderHeader("Threat Quiz", "bg-blue-50 text-blue-700 border-blue-200")}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-blue-600 p-8 text-white"><h2 className="text-xl font-bold mb-2">{challenge.title}</h2><p className="text-2xl font-semibold">{challenge.question}</p></div>
          <div className="p-8 space-y-4">
            {challenge.options.map((option, index) => {
              let btnStyle = "bg-gray-50 border-gray-200 text-gray-700 hover:bg-blue-50";
              if (isAnswered) {
                if (index === challenge.correctAnswer) btnStyle = "bg-green-50 border-green-500 text-green-800";
                else if (index === selectedOption) btnStyle = "bg-red-50 border-red-500 text-red-800";
              }
              return <button key={index} onClick={() => handleSelect(index, challenge.correctAnswer, challenge.points)} disabled={isAnswered} className={`w-full text-left p-5 rounded-2xl border-2 font-medium text-lg ${btnStyle}`}>{option}</button>;
            })}
            {renderFeedback(challenge, 'quiz')}
          </div>
        </div>
      </div>
    );
  }

  if (activeGame === 'code') {
    const challenge = challengesData.code[currentStep];
    return (
      <div className="p-8 h-screen overflow-y-auto bg-gray-50">
        {renderHeader("Code Auditor", "bg-purple-50 text-purple-700 border-purple-200")}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-900 p-8 text-white">
            <div className="flex items-center gap-2 mb-4 text-purple-400 font-mono text-sm"><Code size={16} /> vulnerable_route.js</div>
            <pre className="font-mono text-sm sm:text-base text-gray-300 bg-black p-6 rounded-xl overflow-x-auto border border-gray-700 shadow-inner">
              <code>{challenge.codeSnippet}</code>
            </pre>
            <p className="text-lg font-semibold mt-6">{challenge.question}</p>
          </div>
          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {challenge.options.map((option, index) => {
              let btnStyle = "bg-gray-50 border-gray-200 text-gray-700 hover:bg-purple-50 hover:border-purple-300";
              if (isAnswered) {
                if (index === challenge.correctAnswer) btnStyle = "bg-green-50 border-green-500 text-green-800";
                else if (index === selectedOption) btnStyle = "bg-red-50 border-red-500 text-red-800";
              }
              return <button key={index} onClick={() => handleSelect(index, challenge.correctAnswer, challenge.points)} disabled={isAnswered} className={`text-left p-4 rounded-xl border-2 font-medium ${btnStyle}`}>{option}</button>;
            })}
          </div>
          <div className="px-8 pb-8">{renderFeedback(challenge, 'code')}</div>
        </div>
      </div>
    );
  }

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
              <div className="grid grid-cols-12 gap-4 pb-2 border-b border-gray-800 text-gray-500 mb-2 px-4">
                <div className="col-span-2">TIMESTAMP</div><div className="col-span-3">SOURCE IP</div><div className="col-span-5">REQUEST</div><div className="col-span-2 text-right">STATUS</div>
              </div>
              {challenge.logs.map((log, index) => {
                let rowStyle = "hover:bg-gray-800 cursor-pointer text-gray-300";
                if (isAnswered) {
                  if (index === challenge.maliciousIndex) rowStyle = "bg-green-900/50 text-green-400 border border-green-500/50";
                  else if (index === selectedOption) rowStyle = "bg-red-900/50 text-red-400 border border-red-500/50";
                  else rowStyle = "opacity-50 text-gray-500";
                }
                return (
                  <button key={index} onClick={() => handleSelect(index, challenge.maliciousIndex, challenge.points)} disabled={isAnswered} className={`w-full text-left grid grid-cols-12 gap-4 py-3 px-4 rounded transition-colors ${rowStyle}`}>
                    <div className="col-span-2">{log.time}</div><div className="col-span-3">{log.ip}</div><div className="col-span-5 truncate">{log.req}</div><div className="col-span-2 text-right">{log.status}</div>
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
};

export default Challenges;