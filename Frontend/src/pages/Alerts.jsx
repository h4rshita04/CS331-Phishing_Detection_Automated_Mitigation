// // // src/pages/Alerts.jsx
// // import Header from '../components/Header';

// // export default function Alerts() {
// //   return (
// //     <div className="min-h-screen bg-gray-950 text-gray-100">
// //       <Header />
      
// //       <main className="p-6 max-w-7xl mx-auto">
// //         <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
// //           Phishing Alerts
// //         </h1>
        
// //         <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6">
// //           <p className="text-gray-300">Alerts page coming soon...</p>
// //           <p className="text-sm text-gray-500 mt-2">
// //             (Table with sender, subject, risk score, status, actions will go here)
// //           </p>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }


// // src/pages/Alerts.jsx
// import { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import { API_BASE_URL } from "../config";
// import Header from "../components/Header";
// import {
//   FaShieldAlt,
//   FaExclamationTriangle,
//   FaSyncAlt,
//   FaSpinner,
// } from "react-icons/fa";

// export default function Alerts() {
//   const { token } = useAuth();
//   const [emails, setEmails] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchAlerts();
//   }, []);

//   async function fetchAlerts() {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch(`${API_BASE_URL}/connect/scan`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Failed to fetch");
//       const data = await res.json();
//       const phishingOnly = (data.emails || []).filter(
//         (e) => e.category === "Phishing"
//       );
//       setEmails(phishingOnly);
//     } catch {
//       setError("Could not load alerts. Make sure the backend is running.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950/40 to-purple-950/30 text-gray-100">
//       <Header />

//       <main className="max-w-5xl mx-auto px-6 py-10">

//         {/* Title */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
//               Phishing Alerts
//             </h1>
//             <p className="text-gray-400 text-sm mt-1">
//               Emails detected as phishing and moved to Spam
//             </p>
//           </div>
//           <button
//             onClick={fetchAlerts}
//             disabled={loading}
//             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
//           >
//             {loading ? <FaSpinner className="animate-spin" /> : <FaSyncAlt />}
//             Refresh
//           </button>
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
//             {error}
//           </div>
//         )}

//         {/* Loading */}
//         {loading ? (
//           <div className="flex items-center justify-center py-24 gap-3 text-gray-500">
//             <FaSpinner className="animate-spin text-xl" />
//             <span>Scanning inbox…</span>
//           </div>

//         /* Empty */
//         ) : emails.length === 0 ? (
//           <div className="text-center py-24 text-gray-600">
//             <FaShieldAlt className="text-6xl mx-auto mb-4 opacity-20" />
//             <p className="text-lg font-medium text-gray-500">No phishing emails detected</p>
//             <p className="text-sm mt-2 text-gray-600">Your inbox looks clean</p>
//           </div>

//         /* Table */
//         ) : (
//           <div className="bg-gray-900/60 border border-gray-700/50 rounded-2xl overflow-hidden">

//             {/* Header */}
//             <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50">
//               <h2 className="font-semibold text-sm flex items-center gap-2 text-red-400">
//                 <FaExclamationTriangle />
//                 {emails.length} Phishing Email{emails.length > 1 ? "s" : ""} Detected
//               </h2>
//               <span className="text-xs text-gray-500">All moved to Spam automatically</span>
//             </div>

//             {/* Rows */}
//             <div className="divide-y divide-gray-800/50">
//               {emails.map((email, index) => (
//                 <div
//                   key={email.id}
//                   className="flex items-center gap-4 px-6 py-4 hover:bg-gray-800/30 transition-colors"
//                 >
//                   {/* Index */}
//                   <span className="text-xs text-gray-600 w-5 shrink-0">{index + 1}</span>

//                   {/* Icon */}
//                   <FaExclamationTriangle className="text-red-400 shrink-0" />

//                   {/* Content */}
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-medium text-gray-200 truncate">{email.subject}</p>
//                     <p className="text-xs text-gray-500 font-mono truncate mt-0.5">{email.sender}</p>
//                   </div>

//                   {/* Moved to spam badge */}
//                   <span className="shrink-0 px-3 py-1 rounded-full text-xs font-medium bg-red-500/15 border border-red-500/30 text-red-400">
//                     Moved to Spam
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// src/pages/Alerts.jsx
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import { FaShieldAlt, FaExclamationTriangle } from "react-icons/fa";

export default function Alerts() {
  const { state } = useLocation();
  const alerts = state?.alerts || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950/40 to-purple-950/30 text-gray-100">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
            Phishing Alerts
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Emails detected as phishing and moved to Spam
          </p>
        </div>

        {alerts.length === 0 ? (
          <div className="text-center py-24">
            <FaShieldAlt className="text-6xl mx-auto mb-4 text-gray-700 opacity-20" />
            <p className="text-lg font-medium text-gray-500">No phishing emails detected</p>
            <p className="text-sm mt-2 text-gray-600">Your inbox looks clean</p>
          </div>

        ) : (
          <div className="bg-gray-900/60 border border-gray-700/50 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50">
              <h2 className="font-semibold text-sm flex items-center gap-2 text-red-400">
                <FaExclamationTriangle />
                {alerts.length} Phishing Email{alerts.length > 1 ? "s" : ""} Detected
              </h2>
              <span className="text-xs text-gray-500">All moved to Spam automatically</span>
            </div>

            <div className="divide-y divide-gray-800/50">
              {alerts.map((email, index) => (
                <div
                  key={email.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-800/30 transition-colors"
                >
                  <span className="text-xs text-gray-600 w-5 shrink-0">{index + 1}</span>
                  <FaExclamationTriangle className="text-red-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">{email.subject}</p>
                    <p className="text-xs text-gray-500 font-mono truncate mt-0.5">{email.sender}</p>
                  </div>
                  <span className="shrink-0 px-3 py-1 rounded-full text-xs font-medium bg-red-500/15 border border-red-500/30 text-red-400">
                    Moved to Spam
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}