// import { useState, useEffect, useRef } from "react";
// import { useAuth } from "../context/AuthContext";
// import { API_BASE_URL } from "../config";
// import {
//   FaBell,
//   FaShieldAlt,
//   FaExclamationTriangle,
//   FaTimes,
//   FaSpinner,
// } from "react-icons/fa";

// export default function NotificationBell() {
//   const { token } = useAuth();
//   const [open, setOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [expanded, setExpanded] = useState(null);
//   const [dismissed, setDismissed] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem("dismissed_notifs") || "[]");
//     } catch {
//       return [];
//     }
//   });
//   const panelRef = useRef(null);
//   const hasFetched = useRef(false);

//   useEffect(() => {
//     if (!token || hasFetched.current) return;
//     hasFetched.current = true;

//     async function fetchAlerts() {
//       setLoading(true);
//       try {
//         const res = await fetch(`${API_BASE_URL}/connect/scan`, {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!res.ok) return;
//         const data = await res.json();
//         const risky = (data.emails || []).filter(
//           (e) => e.category === "Phishing"
//         );
//         setNotifications(risky);
//       } catch {
//         // silently fail
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchAlerts();
//   }, [token]);

//   useEffect(() => {
//     function onOutside(e) {
//       if (panelRef.current && !panelRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     }
//     if (open) document.addEventListener("mousedown", onOutside);
//     return () => document.removeEventListener("mousedown", onOutside);
//   }, [open]);

//   function dismiss(id) {
//     const next = [...dismissed, id];
//     setDismissed(next);
//     localStorage.setItem("dismissed_notifs", JSON.stringify(next));
//     if (expanded === id) setExpanded(null);
//   }

//   function dismissAll() {
//     const ids = visible.map((n) => n.id);
//     const combined = [...dismissed, ...ids];
//     setDismissed(combined);
//     localStorage.setItem("dismissed_notifs", JSON.stringify(combined));
//     setExpanded(null);
//   }

//   const visible = notifications.filter((n) => !dismissed.includes(n.id));
//   const count = visible.length;

//   return (
//     <div className="relative" ref={panelRef}>
//       <button
//         onClick={() => setOpen((v) => !v)}
//         aria-label={`Notifications${count > 0 ? `, ${count} alerts` : ""}`}
//         className="relative p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800/60 transition-all duration-200 focus:outline-none"
//       >
//         {loading
//           ? <FaSpinner className="text-xl animate-spin" />
//           : <FaBell className="text-xl" />
//         }
//         {count > 0 && !loading && (
//           <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none ring-2 ring-gray-950 shadow-lg shadow-red-500/30">
//             {count > 9 ? "9+" : count}
//           </span>
//         )}
//       </button>

//       {open && (
//         <div
//           className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-700/60 bg-gray-900/95 backdrop-blur-sm z-50 overflow-hidden"
//           style={{ animation: "dropIn 0.15s ease-out" }}
//         >
//           {/* Header */}
//           <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/50">
//             <div className="flex items-center gap-2">
//               <FaShieldAlt className="text-blue-400 text-sm" />
//               <h2 className="text-sm font-semibold text-gray-100">Phishing Alerts</h2>
//               {count > 0 && (
//                 <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 font-medium">
//                   {count} phishing email{count > 1 ? "s" : ""}
//                 </span>
//               )}
//             </div>
//             {count > 0 && (
//               <button
//                 onClick={dismissAll}
//                 className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
//               >
//                 Clear all
//               </button>
//             )}
//           </div>

//           {/* Body */}
//           <div className="max-h-[420px] overflow-y-auto">
//             {loading && (
//               <div className="flex items-center justify-center py-10 gap-2 text-gray-500 text-sm">
//                 <FaSpinner className="animate-spin" /> Scanning inbox…
//               </div>
//             )}

//             {!loading && count === 0 && (
//               <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-600">
//                 <FaShieldAlt className="text-3xl opacity-30" />
//                 <p className="text-sm">No phishing emails detected</p>
//               </div>
//             )}

//             {!loading && visible.map((email) => {
//               const isExpanded = expanded === email.id;

//               return (
//                 <div key={email.id} className="border-b border-gray-800/60 last:border-0">
//                   {/* Row */}
//                   <div
//                     className="flex items-start gap-3 px-4 py-3 hover:bg-gray-800/40 transition-colors cursor-pointer"
//                     onClick={() => setExpanded(isExpanded ? null : email.id)}
//                   >
//                     <div className="mt-0.5 shrink-0 text-red-400">
//                       <FaExclamationTriangle className="text-sm" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-1.5 mb-0.5">
//                         <span className="text-[10px] font-semibold uppercase tracking-wide text-red-400">
//                           Phishing
//                         </span>
//                         <span className="text-[10px] text-gray-600">
//                           · Score: {Math.round(email.risk_score)}
//                         </span>
//                       </div>
//                       <p className="text-sm font-medium text-gray-200 truncate">{email.subject}</p>
//                       <p className="text-xs text-gray-500 truncate font-mono mt-0.5">{email.sender}</p>
//                     </div>
//                     <button
//                       onClick={(e) => { e.stopPropagation(); dismiss(email.id); }}
//                       className="shrink-0 text-gray-700 hover:text-gray-400 transition-colors mt-0.5"
//                       aria-label="Dismiss"
//                     >
//                       <FaTimes className="text-xs" />
//                     </button>
//                   </div>

