import React, { useState } from 'react';
import { Search, ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

const VaultIdScanner = () => {
  const [targetEmail, setTargetEmail] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleManualScan = async () => {
    if (!targetEmail) return;
    setIsScanning(true);
    setScanResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/vaultid/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderEmail: targetEmail })
      });
      const data = await response.json();
      setScanResult(data);
    } catch (error) {
      console.error("Scanner Error:", error);
      setScanResult({ error: "Connection to CyberQuest Backend failed." });
    }
    setIsScanning(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 p-6 ml-0 transition-all duration-300">
      
      {/* Header */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
            <Search size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-emerald-600 tracking-tight">VaultID Intel Scanner</h1>
            <p className="text-sm text-gray-500 font-medium">Manual target analysis and telemetry.</p>
          </div>
        </div>
      </div>

      {/* Main Scanner Card */}
      <div className="flex-1 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          
          <div className="p-8 bg-white">
            <p className="text-gray-600 mb-6 text-base leading-relaxed">
              Initiate a manual scan of a target email address. The Gemini network will analyze domain reputation, verify MX records, and check for typosquatting vectors.
            </p>

            {/* Search Input */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <input 
                type="email" 
                placeholder="Enter Target: e.g., admin@paypa1-support.com" 
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-6 py-4 text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner"
              />
              <button 
                onClick={handleManualScan}
                disabled={isScanning || !targetEmail}
                className={`px-8 py-4 rounded-xl text-white font-bold text-lg transition-colors shadow-md flex items-center justify-center gap-2 ${isScanning ? 'bg-amber-500' : 'bg-emerald-500 hover:bg-emerald-600'} disabled:opacity-50 min-w-[200px]`}
              >
                {isScanning ? '⏳ Scanning...' : 'Execute Scan'}
              </button>
            </div>

            {/* Dynamic Results Area */}
            {scanResult && !scanResult.error && (
              <div className={`p-8 rounded-xl border-l-4 shadow-sm animate-fade-in ${scanResult.trustScore > 70 ? 'bg-emerald-50 border-emerald-500' : 'bg-red-50 border-red-500'}`}>
                <h4 className={`text-xl font-bold flex items-center gap-3 mb-6 ${scanResult.trustScore > 70 ? 'text-emerald-700' : 'text-red-700'}`}>
                  {scanResult.trustScore > 70 ? <ShieldCheck size={28} /> : <AlertTriangle size={28} />}
                  {scanResult.trustScore > 70 ? 'THREAT LEVEL ZERO' : 'CRITICAL RISK DETECTED'}
                </h4>
                
                <div className="bg-white p-6 rounded-xl mb-6 border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Trust Score</span>
                    <div className={`text-5xl font-black mt-2 ${scanResult.trustScore > 70 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {scanResult.trustScore} <span className="text-2xl text-gray-400 font-medium">/ 100</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">AI Forensics Report</span>
                  <p className="mt-3 text-gray-700 bg-white p-6 rounded-xl border border-gray-200 shadow-sm leading-relaxed text-base">
                    {scanResult.analysis}
                  </p>
                </div>
              </div>
            )}

            {scanResult && scanResult.error && (
              <div className="p-6 bg-red-100 border border-red-300 text-red-700 rounded-xl flex items-center gap-3 font-medium text-base animate-fade-in">
                <AlertTriangle size={24} />
                {scanResult.error}
              </div>
            )}
            
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default VaultIdScanner;