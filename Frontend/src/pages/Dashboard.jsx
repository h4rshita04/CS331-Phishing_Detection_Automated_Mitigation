
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import Header from "../components/Header";
import {
  FaShieldAlt, FaExclamationTriangle,
  FaCheckCircle, FaSyncAlt, FaEnvelope
} from "react-icons/fa";

export default function Dashboard() {
  const { token } = useAuth();
  const navigate  = useNavigate();

  const [emails,   setEmails]   = useState([]);
  const [scanning, setScanning] = useState(false);
  const [error,    setError]    = useState("");
  const [scanned,  setScanned]  = useState(false);

  // Stats derived from emails
  const total      = emails.length;
  const phishing   = emails.filter(e => e.category === "Phishing").length;
  const suspicious = emails.filter(e => e.category === "Suspicious").length;
  const safe       = emails.filter(e => e.category === "Safe").length;

  const handleScan = async () => {
    setScanning(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/connect/scan`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 400) {
        // Gmail not connected yet
        navigate("/connect");
        return;
      }

      const data = await res.json();
      setEmails(data.emails || []);
      setScanned(true);

    } catch {
      setError("Scan failed. Make sure the risk engine is running on port 5000.");
    } finally {
      setScanning(false);
    }
  };

  const categoryStyle = (category) => {
    switch (category) {
      case "Phishing":   return "text-red-400 bg-red-500/10 border border-red-500/30";
      case "Suspicious": return "text-yellow-400 bg-yellow-500/10 border border-yellow-500/30";
      case "Safe":       return "text-green-400 bg-green-500/10 border border-green-500/30";
      default:           return "text-gray-400 bg-gray-500/10 border border-gray-500/30";
    }
  };

  const categoryIcon = (category) => {
    switch (category) {
      case "Phishing":   return <FaExclamationTriangle className="text-red-400" />;
      case "Suspicious": return <FaExclamationTriangle className="text-yellow-400" />;
      case "Safe":       return <FaCheckCircle className="text-green-400" />;
      default:           return <FaEnvelope className="text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950/40 to-purple-950/30 text-gray-100">
      <Header />

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Title + Scan Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">AI-powered phishing detection for your inbox</p>
          </div>
          <button
            onClick={handleScan}
            disabled={scanning}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50
                       text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200
                       shadow-lg hover:shadow-blue-500/25"
          >
            <FaSyncAlt className={scanning ? "animate-spin" : ""} />
            {scanning ? "Scanning..." : "Scan Inbox"}
          </button>
        </div>

        {error && <div className="error-banner mb-6">{error}</div>}

        {/* Stats Cards */}
        {scanned && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Scanned", value: total,      color: "text-blue-400",   icon: <FaEnvelope /> },
              { label: "Phishing",      value: phishing,   color: "text-red-400",    icon: <FaExclamationTriangle /> },
              { label: "Suspicious",    value: suspicious, color: "text-yellow-400", icon: <FaExclamationTriangle /> },
              { label: "Safe",          value: safe,       color: "text-green-400",  icon: <FaCheckCircle /> },
            ].map(stat => (
              <div key={stat.label}
                className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-5 text-center">
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-gray-400 text-sm mt-1 flex items-center justify-center gap-1">
                  <span className={stat.color}>{stat.icon}</span>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Email Results Table */}
        {scanned && emails.length > 0 && (
          <div className="bg-gray-900/60 border border-gray-700/50 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700/50">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <FaShieldAlt className="text-blue-400" /> Scan Results
              </h2>
            </div>
            <div className="divide-y divide-gray-800/50">
              {emails.map((email) => (
                <div key={email.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="font-medium text-sm truncate">{email.subject}</p>
                    <p className="text-gray-500 text-xs mt-0.5 truncate">{email.sender}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-gray-500 text-xs">Score: {Math.round(email.risk_score)}</span>
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${categoryStyle(email.category)}`}>
                      {categoryIcon(email.category)}
                      {email.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!scanned && !scanning && (
          <div className="text-center py-24 text-gray-600">
            <FaShieldAlt className="text-6xl mx-auto mb-4 text-gray-700" />
            <p className="text-lg font-medium text-gray-500">Click "Scan Inbox" to analyse your emails</p>
            <p className="text-sm mt-2">Make sure Gmail is connected first</p>
          </div>
        )}

      </div>
    </div>
  );
}
