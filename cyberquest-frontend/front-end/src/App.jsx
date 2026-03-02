import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Simulator from './pages/Simulator';
import Tools from './pages/Tools';
import ChatPage from './pages/Chatbot'; // <-- Import the new page
import Challenges from './pages/Challenges';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#f9fafb]">
        <Sidebar />
        
        <div className="flex-1 overflow-y-auto relative">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/chat" element={<ChatPage />} /> {/* <-- Add the route */}
            <Route path="/challenges" element={<Challenges />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;