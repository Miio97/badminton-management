import { motion } from "motion/react";
import { Tag, Clock, ArrowRight, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router";

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: string;
  expiryDate: string;
  badge?: "HOT" | "NEW";
  color: string;
}

export function PromotionsPreview() {
  const navigate = useNavigate();

  const promotions: Promotion[] = [
    {
      id: "1",
      title: "Giảm 20% giờ vàng",
      description: "Đặt sân từ 18:00 - 20:00 hưởng ưu đãi đặc biệt",
      discount: "20%",
      expiryDate: "31/05/2026",
      badge: "HOT",
      color: "from-orange-500 to-red-600",
    },
    {
      id: "2",
      title: "Khách hàng mới",
      description: "Giảm 50% cho lần đặt sân đầu tiên",
      discount: "50%",
      expiryDate: "30/06/2026",
      badge: "NEW",
      color: "from-emerald-500 to-teal-600",
    },
    {
      id: "3",
      title: "Combo 5 giờ",
      description: "Mua gói 5 giờ, tặng thêm 1 giờ miễn phí",
      discount: "+1h",
      expiryDate: "15/05/2026",
      color: "from-blue-500 to-cyan-600",
    },
    {
      id: "4",
      title: "Cuối tuần vui vẻ",
      description: "Giảm 15% cho tất cả sân vào thứ 7 & chủ nhật",
      discount: "15%",
      expiryDate: "31/12/2026",
      color: "from-purple-500 to-pink-600",
    },
  ];

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
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-emerald-200 shadow-sm mb-4">
              <Tag className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Khuyến mãi</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Ưu đãi{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                dành cho bạn
              </span>
            </h2>
            <p className="text-lg text-slate-600 mt-2">
              Tiết kiệm thêm khi đặt sân với các chương trình khuyến mãi hấp dẫn
            </p>
          </div>

          <motion.button
            whileHover={{ x: 5 }}
            onClick={() => navigate("/customer/promotions")}
            className="hidden md:flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            Xem tất cả
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Promotions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {promotions.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative"
            >
              <div className="h-full p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${promo.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                {/* Badge */}
                {promo.badge && (
                  <div className="absolute top-4 right-4">
                    <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${promo.color} shadow-lg`}>
                      <span className="text-white text-xs font-bold flex items-center gap-1">
                        {promo.badge === "HOT" ? <Zap className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                        {promo.badge}
                      </span>
                    </div>
                  </div>
                )}

                {/* Discount Badge */}
                <div className="relative mb-4">
                  <div className={`inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br ${promo.color} shadow-lg items-center justify-center`}>
                    <span className="text-white font-bold text-lg">{promo.discount}</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  {promo.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{promo.description}</p>

                {/* Expiry */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                  <Clock className="w-4 h-4" />
                  <span>Hết hạn: {promo.expiryDate}</span>
                </div>

                {/* Apply Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-2.5 rounded-xl bg-gradient-to-r ${promo.color} text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200`}
                >
                  Áp dụng ngay
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/customer/promotions")}
          className="md:hidden w-full mt-6 px-6 py-3 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-slate-200 text-slate-700 font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-all duration-300 flex items-center justify-center gap-2"
        >
          Xem tất cả khuyến mãi
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </section>
  );
}
