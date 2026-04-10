import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export function Navbar({ onLoginClick, onRegisterClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Trang chủ", href: "#home" },
    { label: "Sân", href: "#courts" },
    { label: "Đặt lịch", href: "#booking" },
    { label: "Đánh giá", href: "#reviews" },
    { label: "Liên hệ", href: "#contact" },
  ];

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
            className="flex items-center space-x-3"
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
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                className="px-4 py-2 rounded-lg text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all duration-200 font-medium"
              >
                {item.label}
              </motion.a>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
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
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-slate-200/50"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-slate-700 hover:bg-emerald-50/50 hover:text-emerald-600 transition-all duration-200 font-medium"
              >
                {item.label}
              </a>
            ))}
            <div className="flex flex-col space-y-2 mt-4 px-4">
              <button
                onClick={() => {
                  onLoginClick();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-5 py-2.5 rounded-xl border-2 border-slate-300 text-slate-700 hover:border-emerald-500 hover:text-emerald-600 transition-all duration-200 font-medium"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => {
                  onRegisterClick();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium shadow-lg"
              >
                Đăng ký
              </button>
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
}
