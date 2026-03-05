import React, { useState } from 'react';
import { Search, ShieldCheck, AlertTriangle, Globe, Key, Hash, Copy, CheckCircle2, Lock, Unlock } from 'lucide-react';

const Tools = () => {
  // ==========================================
  // 1. OSINT IP TRACKER STATE & LOGIC
  // ==========================================
  const [ipAddress, setIpAddress] = useState('');
  const [ipData, setIpData] = useState(null);
  const [isIpLoading, setIsIpLoading] = useState(false);
  const [ipError, setIpError] = useState('');

  const handleIpScan = async (e) => {
    e.preventDefault();
    if (!ipAddress.trim()) return;
    setIsIpLoading(true);
    setIpError('');
    setIpData(null);

    try {
      const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
      const data = await response.json();
      
      if (data.error) {
        setIpError(data.reason || 'Invalid IP Address');
      } else {
        setIpData(data);
      }
    } catch (err) {
      setIpError('Failed to connect to OSINT database.');
    } finally {
      setIsIpLoading(false);
    }
  };

  // ==========================================
  // 2. PASSWORD ENTROPY ENGINE STATE & LOGIC
  // ==========================================
  const [password, setPassword] = useState('');
  
  const calculateStrength = (pwd) => {
    let score = 0;
    if (!pwd) return { score: 0, label: 'None', color: 'bg-gray-200', text: 'text-gray-500', time: '0 seconds' };
    
    if (pwd.length > 8) score += 1;
    if (pwd.length > 12) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 25, label: 'Weak', color: 'bg-red-500', text: 'text-red-600', time: 'Instantly' };
    if (score === 3) return { score: 50, label: 'Moderate', color: 'bg-amber-500', text: 'text-amber-600', time: 'A few hours' };
    if (score === 4) return { score: 75, label: 'Strong', color: 'bg-blue-500', text: 'text-blue-600', time: '50+ Years' };
    return { score: 100, label: 'Unbreakable', color: 'bg-emerald-500', text: 'text-emerald-600', time: '10,000+ Years' };
  };
  const strength = calculateStrength(password);

  // ==========================================
  // 3. HASH GENERATOR & DECODER STATE & LOGIC
  // ==========================================
  const [hashInput, setHashInput] = useState('');
  const [hashResult, setHashResult] = useState('');
  const [hashMode, setHashMode] = useState('SHA-256');
  const [copied, setCopied] = useState(false);

  const processHash = async () => {
    if (!hashInput) return;
    try {
      if (hashMode === 'Base64 Encode') {
        setHashResult(btoa(hashInput));
      } else if (hashMode === 'Base64 Decode') {
        setHashResult(atob(hashInput));
      } else if (hashMode === 'SHA-256') {
        const msgBuffer = new TextEncoder().encode(hashInput);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        setHashResult(hashHex);
      }
    } catch (e) {
      setHashResult('Error: Invalid input for decoding.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hashResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ==========================================
  // RENDER UI
  // ==========================================
  return (
   
    <div className="p-6 md:p-8 h-full bg-gray-50 w-full">
      
  
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-blue-600 tracking-tight">Threat Tools</h1>
          <p className="text-gray-500 mt-2 font-medium">Your arsenal for reconnaissance, cryptography, and forensics.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* ========================================== */}
          {/* TOOL 1: OSINT IP TRACKER                   */}
          {/* ========================================== */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <Globe size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">OSINT IP Tracker</h2>
                <p className="text-sm text-gray-500">Trace geographical routing and ISP data</p>
              </div>
            </div>

            <form onSubmit={handleIpScan} className="space-y-4 mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  placeholder="e.g., 8.8.8.8"
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  required
                />
                <button
                  type="submit"
                  disabled={isIpLoading || !ipAddress}
                  className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-70 flex items-center gap-2 shadow-md shrink-0"
                >
                  {isIpLoading ? 'Tracing...' : 'Trace'}
                </button>
              </div>
            </form>

            {ipError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 text-sm">
                <AlertTriangle size={18} /> {ipError}
              </div>
            )}

            {ipData && !ipError && (
              <div className="p-5 rounded-xl border bg-slate-50 border-slate-200 flex-1">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-500" /> Target Acquired
                </h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <p><strong className="text-slate-800">IP:</strong> {ipData.ip}</p>
                  <p><strong className="text-slate-800">Location:</strong> {ipData.city}, {ipData.region}, {ipData.country_name}</p>
                  <p><strong className="text-slate-800">ISP:</strong> {ipData.org}</p>
                  <p><strong className="text-slate-800">ASN:</strong> {ipData.asn}</p>
                </div>
              </div>
            )}
          </div>

          {/* ========================================== */}
          {/* TOOL 2: PASSWORD ENTROPY ENGINE            */}
          {/* ========================================== */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                <Key size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Entropy Engine</h2>
                <p className="text-sm text-gray-500">Real-time cryptographic strength analyzer</p>
              </div>
            </div>

            <div className="space-y-6 flex-1">
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Type a password to test..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-600">Brute-Force Resistance</span>
                  <span className={strength.text}>{strength.label}</span>
                </div>
                
                {/* Progress Bar */}
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${strength.color} transition-all duration-500`}
                    style={{ width: `${strength.score}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3 text-sm">
                <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <strong className="text-amber-800 block mb-1">Estimated Crack Time:</strong>
                  <span className="text-amber-700 font-mono text-base">{strength.time}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================== */}
          {/* TOOL 3: CRYPTO HASH GENERATOR (Wide Span)  */}
          {/* ========================================== */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                <Hash size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Data Forensics & Cryptography</h2>
                <p className="text-sm text-gray-500">Encode, Decode, and Hash string payloads</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Input Side */}
              <div className="space-y-4">
                <textarea
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                  placeholder="Enter payload string here..."
                  className="w-full h-32 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                ></textarea>
                
                <div className="flex flex-wrap gap-2">
                  {['SHA-256', 'Base64 Encode', 'Base64 Decode'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setHashMode(mode)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${hashMode === mode ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {mode === 'Base64 Encode' ? <Lock size={14} className="inline mr-1 mb-0.5"/> : null}
                      {mode === 'Base64 Decode' ? <Unlock size={14} className="inline mr-1 mb-0.5"/> : null}
                      {mode}
                    </button>
                  ))}
                  <button
                    onClick={processHash}
                    disabled={!hashInput}
                    className="ml-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-800 text-white font-bold rounded-lg transition-colors disabled:opacity-50 shadow-md"
                  >
                    Execute
                  </button>
                </div>
              </div>

              {/* Output Side */}
              <div className="relative">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Output ({hashMode})</label>
                <div className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-emerald-400 font-mono text-sm overflow-auto break-all shadow-inner relative group">
                  {hashResult || 'Waiting for execution...'}
                  
                  {hashResult && (
                    <button 
                      onClick={copyToClipboard}
                      className="absolute top-2 right-2 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Tools;