// // src/components/Header.jsx
// import { useAuth } from '../context/AuthContext';
// import { LogOut, User, Bell } from 'lucide-react';
// import NotificationBell from "./NotificationBell";

// export default function Header() {
//   const { user, logout } = useAuth();

//   return (
//     <header className="bg-gray-900 border-b border-gray-800 h-16 flex items-center px-6 justify-between sticky top-0 z-10">
//       <div className="flex items-center gap-3">
//         <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
//           PhishGuard
//         </div>
//         <span className="text-gray-400 text-sm">Dashboard</span>
//       </div>

//       <div className="flex items-center gap-5">
//         <button className="relative p-2 text-gray-400 hover:text-gray-200 transition-colors">
//           <Bell size={20} />
//           <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//         </button>

//         <div className="flex items-center gap-3">
//           <div className="text-right">
//             <div className="text-sm font-medium">{user?.email || 'User'}</div>
//             <div className="text-xs text-gray-500">Security User</div>
//           </div>
//           <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-semibold">
//             {user?.email?.[0]?.toUpperCase() || 'U'}
//           </div>
//           <button
//             onClick={logout}
//             className="p-2 text-gray-400 hover:text-red-400 transition-colors"
//             title="Logout"
//           >
//             <LogOut size={20} />
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// }


// src/components/Header.jsx
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import NotificationBell from "./NotificationBell";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-900 border-b border-gray-800 h-16 flex items-center px-6 justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          PhishGuard
        </div>
        <span className="text-gray-400 text-sm">Dashboard</span>
      </div>

      <div className="flex items-center gap-5">

        {/* ✅ Replaced old Bell button with NotificationBell */}
        <NotificationBell />

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium">{user?.email || 'User'}</div>
            <div className="text-xs text-gray-500">Security User</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-semibold">
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}