import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Trophy, Shield, Zap, Target, AlertTriangle, Star } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [userData, setUserData] = useState({ 
    username: 'Operative',
    total_xp: 0, 
    phishing_detected: 0, 
    emails_clicked: 0,
    challenges_completed: 0 
  });
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // FIX: Match the key used in App.jsx
      const savedUser = localStorage.getItem('cyberquest_user');
      if (!savedUser) {
        setLoading(false);
        return;
      }
      
      const { email } = JSON.parse(savedUser);

      try {
        const statsRes = await fetch(`http://localhost:5000/api/user/stats/${email}`);
        const statsData = await statsRes.json();
        setUserData(statsData);

        const lbRes = await fetch(`http://localhost:5000/api/user/leaderboard`);
        const lbData = await lbRes.json();
        setLeaderboard(lbData);
      } catch (err) {
        console.error("Dashboard sync error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getPlayerRank = (xp) => {
    if (xp >= 2000) return { name: "Senior Architect", color: "text-purple-500", border: "border-purple-500", bg: "bg-purple-50" };
    if (xp >= 1000) return { name: "Security Analyst", color: "text-red-500", border: "border-red-500", bg: "bg-red-50" };
    if (xp >= 500)  return { name: "Junior Field Agent", color: "text-blue-500", border: "border-blue-500", bg: "bg-blue-50" };
    return { name: "Security Trainee", color: "text-gray-400", border: "border-gray-400", bg: "bg-gray-50" };
  };

  const rank = getPlayerRank(userData.total_xp);

  const chartData = {
    labels: ['Detected', 'Failed'],
    datasets: [{
      label: 'Simulator Stats',
      data: [userData.phishing_detected || 0, userData.emails_clicked || 0],
      backgroundColor: ['#22c55e', '#ef4444'], 
      borderRadius: 8,
    }],
  };

  if (loading) return <div className="p-8 text-center font-bold">Syncing with Command Center...</div>;

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black text-slate-900">Welcome, {userData.username}</h1>
        <div className={`px-6 py-3 border-2 rounded-2xl font-black ${rank.color} ${rank.border} ${rank.bg}`}>
          RANK: {rank.name}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 text-center">
          <Zap className="mx-auto text-yellow-500 mb-2" />
          <p className="text-slate-400 font-bold uppercase text-xs">Total XP</p>
          <p className="text-5xl font-black">{userData.total_xp}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 text-center">
          <Target className="mx-auto text-blue-600 mb-2" />
          <p className="text-slate-400 font-bold uppercase text-xs">Arena Success</p>
          <p className="text-5xl font-black">{userData.challenges_completed || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 text-center">
          <Star className="mx-auto text-green-500 mb-2" />
          <p className="text-slate-400 font-bold uppercase text-xs">Accuracy</p>
          <p className="text-5xl font-black">
            {userData.phishing_detected + userData.emails_clicked > 0 
              ? Math.round((userData.phishing_detected / (userData.phishing_detected + userData.emails_clicked)) * 100) 
              : 0}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="font-bold mb-6">Field Performance</h3>
          <div className="h-64">
            <Bar data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Trophy className="text-yellow-400" /> Leaderboard</h3>
          <div className="space-y-4">
            {leaderboard.map((player, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-slate-800 rounded-xl">
                <span>#{index + 1} {player.username}</span>
                <span className="text-blue-400 font-black">{player.total_xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;