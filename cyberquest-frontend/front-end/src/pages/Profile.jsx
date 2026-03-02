import React from 'react';
import { User, Mail, Zap, Shield, Trophy } from 'lucide-react';

const Profile = () => {
  // Grab the logged-in user's data from local storage
  const user = JSON.parse(localStorage.getItem('cyberquest_user'));

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto w-full animate-fade-in">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Operative Dossier</h1>
        <p className="text-gray-500 mt-1">Classified personnel files and statistics.</p>
      </div>

      <div className="bg-gray-900 rounded-3xl border border-gray-800 p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          
          {/* Avatar Area */}
          <div className="w-32 h-32 bg-gray-800 rounded-full border-4 border-gray-700 flex items-center justify-center shrink-0 shadow-lg relative">
            <User size={64} className="text-gray-500" />
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-900 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>

          {/* User Info & Stats */}
          <div className="flex-1 text-center md:text-left w-full">
            <h2 className="text-4xl font-black text-white tracking-tight mb-2">
              {user.username}
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 mb-8">
              <Mail size={16} />
              <span>{user.email}</span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="bg-gray-800/50 p-5 rounded-2xl border border-gray-700/50 flex flex-col items-center justify-center transform transition hover:scale-105">
                <Zap size={28} className="text-blue-400 mb-2" />
                <span className="text-3xl font-black text-white">{user.total_xp || 0}</span>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Total XP</span>
              </div>

              <div className="bg-gray-800/50 p-5 rounded-2xl border border-gray-700/50 flex flex-col items-center justify-center transform transition hover:scale-105">
                <Shield size={28} className="text-green-400 mb-2" />
                <span className="text-2xl font-black text-white mt-1">Novice</span>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Current Rank</span>
              </div>

              <div className="bg-gray-800/50 p-5 rounded-2xl border border-gray-700/50 flex flex-col items-center justify-center transform transition hover:scale-105">
                <Trophy size={28} className="text-yellow-400 mb-2" />
                <span className="text-3xl font-black text-white">0</span>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Missions Passed</span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;