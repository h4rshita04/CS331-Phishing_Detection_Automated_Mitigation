// import { useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { FaShieldAlt } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import "./Login.css";

// export default function Login() {

//   const { login } = useAuth();

//   const navigate = useNavigate();   // ✅ correct place

//   const [email,setEmail] = useState("");
//   const [password,setPassword] = useState("");

//   const handleSubmit = async (e)=>{

//     e.preventDefault();

//     await login(email,password);

//     navigate("/", { replace: true })   // redirect to dashboard

//   };

//   return(

//     <div className="login-page">

//       <div className="login-card">

//         <div className="logo-section">
//           <FaShieldAlt className="logo-icon"/>
//           <h1>PHISHGAURD</h1>
//           <p>Advanced Phishing Detection Platform</p>
//         </div>

//         <form onSubmit={handleSubmit} className="login-form">

//           <input
//             type="email"
//             placeholder="Email Address"
//             value={email}
//             onChange={(e)=>setEmail(e.target.value)}
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e)=>setPassword(e.target.value)}
//           />

//           <button type="submit">
//             Secure Login
//           </button>

//         </form>

//         <div className="signup-link">
//           New user? <Link to="/signup">Create Account</Link>
//         </div>

//       </div>

//     </div>

//   )

// }
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaShieldAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo-section">
          <FaShieldAlt className="logo-icon" />
          <h1>PHISHGUARD</h1>
          <p>Advanced Phishing Detection Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-banner">{error}</div>}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Authenticating..." : "Secure Login"}
          </button>
        </form>

        <div className="signup-link">
          New user? <Link to="/signup">Create Account</Link>
        </div>
      </div>
    </div>
  );
}