import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { FaGoogle, FaCheckCircle, FaShieldAlt, FaUnlink, FaSpinner } from "react-icons/fa";

export default function ConnectEmail() {
  const { token } = useAuth();

  const [connected,   setConnected]   = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [connecting,  setConnecting]  = useState(false);
  const [error,       setError]       = useState("");
  const [success,     setSuccess]     = useState("");
  const [userEmail,   setUserEmail]   = useState("");

  useEffect(() => { fetchStatus(); }, []);

  const fetchStatus = async () => {
    try {
      const res  = await fetch(`${API_BASE_URL}/connect/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setConnected(data.connected);
      setUserEmail(data.email);
    } catch {
      setError("Could not fetch connection status.");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    setError("");
    setSuccess("");
    try {
      const res  = await fetch(`${API_BASE_URL}/connect/gmail/connect`, {
        method:  "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Connection failed.");
      } else {
        setSuccess(`Connected: ${data.email}`);
        setConnected(true);
        setUserEmail(data.email);
      }
    } catch {
      setError("Connection failed. Make sure backend is running.");
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await fetch(`${API_BASE_URL}/connect/gmail/disconnect`, {
        method:  "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setConnected(false);
      setSuccess("Gmail disconnected.");
    } catch {
      setError("Failed to disconnect.");
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", minHeight: "100vh", background: "#080c14", color: "#e2e8f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        .connect-btn { background: linear-gradient(135deg,#3b82f6,#6366f1); border: none; cursor: pointer; transition: all 0.2s; }
        .connect-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 25px rgba(99,102,241,0.4); }
        .connect-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; }
        .error-box   { background: rgba(239,68,68,0.1);  border: 1px solid rgba(239,68,68,0.3);  color: #f87171; border-radius: 10px; padding: 12px 16px; font-size: 13px; margin-bottom: 20px; }
        .success-box { background: rgba(34,197,94,0.1);  border: 1px solid rgba(34,197,94,0.3);  color: #4ade80; border-radius: 10px; padding: 12px 16px; font-size: 13px; margin-bottom: 20px; }
        .grid-bg { background-image: linear-gradient(rgba(99,102,241,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.03) 1px,transparent 1px); background-size: 40px 40px; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(8,12,20,0.8)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#3b82f6,#6366f1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FaShieldAlt style={{ fontSize: 13, color: "#fff" }} />
            </div>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, background: "linear-gradient(135deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              PhishGuard
            </span>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <Link to="/"        style={{ color: "#64748b", textDecoration: "none", fontSize: 13, fontWeight: 500 }}>Dashboard</Link>
            <Link to="/alerts"  style={{ color: "#64748b", textDecoration: "none", fontSize: 13, fontWeight: 500 }}>Alerts</Link>
            <Link to="/connect" style={{ color: "#818cf8", textDecoration: "none", fontSize: 13, fontWeight: 500 }}>Connect</Link>
          </div>
        </div>
      </nav>

      <div className="grid-bg" style={{ minHeight: "calc(100vh - 60px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div className="card" style={{ width: "100%", maxWidth: 480, padding: 48, textAlign: "center" }}>

          <div style={{ width: 72, height: 72, borderRadius: 20, background: connected ? "rgba(34,197,94,0.1)" : "rgba(99,102,241,0.1)", border: `1px solid ${connected ? "rgba(34,197,94,0.3)" : "rgba(99,102,241,0.3)"}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            {connected
              ? <FaCheckCircle style={{ fontSize: 28, color: "#22c55e" }} />
              : <FaGoogle      style={{ fontSize: 28, color: "#6366f1" }} />
            }
          </div>

          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, margin: "0 0 8px" }}>
            {connected ? "Gmail Connected" : "Connect Your Gmail"}
          </h2>
          <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.6, margin: "0 0 32px" }}>
            {connected
              ? `${userEmail} is linked and ready to scan.`
              : "Link your Gmail to let PhishGuard scan your inbox for phishing threats."
            }
          </p>

          {error   && <div className="error-box">{error}</div>}
          {success && <div className="success-box">{success}</div>}

          {loading ? (
            <p style={{ color: "#475569", fontSize: 13 }}>Checking status...</p>
          ) : connected ? (
            <div>
              <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#4ade80" }}>
                ✓ Ready to scan — go to <Link to="/" style={{ color: "#818cf8" }}>Dashboard</Link>
              </div>
              <button onClick={handleDisconnect} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "10px 20px", borderRadius: 10, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, margin: "0 auto" }}>
                <FaUnlink /> Disconnect Gmail
              </button>
            </div>
          ) : (
            <div>
              <button className="connect-btn" onClick={handleConnect} disabled={connecting}
                style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 auto 16px", padding: "12px 28px", borderRadius: 12, color: "#fff", fontWeight: 600, fontSize: 15 }}>
                {connecting ? <><FaSpinner className="spin" /> Waiting for Google login...</> : <><FaGoogle /> Connect Gmail Account</>}
              </button>
              {connecting && (
                <p style={{ color: "#475569", fontSize: 12 }}>
                  A browser window opened — complete login there, then return here
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}