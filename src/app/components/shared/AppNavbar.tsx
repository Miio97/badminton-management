import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Bell, User, LogOut, History, ChevronDown } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router";

interface AppNavbarProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

export function AppNavbar({ onLoginClick, onRegisterClick }: AppNavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Trang chủ", href: user ? "/customer" : "#home" },
    { label: "Đặt lịch", href: user ? "/customer/booking" : "#courts" },
    { label: "Đánh giá", href: user ? "/customer/feedback" : "#reviews" },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith("#")) {
      // Scroll to section on homepage
      if (location.pathname !== "/") {
        // Navigate to homepage first, then scroll
        navigate("/");
        setTimeout(() => {
          document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(href);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate("/");
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-slate-200/50"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate(user ? "/customer" : "/")}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">BC</span>
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Badminton Center
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                onClick={() => handleNavClick(item.href)}
                className="px-4 py-2 rounded-lg text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all duration-200 font-medium"
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Desktop Auth/User Section */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                {/* Notification Bell */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <Bell className="w-5 h-5 text-slate-600" />
                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </motion.button>

                {/* User Menu */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 transition-all duration-200"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg">
                      {(user.fullName || user.username || "?").charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-700">{(user.fullName || user.username || "").split(" ").slice(-1)[0]}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isUserMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <>
                        {/* Backdrop */}
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsUserMenuOpen(false)}
                        />

                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200/50 z-50"
                        >
                          <div className="p-3">
                            <div className="px-3 py-2 mb-2 border-b border-slate-200">
                              <p className="text-sm font-semibold text-slate-900">{user.fullName || user.username}</p>
                              <p className="text-xs text-slate-500">Khách hàng</p>
                            </div>

                            <button
                              onClick={() => {
                                navigate("/customer/account");
                                setIsUserMenuOpen(false);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-emerald-50 transition-colors text-left"
                            >
                              <User className="w-4 h-4 text-slate-600" />
                              <span className="text-sm font-medium text-slate-700">Thông tin cá nhân</span>
                            </button>

                            <button
                              onClick={() => {
                                navigate("/customer/history");
                                setIsUserMenuOpen(false);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-emerald-50 transition-colors text-left"
                            >
                              <History className="w-4 h-4 text-slate-600" />
                              <span className="text-sm font-medium text-slate-700">Lịch sử đặt sân</span>
                            </button>

                            <div className="my-2 border-t border-slate-200" />

                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors text-left"
                            >
                              <LogOut className="w-4 h-4 text-red-600" />
                              <span className="text-sm font-medium text-red-600">Đăng xuất</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onLoginClick}
                  className="px-5 py-2.5 rounded-xl border-2 border-slate-300 text-slate-700 hover:border-emerald-500 hover:text-emerald-600 transition-all duration-200 font-medium"
                >
                  Đăng nhập
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -10px rgba(16, 185, 129, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onRegisterClick}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Đăng ký
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-slate-200/50"
            >
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="block w-full text-left px-4 py-3 rounded-lg text-slate-700 hover:bg-emerald-50/50 hover:text-emerald-600 transition-all duration-200 font-medium"
                >
                  {item.label}
                </button>
              ))}

              {user ? (
                <div className="mt-4 pt-4 border-t border-slate-200/50">
                  <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                      {(user.fullName || user.username || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{user.fullName || user.username}</p>
                      <p className="text-xs text-slate-500">Khách hàng</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      navigate("/customer/account");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-50/50 transition-colors text-left"
                  >
                    <User className="w-5 h-5 text-slate-600" />
                    <span className="font-medium text-slate-700">Thông tin cá nhân</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate("/customer/history");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-50/50 transition-colors text-left"
                  >
                    <History className="w-5 h-5 text-slate-600" />
                    <span className="font-medium text-slate-700">Lịch sử đặt sân</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors text-left mt-2"
                  >
                    <LogOut className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-600">Đăng xuất</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 mt-4 px-4">
                  <button
                    onClick={() => {
                      onLoginClick?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-5 py-2.5 rounded-xl border-2 border-slate-300 text-slate-700 hover:border-emerald-500 hover:text-emerald-600 transition-all duration-200 font-medium"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => {
                      onRegisterClick?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium shadow-lg"
                  >
                    Đăng ký
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
