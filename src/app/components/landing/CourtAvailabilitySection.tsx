import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, MapPin, ArrowRight, Filter } from "lucide-react";
import { landingService, CourtStat } from "../../../services/landingService";

interface CourtAvailabilitySectionProps {
  onBookClick: () => void;
}

export function CourtAvailabilitySection({ onBookClick }: CourtAvailabilitySectionProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedTime, setSelectedTime] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [courts, setCourts] = useState<CourtStat[]>([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<string[]>(["Tất cả"]);

  useEffect(() => {
    setLoading(true);
    landingService.getPublicCourts(selectedDate)
      .then(data => {
        setCourts(data);
        // Extract unique types from data
        const types = Array.from(new Set(data.map(c => c.type)));
        setCategories(["Tất cả", ...types]);
      })
      .finally(() => setLoading(false));
  }, [selectedDate]);

  const filteredCourts = courts.filter(court => {
    // Filter by type
    if (selectedType !== "all" && selectedType !== "Tất cả") {
      if (court.type !== selectedType) return false;
    }

    // Filter by time slot
    if (selectedTime !== "all") {
      const morningSlots = ["06:00", "08:00", "10:00"];
      const afternoonSlots = ["14:00", "16:00"];
      const eveningSlots = ["18:00", "20:00"];

      let relevantSlots: string[] = [];
      if (selectedTime === "morning") relevantSlots = morningSlots;
      else if (selectedTime === "afternoon") relevantSlots = afternoonSlots;
      else if (selectedTime === "evening") relevantSlots = eveningSlots;

      const hasAvailableSlot = court.timeSlots.some(slot => 
        relevantSlots.includes(slot.time) && slot.available
      );
      
      if (!hasAvailableSlot) return false;
    }

    return true;
  });

  return (
    <section id="courts" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 mb-4">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Sân trống</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Chọn sân phù hợp với bạn
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Xem tình trạng sân theo thời gian thực và đặt ngay khung giờ yêu thích
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/30 border border-slate-200/50"
        >
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-slate-700">
                <Calendar className="w-4 h-4" />
                <span>Chọn ngày</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-slate-700">
                <Clock className="w-4 h-4" />
                <span>Khung giờ</span>
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white"
              >
                <option value="all">Tất cả khung giờ</option>
                <option value="morning">Sáng (6h-12h)</option>
                <option value="afternoon">Chiều (12h-18h)</option>
                <option value="evening">Tối (18h-22h)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-slate-700">
                <Filter className="w-4 h-4" />
                <span>Loại sân</span>
              </label>
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat === "Tất cả" ? "all" : cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Courts Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        ) : filteredCourts.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-500">Không tìm thấy sân nào phù hợp với bộ lọc của bạn.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourts.map((court, index) => (
              <motion.div
                key={court.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group"
              >
                <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300">
                  {/* Court Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={court.image}
                      alt={court.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
                          court.status === "available"
                            ? "bg-emerald-500/90 text-white"
                            : "bg-slate-500/90 text-white"
                        }`}
                      >
                        {court.status === "available" ? "Còn trống" : "Đã đặt"}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="absolute bottom-4 left-4">
                      <p className="text-white font-bold text-xl">{court.price}</p>
                    </div>
                  </div>

                  {/* Court Info */}
                  <div className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-slate-900">{court.name}</h3>
                      <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                        {court.type}
                      </span>
                    </div>

                    {/* Time Slots */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-600">Khung giờ trống:</p>
                      <div className="flex flex-wrap gap-2">
                        {court.timeSlots.map((slot, i) => (
                          <span
                            key={i}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              slot.available
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-400 border border-slate-200 line-through"
                            }`}
                          >
                            {slot.time}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Book Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onBookClick}
                      disabled={court.status === "booked"}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                        court.status === "available"
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      <span>{court.status === "available" ? "Đặt sân" : "Đã đầy"}</span>
                      {court.status === "available" && <ArrowRight className="w-4 h-4" />}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
