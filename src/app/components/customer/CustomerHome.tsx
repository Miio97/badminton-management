import { useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import { Calendar, Clock, ArrowRight, MapPin, Sparkles, History, Tag } from "lucide-react";
import { CourtAvailabilitySection } from "../landing/CourtAvailabilitySection";
import { PromotionsPreview } from "./PromotionsPreview";
import { BookingHistoryPreview } from "./BookingHistoryPreview";
import { ChatbotAssistant } from "./ChatbotAssistant";
import { Footer } from "../landing/Footer";

export function CustomerHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/customer/booking");
  };

  const quickStats = [
    { label: "Sân đã đặt", value: "12", icon: Calendar, color: "from-emerald-500 to-teal-600" },
    { label: "Giờ chơi", value: "24h", icon: Clock, color: "from-blue-500 to-cyan-600" },
    { label: "Điểm tích lũy", value: "450", icon: Sparkles, color: "from-purple-500 to-pink-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100">
      {/* Hero Section - Personalized */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content - Personalized Greeting */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Greeting */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-emerald-200/50 shadow-sm mb-4">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-slate-700">Chào mừng trở lại</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  Xin chào,{" "}
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {user?.fullName?.split(" ").slice(-1)[0] || "Bạn"}!
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed mt-4">
                  Sẵn sàng cho trận đấu tiếp theo? Xem sân trống và đặt lịch ngay hôm nay.
                </p>
              </motion.div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                {quickStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-lg"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                      <p className="text-xs text-slate-600">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(16, 185, 129, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBookNow}
                  className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Đặt sân ngay</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/customer/history")}
                  className="px-8 py-4 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-slate-200 text-slate-700 font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <History className="w-5 h-5" />
                  <span>Lịch sử</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Right Content - Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-[2px] z-10" />
                <img
                  src="/assets/images/court-vip.png"
                  alt="Badminton Court VIP"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />

                {/* Floating Card - Favorite Court */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl border border-white/50 z-20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 mb-1 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        Sân yêu thích của bạn
                      </p>
                      <p className="text-2xl font-bold text-emerald-600">Sân 7 - VIP</p>
                      <p className="text-sm text-slate-600 mt-1">Thường đặt: 18:00 - 20:00</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleBookNow}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm"
                    >
                      Đặt ngay
                    </motion.button>
                  </div>
                </motion.div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full blur-2xl opacity-50 -z-10" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-emerald-400 rounded-full blur-2xl opacity-50 -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Promotions Preview */}
      <PromotionsPreview />

      {/* Court Availability */}
      <CourtAvailabilitySection onBookClick={handleBookNow} />

      {/* Booking History Preview */}
      <BookingHistoryPreview />

      {/* Footer */}
      <Footer />

      {/* Chatbot Assistant */}
      <ChatbotAssistant />
    </div>
  );
}
