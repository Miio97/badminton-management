import { motion } from "motion/react";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Trang chủ", href: "#home" },
    { label: "Sân", href: "#courts" },
    { label: "Đặt lịch", href: "#booking" },
    { label: "Đánh giá", href: "#reviews" },
    { label: "Liên hệ", href: "#contact" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook", color: "hover:bg-blue-600" },
    { icon: Instagram, href: "#", label: "Instagram", color: "hover:bg-pink-600" },
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:bg-sky-600" },
    { icon: Youtube, href: "#", label: "Youtube", color: "hover:bg-red-600" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-teal-600/10 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 md:py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">BC</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Badminton Center</h3>
                <p className="text-sm text-slate-400">Đặt sân dễ dàng</p>
              </div>
            </motion.div>
            <p className="text-slate-400 leading-relaxed">
              Trung tâm cầu lông hàng đầu với cơ sở vật chất hiện đại và dịch vụ chuyên nghiệp.
            </p>
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2.5 rounded-lg bg-slate-800/50 hover:bg-emerald-600 transition-all duration-300 ${social.color}`}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Liên kết nhanh</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-emerald-400 transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{link.label}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Dịch vụ</h3>
            <ul className="space-y-2 text-slate-400">
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Đặt sân online
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 }}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Huấn luyện viên
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Tổ chức giải đấu
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Cửa hàng dụng cụ
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Thành viên VIP
              </motion.li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Liên hệ</h3>
            <ul className="space-y-3">
              <motion.li
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-start space-x-3 text-slate-400"
              >
                <MapPin className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  123 Đường Lê Lợi, Phường 1, Quận Gò Vấp, TP.HCM
                </span>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex items-center space-x-3 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
              >
                <Phone className="w-5 h-5 text-emerald-500" />
                <span className="text-sm">0123 456 789</span>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-3 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
              >
                <Mail className="w-5 h-5 text-emerald-500" />
                <span className="text-sm">contact@badmintoncenter.vn</span>
              </motion.li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700/50 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-slate-400 text-sm"
            >
              © {currentYear} Badminton Center. All rights reserved.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex space-x-6 text-sm text-slate-400"
            >
              <a href="#" className="hover:text-emerald-400 transition-colors">
                Chính sách bảo mật
              </a>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                Điều khoản sử dụng
              </a>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                Cookie
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
