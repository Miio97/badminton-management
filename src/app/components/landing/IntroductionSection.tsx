import { motion } from "motion/react";
import { Building2, Clock, Users, Shield, Zap, Award } from "lucide-react";

export function IntroductionSection() {
  const features = [
    {
      icon: Building2,
      title: "12 Sân chất lượng",
      description: "Sân tiêu chuẩn thi đấu với sàn gỗ chuyên dụng và chiều cao tối ưu",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Clock,
      title: "Mở cửa 6h - 24h",
      description: "Phục vụ suốt cả ngày, linh hoạt theo lịch trình của bạn",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Users,
      title: "Huấn luyện viên",
      description: "Đội ngũ HLV chuyên nghiệp, hỗ trợ training từ cơ bản đến nâng cao",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: Shield,
      title: "An toàn & Sạch sẽ",
      description: "Vệ sinh sau mỗi trận đấu, không gian thoáng mát, an toàn",
      color: "from-orange-500 to-red-600",
    },
    {
      icon: Zap,
      title: "Đặt sân nhanh",
      description: "Hệ thống đặt sân trực tuyến, thanh toán dễ dàng trong 30 giây",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Award,
      title: "Ưu đãi thành viên",
      description: "Chương trình khuyến mãi hấp dẫn cho khách hàng thân thiết",
      color: "from-yellow-500 to-orange-600",
    },
  ];

  return (
    <section id="intro" className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white border border-emerald-200 shadow-sm mb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium text-emerald-700">Về chúng tôi</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Tại sao chọn{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Badminton Center
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Trung tâm cầu lông hiện đại nhất khu vực với cơ sở vật chất đẳng cấp và dịch vụ chuyên nghiệp
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group"
              >
                <div className="relative h-full p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                  {/* Icon */}
                  <div className="relative mb-4">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl"
        >
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <motion.p
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-4xl md:text-5xl font-bold text-white"
              >
                5+
              </motion.p>
              <p className="text-emerald-100">Năm kinh nghiệm</p>
            </div>
            <div className="space-y-2">
              <motion.p
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-4xl md:text-5xl font-bold text-white"
              >
                10k+
              </motion.p>
              <p className="text-emerald-100">Khách hàng</p>
            </div>
            <div className="space-y-2">
              <motion.p
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-4xl md:text-5xl font-bold text-white"
              >
                50k+
              </motion.p>
              <p className="text-emerald-100">Lượt đặt sân</p>
            </div>
            <div className="space-y-2">
              <motion.p
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="text-4xl md:text-5xl font-bold text-white"
              >
                4.9/5
              </motion.p>
              <p className="text-emerald-100">Đánh giá trung bình</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
