import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { LogOut, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { LucideIcon } from "lucide-react";

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface SharedDashboardLayoutProps {
  navigation: NavigationItem[];
  roleLabel: string;
}

export function SharedDashboardLayout({ navigation, roleLabel }: SharedDashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Modern Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-slate-900 border-r border-slate-800 flex flex-col relative"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800">
          {!isCollapsed ? (
            <div>
              <h1 className="text-lg font-bold text-white">
                Badminton Center
              </h1>
              <p className="text-xs text-slate-400 mt-1">{roleLabel}</p>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-sm">BC</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-emerald-400" : ""}`} />
                    {!isCollapsed && (
                      <span className="font-medium text-sm">{item.name}</span>
                    )}
                    {isActive && !isCollapsed && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-1.5 h-1.5 bg-emerald-400 rounded-full"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-800">
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors ${
                  isCollapsed ? "justify-center" : ""
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {(user.fullName || user.username || "?").charAt(0).toUpperCase()}
                </div>
                {!isCollapsed && (
                  <>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-sm text-white truncate">
                        {user.fullName || user.username}
                      </p>
                      <p className="text-xs text-slate-400 capitalize">{roleLabel}</p>
                    </div>
                  </>
                )}
              </button>

              {/* User Dropdown */}
              <AnimatePresence>
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute ${isCollapsed ? "left-full ml-2" : "bottom-full mb-2"} ${isCollapsed ? "left-0" : "left-0 right-0"} bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-700 z-50`}
                    >
                      <Link
                        to={`/${user.role}/account`}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition-colors text-sm text-slate-300"
                      >
                        <User className="w-4 h-4" />
                        <span>Tài khoản</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition-colors text-sm text-slate-300 border-t border-slate-700"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full mt-3 flex items-center justify-center p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span className="ml-2 text-xs">Thu gọn</span>
              </>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
