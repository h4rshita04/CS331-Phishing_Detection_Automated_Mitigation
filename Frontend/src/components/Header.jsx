import { useAuth } from '../context/AuthContext';
import { LogOut, Bell } from 'lucide-react';

import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function Header() {
  const { user, logout } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    const res = await axios.get(`${API_BASE_URL}/notifications/`);
    setNotifications(res.data);
  };

  const fetchUnread = async () => {
    const res = await axios.get(`${API_BASE_URL}/notifications/unread`);
    setUnreadCount(res.data.count);
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnread();
  }, []);

  const markAsRead = async (id) => {
    await axios.post(`${API_BASE_URL}/notifications/read/${id}`);
    fetchNotifications();
    fetchUnread();
  };

  // ✅ FIXED TIME FUNCTION (UTC → Local)
  const formatTime = (dateString) => {
    const date = new Date(dateString + "Z");
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 h-16 flex items-center px-6 justify-between sticky top-0 z-10">
      
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          PhishGuard
        </div>
        <span className="text-gray-400 text-sm">Dashboard</span>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-5">

        {/* 🔔 NOTIFICATION */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="relative p-2 text-gray-400 hover:text-gray-200 transition-colors"
          >
            <Bell size={20} />

            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50 border border-gray-200">

              {/* HEADER */}
              <div className="px-4 py-2 border-b font-semibold text-gray-700">
                Notifications
              </div>

              {/* LIST */}
              <div className="divide-y">

                {notifications.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500 text-center">
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`p-3 cursor-pointer transition-all duration-200
                        hover:bg-gray-100
                        ${n.is_read ? "bg-white" : "bg-blue-50"}
                      `}
                    >

                      {/* SUBJECT + TIME */}
                      <div className="flex justify-between text-sm font-semibold">
                        <span className="truncate text-gray-800">
                          {n.subject}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(n.created_at)}
                        </span>
                      </div>

                      {/* SENDER */}
                      <div className="text-xs text-gray-500 mt-1 truncate">
                        {n.sender}
                      </div>

                      {/* ACTION */}
                      <div className="text-sm text-red-500 mt-1">
                        {n.action}
                      </div>

                    </div>
                  ))
                )}

              </div>

              {/* FOOTER */}
              <div className="text-center text-xs text-gray-500 py-2 border-t">
                Click to mark as read
              </div>

            </div>
          )}
        </div>

        {/* USER INFO */}
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