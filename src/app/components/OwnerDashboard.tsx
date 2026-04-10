import { TrendingUp, DollarSign, BarChart3, Calendar, TrendingDown, Loader2 } from "lucide-react";
import { StatCard } from "./shared/StatCard";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { apiClient } from "../api";

export function OwnerDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get('/dashboard/overview');
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch owner dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  // Placeholder profit data based on revenue
  const revenueValue = data?.revenue?.month || 0;
  const profitValue = revenueValue * 0.6;
  const costValue = revenueValue * 0.4;

  const stats = [
    { label: "Doanh thu tháng", value: revenueValue.toLocaleString("vi-VN") + "đ", icon: DollarSign, trend: { value: "+12%", isPositive: true }, iconColor: "text-emerald-600", iconBgColor: "bg-emerald-50" },
    { label: "Lợi nhuận (60%)", value: profitValue.toLocaleString("vi-VN") + "đ", icon: TrendingUp, trend: { value: "+8%", isPositive: true }, iconColor: "text-blue-600", iconBgColor: "bg-blue-50" },
    { label: "Chi phí (40%)", value: costValue.toLocaleString("vi-VN") + "đ", icon: TrendingDown, trend: { value: "-3%", isPositive: true }, iconColor: "text-orange-600", iconBgColor: "bg-orange-50" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h2>
        <p className="text-slate-600">Tổng quan kinh doanh và báo cáo tài chính</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Doanh thu 3 tháng gần nhất</h3>
          <div className="space-y-5">
            {[1, 2, 3].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Tháng {new Date().getMonth() + 1 - (2 - index)}</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {(revenueValue * (0.8 + Math.random() * 0.4)).toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${60 + Math.random() * 40}%` }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Hiệu suất kinh doanh</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div>
                <p className="text-sm text-slate-600 mb-1">Doanh thu trung bình/ngày</p>
                <p className="text-2xl font-bold text-slate-900">1.6M đ</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div>
                <p className="text-sm text-slate-600 mb-1">Số giờ sử dụng trung bình</p>
                <p className="text-2xl font-bold text-slate-900">42h</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-100">
              <div>
                <p className="text-sm text-slate-600 mb-1">Chi phí vận hành</p>
                <p className="text-2xl font-bold text-slate-900">12M đ</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Sản phẩm bán chạy</h3>
          <div className="space-y-4">
            {[
              { name: "Nước uống", revenue: "8.5M đ", percent: 85 },
              { name: "Vợt cầu lông", revenue: "6.2M đ", percent: 62 },
              { name: "Quả cầu", revenue: "4.8M đ", percent: 48 },
              { name: "Phụ kiện", revenue: "3.1M đ", percent: 31 },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">{item.name}</span>
                  <span className="text-sm font-semibold text-emerald-600">{item.revenue}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percent}%` }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                    className="bg-emerald-500 h-2 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Thông báo quan trọng</h3>
          <div className="space-y-3">
            <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
              <p className="text-sm font-semibold text-amber-900">5 sản phẩm sắp hết hàng</p>
              <p className="text-xs text-amber-700 mt-1">Cần nhập thêm hàng</p>
            </div>
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
              <p className="text-sm font-semibold text-blue-900">Doanh thu cao điểm vào 18h-20h</p>
              <p className="text-xs text-blue-700 mt-1">Cân nhắc tăng giá giờ vàng</p>
            </div>
            <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-lg">
              <p className="text-sm font-semibold text-emerald-900">25 khách hàng mới tuần này</p>
              <p className="text-xs text-emerald-700 mt-1">Tăng 15% so với tuần trước</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}