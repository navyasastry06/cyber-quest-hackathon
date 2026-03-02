import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, Wrench, Bot, Shield } from 'lucide-react';
import { Trophy } from 'lucide-react'
const Sidebar = () => {
  // This helps us know which page is currently active
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen border-r border-gray-800 shrink-0">
      
      {/* Brand / Logo Area */}
      <div className="p-6 flex items-center gap-3 border-b border-gray-800">
        <div className="p-2 bg-blue-600 rounded-lg shadow-lg">
          <Shield size={24} className="text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-wider text-white">CyberQuest</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        <Link 
          to="/" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/') ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
        >
          <LayoutDashboard size={20} />
          <span className="font-medium">Dashboard</span>
        </Link>

        <Link 
          to="/simulator" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/simulator') ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
        >
          <ShieldAlert size={20} />
          <span className="font-medium">Simulator</span>
        </Link>

        <Link 
          to="/tools" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/tools') ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
        >
          <Wrench size={20} />
          <span className="font-medium">Threat Tools</span>
        </Link>

        <Link 
          to="/chat" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/chat') ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
        >
          <Bot size={20} />
          <span className="font-medium">AI Copilot</span>
        </Link>
        <Link 
          to="/challenges" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/challenges') ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
        >
          <Trophy size={20} />
          <span className="font-medium">Challenges</span>
        </Link>
      </nav>

      {/* Bottom Footer Area */}
      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-800 rounded-lg p-3 text-sm text-gray-400 text-center">
          <p className="font-semibold text-gray-300">System Status</p>
          <p className="flex items-center justify-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Online & Secure
          </p>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;