import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Terminal } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    // We added "fixed inset-0 z-50" here to force it to be completely full-screen
    <div className="fixed inset-0 z-50 bg-gray-950 text-white flex flex-col items-center justify-center p-8 text-center">
      
      <div className="mb-8 p-6 bg-blue-500/10 rounded-full border border-blue-500/30">
        <Shield size={64} className="text-blue-500" />
      </div>
      
      <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
        Welcome to <span className="text-blue-500">CyberQuest</span>
      </h1>
      
      <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
        The ultimate gamified training arena for cybersecurity operatives. Learn to defend networks, audit code, and hunt threats in real-time simulations.
      </p>
      
      <button 
        onClick={() => navigate('/auth')}
        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-xl flex items-center gap-3 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/20"
      >
        <Terminal size={24} /> 
        <span className="text-lg">INITIALIZE ACCESS</span>
      </button>

    </div>
  );
};

export default Home;