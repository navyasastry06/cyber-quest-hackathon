import React, { useState, useEffect } from 'react';
import { User, Mail, Zap, Shield, Trophy, Loader2 } from 'lucide-react';

// This function defines the "Source of Truth" for Ranks
export const getRankInfo = (xp) => {
  if (xp >= 2000) return { title: "Senior Architect", color: "text-purple-400", border: "border-purple-500/50" };
  if (xp >= 1000) return { title: "Security Analyst", color: "text-blue-400", border: "border-blue-500/50" };
  if (xp >= 500) return { title: "Junior Field Agent", color: "text-green-400", border: "border-green-500/50" };
  return { title: "Security Trainee", color: "text-gray-400", border: "border-gray-700" };
};

const Profile = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      const savedUser = localStorage.getItem('cyberquest_user');
      if (!savedUser) return;
      const { email } = JSON.parse(savedUser);

      try {
        const response = await fetch(`http://localhost:5000/api/user/stats/${email}`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Profile sync error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
  if (!stats) return <div className="p-8">No operative data found.</div>;

  // Apply the unified rank logic
  const rank = getRankInfo(stats.total_xp || 0);

  return (
    <div className="p-8 max-w-4xl mx-auto w-full animate-in fade-in duration-700">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Operative Dossier</h1>
        <p className="text-gray-500 mt-1">Classified personnel files and statistics.</p>
      </div>

      <div className="bg-[#0f172a] rounded-[2.5rem] border border-slate-800 p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4"></div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
          <div className="relative group">
            <div className="w-40 h-40 bg-slate-800 rounded-full border-4 border-slate-700 flex items-center justify-center shrink-0 shadow-2xl transition-transform group-hover:scale-105">
              <User size={80} className="text-slate-500" />
            </div>
            <div className="absolute bottom-3 right-3 w-10 h-10 bg-green-500 rounded-full border-4 border-[#0f172a] flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left w-full">
            <h2 className="text-5xl font-black text-white tracking-tight mb-2">{stats.username}</h2>
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 mb-10 text-lg">
              <Mail size={18} />
              <span>{stats.email}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* XP */}
              <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 flex flex-col items-center justify-center">
                <Zap size={32} className="text-blue-400 mb-2" />
                <span className="text-4xl font-black text-white">{stats.total_xp || 0}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">Total XP</span>
              </div>

              {/* RANK - Now matches your "Security Analyst" naming */}
              <div className={`bg-slate-800/40 p-6 rounded-3xl border ${rank.border} flex flex-col items-center justify-center`}>
                <Shield size={32} className={`${rank.color} mb-2`} />
                <span className={`text-xl font-black tracking-tight ${rank.color}`}>{rank.title}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">Current Rank</span>
              </div>

              {/* MISSIONS */}
              <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 flex flex-col items-center justify-center">
                <Trophy size={32} className="text-yellow-500 mb-2" />
                <span className="text-4xl font-black text-white">{(stats.phishing_detected || 0) + (stats.challenges_completed || 0)}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">Missions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;