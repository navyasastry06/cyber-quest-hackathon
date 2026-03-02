import React, { useState } from 'react';
import { Search, ShieldCheck, AlertTriangle, Link as LinkIcon, Activity } from 'lucide-react';

const Tools = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsScanning(true);
    setResult(null);

    // Simulate a network scan delay for dramatic effect
    setTimeout(() => {
      setIsScanning(false);
      // Fake logic: if the URL contains 'login' or '-', flag it as suspicious
      if (url.includes('-') || url.includes('login') || url.includes('update')) {
        setResult({
          safe: false,
          message: "High Risk Detected!",
          details: "This URL exhibits patterns commonly associated with phishing domains. Do not enter credentials."
        });
      } else {
        setResult({
          safe: true,
          message: "No Threats Found.",
          details: "The domain appears to be clean and is not listed in current malware databases."
        });
      }
    }, 2000);
  };

  return (
    <div className="p-8 h-screen overflow-y-auto bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-blue-600 tracking-tight">Threat Inspector</h1>
        <p className="text-gray-500 mt-2 font-medium">Analyze suspicious links and payloads in a secure sandbox environment.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Link Scanner Tool */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <LinkIcon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">URL Analyzer</h2>
              <p className="text-sm text-gray-500">Scan links for phishing and malware</p>
            </div>
          </div>

          <form onSubmit={handleScan} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Target URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://suspicious-link.com/login..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isScanning || !url}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-70 flex justify-center items-center gap-2 shadow-md"
            >
              {isScanning ? (
                <>
                  <Activity className="animate-spin" size={20} />
                  Scanning Database...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Analyze URL
                </>
              )}
            </button>
          </form>

          {/* Results Area */}
          {result && (
            <div className={`mt-6 p-5 rounded-xl border ${result.safe ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-3 mb-2">
                {result.safe ? (
                  <ShieldCheck size={24} className="text-green-600" />
                ) : (
                  <AlertTriangle size={24} className="text-red-600" />
                )}
                <h3 className={`font-bold text-lg ${result.safe ? 'text-green-800' : 'text-red-800'}`}>
                  {result.message}
                </h3>
              </div>
              <p className={`text-sm ${result.safe ? 'text-green-700' : 'text-red-700'}`}>
                {result.details}
              </p>
            </div>
          )}
        </div>

        {/* Coming Soon Placeholder for another tool */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-center items-center text-center h-full min-h-[300px]">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
            <Activity size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Password Strength Analyzer</h2>
          <p className="text-gray-500 mt-2 max-w-xs">Test the entropy and crack-time of passwords against common dictionaries.</p>
          <span className="mt-6 px-4 py-1.5 bg-gray-100 text-gray-600 font-semibold text-sm rounded-full uppercase tracking-wider">
            Coming Soon
          </span>
        </div>

      </div>
    </div>
  );
};

export default Tools;