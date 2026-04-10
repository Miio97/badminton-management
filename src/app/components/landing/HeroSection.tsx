import { motion } from "motion/react";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { landingService, LandingStats } from "../../../services/landingService";

interface HeroSectionProps {
  onBookNowClick: () => void;
}

export function HeroSection({ onBookNowClick }: HeroSectionProps) {
  const [stats, setStats] = useState<LandingStats | null>(null);

  useEffect(() => {
    landingService.getStats().then(setStats);
  }, []);

  return (
    <section id="home" className="relative pt-20 md:pt-24 pb-16 md:pb-24 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-slate-100 -z-10" />

      {/* Animated Background Elements */}
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
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-200/20 to-emerald-200/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-emerald-200/50 shadow-sm"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-slate-700">
                Đặt sân trực tuyến 24/7
              </span>
            </motion.div>

            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Đặt sân cầu lông{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  nhanh chóng, dễ dàng
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                Xem sân trống theo thời gian thực và đặt lịch chỉ trong vài bước.
                Trải nghiệm đặt sân hiện đại, tiện lợi cho mọi người chơi.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(16, 185, 129, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={onBookNowClick}
                className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Đặt ngay</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.a
                href="#courts"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-slate-200 text-slate-700 font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-all duration-300 flex items-center justify-center"
              >
                Xem sân trống
              </motion.a>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-4 pt-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-emerald-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-2xl font-bold">
                    {stats ? stats.totalCourts : <span className="inline-block w-6 h-5 bg-emerald-200 animate-pulse rounded" />}
                  </span>
                </div>
                <p className="text-sm text-slate-600">Sân thi đấu</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-emerald-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-2xl font-bold">{stats ? stats.openingHours : '...'}</span>
                </div>
                <p className="text-sm text-slate-600">Mở cửa/ngày</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-emerald-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-2xl font-bold">{stats ? stats.operatingDays : '...'}</span>
                </div>
                <p className="text-sm text-slate-600">Ngày/tuần</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-[2px] z-10" />

              <img
                src="/assets/images/court-vip.png"
                alt="Badminton Court VIP"
                className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover"
              />

              {/* Floating Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl border border-white/50 z-20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Sân trống hôm nay</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {stats ? `${stats.availableCourts}/${stats.totalCourts} sân` : 'Đang tải...'}
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-emerald-600" />
                  </div>
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
  );
}
