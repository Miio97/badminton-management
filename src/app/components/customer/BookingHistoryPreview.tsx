import { motion } from "motion/react";
import { History, Calendar, Clock, MapPin, ArrowRight, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface Booking {
  id: string;
  courtName: string;
  date: string;
  time: string;
  duration: number;
  totalPrice: number;
  status: "completed" | "cancelled" | "upcoming";
}

export function BookingHistoryPreview() {
  const navigate = useNavigate();

  const recentBookings: Booking[] = [
    {
      id: "1",
      courtName: "Sân 7 - VIP",
      date: "2026-04-02",
      time: "18:00",
      duration: 2,
      totalPrice: 300000,
      status: "completed",
    },
    {
      id: "2",
      courtName: "Sân 3",
      date: "2026-03-28",
      time: "19:00",
      duration: 1,
      totalPrice: 120000,
      status: "completed",
    },
    {
      id: "3",
      courtName: "Sân 1",
      date: "2026-03-25",
      time: "20:00",
      duration: 2,
      totalPrice: 200000,
      status: "cancelled",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700">Hoàn thành</span>
          </div>
        );
      case "cancelled":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200">
            <XCircle className="w-4 h-4 text-red-600" />
            <span className="text-xs font-semibold text-red-700">Đã hủy</span>
          </div>
        );
      case "upcoming":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700">Sắp tới</span>
          </div>
        );
    }
  };

  const handleRebook = (booking: Booking) => {
    toast.success(`Đang chuẩn bị đặt lại ${booking.courtName}...`);
    navigate("/customer/booking");
  };

  return (
    <section className="py-16 md:py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-blue-200 shadow-sm mb-4">
              <History className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Lịch sử</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Đặt sân{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                gần đây
              </span>
            </h2>
            <p className="text-lg text-slate-600 mt-2">
              Xem lại các lần đặt sân trước đây và đặt lại nhanh chóng
            </p>
          </div>

          <motion.button
            whileHover={{ x: 5 }}
            onClick={() => navigate("/customer/history")}
            className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            Xem tất cả
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Bookings List */}
        <div className="space-y-4">
          {recentBookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ x: 4, transition: { duration: 0.2 } }}
              className="group p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Booking Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                        {booking.courtName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>{new Date(booking.date).toLocaleDateString("vi-VN")}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>
                            {booking.time} ({booking.duration}h)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="md:hidden">{getStatusBadge(booking.status)}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text">
                      {booking.totalPrice.toLocaleString()}đ
                    </span>
                    <div className="hidden md:block">{getStatusBadge(booking.status)}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {booking.status === "completed" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRebook(booking)}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span className="hidden sm:inline">Đặt lại</span>
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/customer/history")}
                    className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-all duration-200"
                  >
                    Chi tiết
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/customer/history")}
          className="md:hidden w-full mt-6 px-6 py-3 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-slate-200 text-slate-700 font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
        >
          Xem tất cả lịch sử
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </section>
  );
}
