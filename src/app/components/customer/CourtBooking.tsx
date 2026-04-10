import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar as CalendarIcon,
  Clock,
  X,
  Check,
  DollarSign,
  Wallet,
  CreditCard,
  Banknote,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { Footer } from "../landing/Footer";
import { landingService, CourtStat } from "../../../services/landingService";
import { bookingService } from "../../../services/bookingService";
import { useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";

interface Court {
  id: number;
  name: string;
  price: number;
  status: "available" | "booked" | "playing";
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const mockCourts: Court[] = []; // Will be populated from API

const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 6; hour <= 22; hour++) {
    const time = `${hour.toString().padStart(2, "0")}:00`;
    const available = Math.random() > 0.3;
    slots.push({ time, available });
  }
  return slots;
};

export function CourtBooking() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [timeSlots] = useState(generateTimeSlots());
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCourts = useCallback(() => {
    setIsLoading(true);
    landingService.getPublicCourts(selectedDate)
      .then((data: CourtStat[]) => {
        const mappedCourts: Court[] = data.map(c => ({
          id: parseInt(c.id),
          name: c.name,
          price: parseInt(c.price.replace(/\D/g, '')) || 100000,
          status: c.status === "booked" ? "booked" : (c.status === "maintenance" ? "playing" : "available")
        }));
        setCourts(mappedCourts);
      })
      .catch(err => {
        console.error("Failed to fetch courts for booking:", err);
        toast.error("Không thể tải danh sách sân");
      })
      .finally(() => setIsLoading(false));
  }, [selectedDate]);

  useEffect(() => {
    fetchCourts();
  }, [fetchCourts]);

  // Form state
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [duration, setDuration] = useState(1);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const handleCourtSelect = (court: Court) => {
    if (court.status === "available" && selectedTime) {
      setSelectedCourt(court);
      setShowBookingModal(true);
    }
  };

  const getCourtStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-emerald-50/50 border-emerald-200 hover:border-emerald-400 hover:shadow-lg";
      case "booked":
        return "bg-yellow-50/50 border-yellow-200";
      case "playing":
        return "bg-red-50/50 border-red-200";
      default:
        return "bg-slate-50 border-slate-200";
    }
  };

  const getCourtStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold rounded-full shadow-sm">
            Trống
          </span>
        );
      case "booked":
        return (
          <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-semibold rounded-full shadow-sm">
            Đã đặt
          </span>
        );
      case "playing":
        return (
          <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-semibold rounded-full shadow-sm">
            Đang chơi
          </span>
        );
      default:
        return null;
    }
  };

  const calculateTotal = () => {
    if (!selectedCourt) return 0;
    return selectedCourt.price * duration;
  };

  const calculateDeposit = () => {
    return calculateTotal() * 0.3;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourt || !selectedTime) {
      toast.error("Thiếu thông tin sân hoặc khung giờ");
      return;
    }

    setIsSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      await bookingService.addBooking({
        customerName: customerName || user.fullName || "Khách vãng lai",
        phone: phone || "0000000000",
        courtName: selectedCourt.name,
        courtId: selectedCourt.id,
        customerId: user.profileId,
        date: selectedDate,
        time: selectedTime,
        deposit: calculateDeposit(),
        duration: duration,
      });

      toast.success("Đặt sân thành công! Vui lòng thanh toán tiền cọc.");
      setShowBookingModal(false);
      
      // Reset form
      setCustomerName("");
      setPhone("");
      setEmail("");
      setDuration(1);
      setNotes("");
      setSelectedCourt(null);
      
      // Refresh database data
      fetchCourts();
    } catch (error: any) {
      console.error("Booking error:", error);
      const msg = error.response?.data?.error || "Không thể đặt sân, vui lòng thử lại sau";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="pt-24 md:pt-32 pb-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
          Đặt sân cầu lông
        </h2>
        <p className="text-slate-600 text-lg">Chọn ngày, giờ và sân để đặt lịch chơi</p>
      </motion.div>

      {/* Date & Time Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-6 mb-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Date Selection */}
          <div>
            <label className="flex items-center gap-2 font-semibold text-slate-700 mb-3">
              <CalendarIcon className="w-5 h-5 text-emerald-600" />
              Chọn ngày
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-lg"
            />
          </div>

          {/* Time Selection */}
          <div>
            <label className="flex items-center gap-2 font-semibold text-slate-700 mb-3">
              <Clock className="w-5 h-5 text-emerald-600" />
              Chọn giờ
            </label>
            <div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto p-1">
              {timeSlots.map((slot) => (
                <motion.button
                  key={slot.time}
                  whileHover={slot.available ? { scale: 1.05 } : {}}
                  whileTap={slot.available ? { scale: 0.95 } : {}}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedTime === slot.time
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                      : slot.available
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "bg-slate-50 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {slot.time}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {selectedTime && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl"
          >
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600" />
              <p className="text-slate-700 font-medium">
                Đã chọn: {new Date(selectedDate).toLocaleDateString("vi-VN")} lúc {selectedTime}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Court Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-6"
      >
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-emerald-600" />
          Chọn sân {!selectedTime && <span className="text-sm font-normal text-slate-500">(Vui lòng chọn giờ trước)</span>}
        </h3>

        {!selectedTime ? (
          <div className="text-center py-16">
            <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">Vui lòng chọn ngày và giờ để xem các sân có sẵn</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Đang tải danh sách sân...</p>
              </div>
            ) : courts.length > 0 ? (
              courts.map((court, index) => (
                <motion.button
                  key={court.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={court.status === "available" ? { y: -4, transition: { duration: 0.2 } } : {}}
                  onClick={() => handleCourtSelect(court)}
                  disabled={court.status !== "available"}
                  className={`p-5 rounded-2xl border-2 transition-all ${getCourtStatusColor(
                    court.status
                  )} ${
                    court.status === "available"
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-bold text-slate-800">{court.name}</h4>
                    {getCourtStatusBadge(court.status)}
                  </div>
                  <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text mb-1">
                    {court.price.toLocaleString()}đ
                  </p>
                  <p className="text-xs text-slate-600 font-medium">/ giờ</p>
                </motion.button>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-slate-500">Không có sân nào trống trong khung giờ này.</p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 flex flex-wrap items-center gap-4 md:gap-6 text-sm"
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-100 border-2 border-emerald-300 rounded"></div>
          <span className="text-slate-600 font-medium">Trống</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
          <span className="text-slate-600 font-medium">Đã đặt</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
          <span className="text-slate-600 font-medium">Đang chơi</span>
        </div>
      </motion.div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && selectedCourt && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">Xác nhận đặt sân</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {selectedCourt.name} - {new Date(selectedDate).toLocaleDateString("vi-VN")} lúc{" "}
                    {selectedTime}
                  </p>
                </div>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-2">
                      Họ tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                      placeholder="0901234567"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-2">
                      Số giờ chơi <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                    >
                      {[1, 2, 3, 4, 5].map((h) => (
                        <option key={h} value={h}>
                          {h} giờ
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-2">Ghi chú</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all resize-none"
                      placeholder="Thêm ghi chú cho đơn đặt sân..."
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-3">
                      Phương thức thanh toán <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPaymentMethod("cash")}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === "cash"
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              paymentMethod === "cash"
                                ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                                : "bg-slate-100"
                            }`}
                          >
                            <Banknote
                              className={`w-6 h-6 ${
                                paymentMethod === "cash" ? "text-white" : "text-slate-600"
                              }`}
                            />
                          </div>
                          <span
                            className={`text-sm font-semibold ${
                              paymentMethod === "cash" ? "text-emerald-600" : "text-slate-700"
                            }`}
                          >
                            Tiền mặt
                          </span>
                        </div>
                      </motion.button>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPaymentMethod("bank_transfer")}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === "bank_transfer"
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              paymentMethod === "bank_transfer"
                                ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                                : "bg-slate-100"
                            }`}
                          >
                            <Wallet
                              className={`w-6 h-6 ${
                                paymentMethod === "bank_transfer" ? "text-white" : "text-slate-600"
                              }`}
                            />
                          </div>
                          <span
                            className={`text-sm font-semibold ${
                              paymentMethod === "bank_transfer" ? "text-emerald-600" : "text-slate-700"
                            }`}
                          >
                            Chuyển khoản
                          </span>
                        </div>
                      </motion.button>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPaymentMethod("credit_card")}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === "credit_card"
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              paymentMethod === "credit_card"
                                ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                                : "bg-slate-100"
                            }`}
                          >
                            <CreditCard
                              className={`w-6 h-6 ${
                                paymentMethod === "credit_card" ? "text-white" : "text-slate-600"
                              }`}
                            />
                          </div>
                          <span
                            className={`text-sm font-semibold ${
                              paymentMethod === "credit_card" ? "text-emerald-600" : "text-slate-700"
                            }`}
                          >
                            Thẻ tín dụng
                          </span>
                        </div>
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 mb-6 border border-emerald-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium">Giá sân ({duration} giờ)</span>
                      <span className="font-bold text-slate-800 text-lg">
                        {calculateTotal().toLocaleString()}đ
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-emerald-200 pt-3">
                      <span className="text-slate-700 flex items-center gap-2 font-semibold">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                        Tiền cọc (30%)
                      </span>
                      <span className="font-bold text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-2xl">
                        {calculateDeposit().toLocaleString()}đ
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-4">
                    * Vui lòng thanh toán tiền cọc để xác nhận đặt sân
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all"
                  >
                    Hủy
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.02, boxShadow: "0 10px 30px -10px rgba(16, 185, 129, 0.4)" } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Check className="w-5 h-5" />
                    )}
                    {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt sân"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
