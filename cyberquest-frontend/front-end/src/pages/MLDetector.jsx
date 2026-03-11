import React, { useState } from "react";
import Lottie from 'lottie-react';
import happyRobotAnim from '../assets/happy-robot.json';
import sadbotAnim from '../assets/sadbot.json';
import { ML_API_BASE_URL } from '../config';
import { HelpCircle, X, ShieldAlert } from 'lucide-react';

export default function MLDetector() {

  const [data, setData] = useState(null);
  const [traffic, setTraffic] = useState(null);
  const [result, setResult] = useState("");
  const [score, setScore] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const generateAttack = async () => {
    setIsLoading(true);
    setResult("");
    setRevealed(false);

    try {
      const response = await fetch(`${ML_API_BASE_URL}/simulate`);
      if (!response.ok) throw new Error("Simulation server failed.");
      const json = await response.json();

      setData(json);
      setTraffic(json.traffic);
    } catch (err) {
      alert("Failed to connect to the AI model server. Ensure the python backend is running.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const guessAttack = (type) => {

    if (!data) {
      alert("Generate attack first!");
      return;
    }

    const correct = data.actual_prediction;

    if (type === correct) {

      setResult("Correct");
      setScore(score + 10);

    } else {

      setResult("Wrong");
      setScore(score - 5);
    }

    setRevealed(true);
    generateSOCAlert(correct);
  };

  const generateSOCAlert = (attack) => {

    let message = "";
    let level = "";

    if (attack === "DoS") {
      level = "CRITICAL";
      message = "Denial of Service attack detected";
    }

    else if (attack === "R2L") {
      level = "WARNING";
      message = "Remote to Local intrusion attempt";
    }

    else if (attack === "U2R") {
      level = "CRITICAL";
      message = "User to Root privilege escalation detected";
    }

    else if (attack === "Probe") {
      level = "INFO";
      message = "Network scanning activity detected";
    }

    else {
      level = "INFO";
      message = "Normal network traffic observed";
    }

    setAlerts([{ level, message }, ...alerts]);
  };

  return (

    <div className="p-8 relative">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ShieldAlert className="text-blue-500" size={32} /> AI Intrusion Detection
        </h1>
        <button 
          onClick={() => setShowHelp(true)} 
          className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-blue-400 p-2 rounded-full transition-colors"
        >
          <HelpCircle size={24} />
        </button>
      </div>

      {}
      {showHelp && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-lg w-full relative shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <button 
              onClick={() => setShowHelp(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <HelpCircle className="text-blue-400" size={28} /> How to Play
            </h2>
            <div className="text-gray-300 text-[15px] space-y-4">
              <p>Welcome to the <strong>SOC Intrusion Detection</strong>! Your goal is to analyze raw network traffic and predict the type of cyber attack happening.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Click <strong>Generate Attack</strong> to simulate incoming network traffic.</li>
                <li>Analyze the network parameters (Failed Logins, Error Rates, Bytes Transferred).</li>
                <li>Guess the attack type:
                  <ul className="list-none pl-4 mt-2 space-y-1 text-[13px] bg-gray-900/50 p-2 rounded border border-gray-700">
                    <li><strong className="text-red-400">DoS:</strong> Denial of Service (High traffic volume)</li>
                    <li><strong className="text-yellow-400">Probe:</strong> Network Scanning (Small connections)</li>
                    <li><strong className="text-purple-400">R2L:</strong> Remote to Local (Failed logins)</li>
                    <li><strong className="text-pink-400">U2R:</strong> User to Root (Privilege escalation)</li>
                  </ul>
                </li>
                <li>If you guess correctly, you earn XP and our AI will explain the attack!</li>
              </ul>
            </div>
            <button 
              onClick={() => setShowHelp(false)} 
              className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
            >
              Understood!
            </button>
          </div>
        </div>
      )}

      <button
        onClick={generateAttack}
        disabled={isLoading}
        className={`${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded mb-6`}
      >
        {isLoading ? 'Generating...' : 'Generate Attack'}
      </button>

      <div className="grid grid-cols-2 gap-8">

        {}

        <div className="bg-gray-800 text-white p-6 rounded-lg shadow">

          <h2 className="text-xl mb-4 font-semibold">
            Network Traffic Data
          </h2>

          {traffic ? (

            <div className="space-y-2 text-sm">

              <p>Duration: {traffic.duration}</p>
              <p>Source Bytes: {traffic.src_bytes}</p>
              <p>Destination Bytes: {traffic.dst_bytes}</p>
              <p>Failed Logins: {traffic.failed_logins}</p>
              <p>Logged In: {traffic.logged_in}</p>
              <p>Compromised Accounts: {traffic.num_compromised}</p>
              <p>Connection Count: {traffic.count}</p>
              <p>Server Error Rate: {traffic.srv_serror_rate}</p>

            </div>

          ) : (

            <p className="text-gray-300">
              Click "Generate Attack" to analyze traffic.
            </p>

          )}

        </div>

        {}

        <div className="bg-gray-900 text-white p-6 rounded-lg shadow">

          <h2 className="text-xl mb-4 font-semibold">
            Guess the Attack
          </h2>

          <div className="flex gap-2 mb-6">

            <button onClick={() => guessAttack("DoS")} className="bg-red-500 px-3 py-1 rounded">DoS</button>
            <button onClick={() => guessAttack("Probe")} className="bg-yellow-500 text-black px-3 py-1 rounded">Probe</button>
            <button onClick={() => guessAttack("R2L")} className="bg-purple-500 px-3 py-1 rounded">R2L</button>
            <button onClick={() => guessAttack("U2R")} className="bg-pink-500 px-3 py-1 rounded">U2R</button>
            <button onClick={() => guessAttack("Normal")} className="bg-green-500 px-3 py-1 rounded">Normal</button>

          </div>

          {}

          {revealed && data && (

            <div className="space-y-2 text-sm">

              <p><strong>Attack Type:</strong> {data.actual_prediction}</p>
              <p><strong>Confidence:</strong> {data.confidence}</p>
              <p><strong>Explanation:</strong> {data.explanation}</p>
              <p><strong>Network Health:</strong> {data.network_health}</p>

            </div>

          )}

          <div className="mt-4 text-sm flex items-center gap-6">

            <div>
              <p className={`text-lg font-bold mb-1 ${result === 'Correct' ? 'text-green-500' : 'text-red-500'}`}>
                {result === 'Correct' ? '✔ Correct!' : result === 'Wrong' ? '✘ Incorrect' : ''}
              </p>
              <p className="font-semibold">Total Score: {score}</p>
            </div>

            {revealed && result && (
              <div className="w-48 h-48 flex-shrink-0">
                <Lottie animationData={result === "Correct" ? happyRobotAnim : sadbotAnim} loop={true} autoplay={true} />
              </div>
            )}

          </div>

        </div>

      </div>

      {}

      <div className="mt-8 bg-black text-green-400 p-6 rounded-lg font-mono">

        <h2 className="text-xl mb-4 text-white">
          SOC Live Attack Feed
        </h2>

        {alerts.length === 0 && (

          <p className="text-gray-400">
            No alerts yet...
          </p>

        )}

        {alerts.map((a, index) => (

          <div key={index} className="mb-1">

            [{a.level}] {a.message}

          </div>

        ))}

      </div>

    </div>
  );
}