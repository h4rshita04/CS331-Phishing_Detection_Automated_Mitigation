import { useState } from "react";
import { FaUserShield } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const registerUser = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Client-side validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => navigate("/login", { replace: true }), 1500);
      } else {
        // Show server-side error message if available
        setError(data.detail || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="signup-header">
          <FaUserShield className="signup-icon" />
          <h1>Create PHISHGUARD Account</h1>
          <p>Protect your inbox with AI-powered phishing detection</p>
        </div>

        <form onSubmit={registerUser} className="signup-form">
          {error && <div className="error-banner">{error}</div>}
          {success && <div className="success-banner">{success}</div>}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Secure Account"}
          </button>
        </form>

        <div className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}