//                   {/* Expanded detail */}
//                   {isExpanded && (
//                     <div className="mx-4 mb-3 rounded-xl px-3 py-2.5 text-xs space-y-2.5 bg-red-500/10 border border-red-500/25">
//                       <p className="font-semibold text-red-400">
//                         Why was this sent to Spam?
//                       </p>
//                       <div className="space-y-1">
//                         <div className="flex justify-between text-gray-400">
//                           <span>Risk score</span>
//                           <span className="font-mono">{Math.round(email.risk_score)} / 100</span>
//                         </div>
//                         <div className="w-full h-1.5 rounded-full bg-gray-800 overflow-hidden">
//                           <div
//                             className="h-full rounded-full bg-red-500 transition-all duration-500"
//                             style={{ width: `${Math.round(email.risk_score)}%` }}
//                           />
//                         </div>
//                       </div>
//                       <p className="text-gray-400 leading-relaxed">
//                         Our AI detected this email as{" "}
//                         <span className="text-red-400">a phishing attack</span>.
//                         It has been automatically moved to your Spam folder to protect you.
//                       </p>
//                       <p className="text-gray-600 italic">
//                         Check your Spam folder if you believe this was a mistake.
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>

//           {/* Footer */}
//           {count > 0 && (
//             <div className="border-t border-gray-700/50 px-4 py-2.5 text-center">
//               <button
//                 onClick={() => { setOpen(false); window.location.href = "/alerts"; }}
//                 className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
//               >
//                 View all in Alerts →
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       <style>{`
//         @keyframes dropIn {
//           from { opacity: 0; transform: translateY(-8px) scale(0.97); }
//           to   { opacity: 1; transform: translateY(0) scale(1); }
//         }
//       `}</style>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config";
import {
  FaBell,
  FaShieldAlt,
  FaExclamationTriangle,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";

export default function NotificationBell() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("dismissed_notifs") || "[]");
    } catch {
      return [];
    }
  });
  const panelRef = useRef(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!token || hasFetched.current) return;
    hasFetched.current = true;

    async function fetchAlerts() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/connect/scan`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        const risky = (data.emails || []).filter(
          (e) => e.category === "Phishing"
        );
        setNotifications(risky);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetchAlerts();
  }, [token]);

  useEffect(() => {
    function onOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  function dismiss(id) {
    const next = [...dismissed, id];
    setDismissed(next);
    localStorage.setItem("dismissed_notifs", JSON.stringify(next));
    if (expanded === id) setExpanded(null);
  }

  function dismissAll() {
    const ids = visible.map((n) => n.id);
    const combined = [...dismissed, ...ids];
    setDismissed(combined);
    localStorage.setItem("dismissed_notifs", JSON.stringify(combined));
    setExpanded(null);
  }

  const visible = notifications.filter((n) => !dismissed.includes(n.id));
  const count = visible.length;

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${count > 0 ? `, ${count} alerts` : ""}`}
        className="relative p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800/60 transition-all duration-200 focus:outline-none"
      >
        {loading
          ? <FaSpinner className="text-xl animate-spin" />
          : <FaBell className="text-xl" />
        }
        {count > 0 && !loading && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none ring-2 ring-gray-950 shadow-lg shadow-red-500/30">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-700/60 bg-gray-900/95 backdrop-blur-sm z-50 overflow-hidden"
          style={{ animation: "dropIn 0.15s ease-out" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/50">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-blue-400 text-sm" />
              <h2 className="text-sm font-semibold text-gray-100">Phishing Alerts</h2>
              {count > 0 && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 font-medium">
                  {count} phishing email{count > 1 ? "s" : ""}
                </span>
              )}
            </div>
            {count > 0 && (
              <button
                onClick={dismissAll}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Body */}
          <div className="max-h-[420px] overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-10 gap-2 text-gray-500 text-sm">
                <FaSpinner className="animate-spin" /> Scanning inbox…
              </div>
            )}

            {!loading && count === 0 && (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-600">
                <FaShieldAlt className="text-3xl opacity-30" />
                <p className="text-sm">No phishing emails detected</p>
              </div>
            )}

            {!loading && visible.map((email) => {
              const isExpanded = expanded === email.id;

              return (
                <div key={email.id} className="border-b border-gray-800/60 last:border-0">
                  {/* Row */}
                  <div
                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-800/40 transition-colors cursor-pointer"
                    onClick={() => setExpanded(isExpanded ? null : email.id)}
                  >
                    <div className="mt-0.5 shrink-0 text-red-400">
                      <FaExclamationTriangle className="text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-red-400">
                          Phishing
                        </span>
                        <span className="text-[10px] text-gray-600">
                          · Score: {Math.round(email.risk_score)}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-200 truncate">{email.subject}</p>
                      <p className="text-xs text-gray-500 truncate font-mono mt-0.5">{email.sender}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); dismiss(email.id); }}
                      className="shrink-0 text-gray-700 hover:text-gray-400 transition-colors mt-0.5"
                      aria-label="Dismiss"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="mx-4 mb-3 rounded-xl px-3 py-2.5 text-xs space-y-2.5 bg-red-500/10 border border-red-500/25">
                      <p className="font-semibold text-red-400">
                        Why was this sent to Spam?
                      </p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-gray-400">
                          <span>Risk score</span>
                          <span className="font-mono">{Math.round(email.risk_score)} / 100</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-gray-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-red-500 transition-all duration-500"
                            style={{ width: `${Math.round(email.risk_score)}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-gray-400 leading-relaxed">
                        Our AI detected this email as{" "}
                        <span className="text-red-400">a phishing attack</span>.
                        It has been automatically moved to your Spam folder to protect you.
                      </p>
                      <p className="text-gray-600 italic">
                        Check your Spam folder if you believe this was a mistake.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          {count > 0 && (
            <div className="border-t border-gray-700/50 px-4 py-2.5 text-center">
              <button
                onClick={() => { setOpen(false); navigate("/alerts", { state: { alerts: visible } }); }}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                View all in Alerts →
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}