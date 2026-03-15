// // src/App.jsx
// import { useState } from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './pages/Login';
// import Register from "./pages/Register";
// import Dashboard from './pages/Dashboard';
// import Alerts from './pages/Alerts';
// import Settings from './pages/Settings';
// import ConnectEmail from './pages/ConnectEmail';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import './App.css';

// function ProtectedRoute({ children }) {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// }

// function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950/40 to-purple-950/30 text-gray-100">
//           <Routes>
//             <Route path="/login" element={<Login />} />
//             <Route path="/signup" element={<Register />} />
//             <Route
//               path="/"
//               element={
//                 <ProtectedRoute>
//                   <Dashboard />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/alerts"
//               element={
//                 <ProtectedRoute>
//                   <Alerts />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/connect"
//               element={
//                 <ProtectedRoute>
//                   <ConnectEmail />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/settings"
//               element={
//                 <ProtectedRoute>
//                   <Settings />
//                 </ProtectedRoute>
//               }
//             />
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </div>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import ConnectEmail from "./pages/ConnectEmail";
import Settings from "./pages/Settings";

import { AuthProvider, useAuth } from "./context/AuthContext";

import "./App.css";

function ProtectedRoute({ children }) {

  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {

  return (

    <Routes>

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/alerts"
        element={
          <ProtectedRoute>
            <Alerts />
          </ProtectedRoute>
        }
      />

      <Route
        path="/connect"
        element={
          <ProtectedRoute>
            <ConnectEmail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>

  );
}

function App() {

  return (

    <AuthProvider>

      <BrowserRouter>

        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950/40 to-purple-950/30 text-gray-100">

          <AppRoutes />

        </div>

      </BrowserRouter>

    </AuthProvider>

  );

}

export default App;