import { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { toast } from "sonner";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Tin nhắn đã được gửi! Chúng tôi sẽ liên hệ lại sớm.");
    setFormData({ name: "", phone: "", message: "" });
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white border border-emerald-200 shadow-sm mb-4">
            <Mail className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Liên hệ</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Hãy liên hệ với chúng tôi
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Có câu hỏi hoặc cần tư vấn? Chúng tôi luôn sẵn sàng hỗ trợ bạn
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Info Cards */}
            <div className="space-y-4">
              <motion.div
                whileHover={{ x: 8 }}
                className="flex items-start space-x-4 p-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/50 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Địa chỉ</h3>
                  <p className="text-slate-600">
                    123 Đường Lê Lợi, Phường 1, Quận Gò Vấp<br />
                    Thành phố Hồ Chí Minh, Việt Nam
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 8 }}
                className="flex items-start space-x-4 p-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/50 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Điện thoại</h3>
                  <p className="text-slate-600">
                    Hotline: 0123 456 789<br />
                    Zalo: 0987 654 321
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 8 }}
                className="flex items-start space-x-4 p-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/50 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
                  <p className="text-slate-600">
                    contact@badmintoncenter.vn<br />
                    support@badmintoncenter.vn
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 8 }}
                className="flex items-start space-x-4 p-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/50 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Giờ mở cửa</h3>
                  <p className="text-slate-600">
                    Thứ 2 - Chủ nhật: 6:00 - 24:00<br />
                    Ngày lễ: Liên hệ trước
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-2xl overflow-hidden shadow-xl border border-slate-200"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4542802327985!2d106.68335731533373!3d10.847273360912793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528b2747a81a3%3A0x33c1813055acb613!2zR8OyIFbhuqVwLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1629789012345!5m2!1svi!2s"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Badminton Center Location"
              />
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-2xl space-y-6">
              <div className="space-y-2">
                <label className="block font-medium text-slate-700">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-medium text-slate-700">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0123 456 789"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-medium text-slate-700">
                  Tin nhắn <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tôi muốn hỏi về..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white resize-none"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(16, 185, 129, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Gửi tin nhắn</span>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
