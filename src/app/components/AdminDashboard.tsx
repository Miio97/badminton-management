import { Users, TrendingUp, AlertCircle, CheckCircle, Shield, FileText, Settings, Activity, ArrowUpRight, Loader2 } from "lucide-react";
import { StatCard } from "./shared/StatCard";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { apiClient } from "../api";

export function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get('/dashboard/overview');
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
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

  const stats = [
    { label: "Khách hàng", value: data?.customers?.total?.toString() || "0", icon: Users, trend: { value: "+12%", isPositive: true }, iconColor: "text-blue-600", iconBgColor: "bg-blue-50" },
    { label: "Doanh thu hôm nay", value: (data?.revenue?.today || 0).toLocaleString("vi-VN") + "đ", icon: TrendingUp, trend: { value: "+8%", isPositive: true }, iconColor: "text-emerald-600", iconBgColor: "bg-emerald-50" },
    { label: "Sân bảo trì", value: data?.courts?.maintenance?.toString() || "0", icon: AlertCircle, trend: { value: "-2", isPositive: true }, iconColor: "text-amber-600", iconBgColor: "bg-amber-50" },
    { label: "Bookings hôm nay", value: data?.bookings?.today?.toString() || "0", icon: CheckCircle, trend: { value: "+15%", isPositive: true }, iconColor: "text-emerald-600", iconBgColor: "bg-emerald-50" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h2>
        <p className="text-slate-600">Quản trị toàn bộ hệ thống</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Người dùng theo vai trò</h3>
          <div className="space-y-3">
            {[
              { role: "Admin", count: 1, color: "bg-red-500", percentage: 0.4 },
              { role: "Chủ sân", count: 1, color: "bg-orange-500", percentage: 0.4 },
              { role: "Manager", count: 2, color: "bg-blue-500", percentage: 0.8 },
              { role: "Warehouse", count: 3, color: "bg-purple-500", percentage: 1.2 },
              { role: "Cashier", count: 5, color: "bg-emerald-500", percentage: 2 },
              { role: "Customer", count: 235, color: "bg-slate-400", percentage: 95.2 },
            ].map((item, i) => (
              <div key={i} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                    <span className="text-sm font-medium text-slate-700">{item.role}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500">{item.percentage}%</span>
                    <span className="text-sm font-semibold text-slate-900">{item.count}</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                    className={`h-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Quản lý hệ thống</h3>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-left p-4 bg-white rounded-lg border-2 border-slate-200 hover:border-emerald-300 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Quản lý quyền truy cập</p>
                    <p className="text-sm text-slate-500">Phân quyền và role</p>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-left p-4 bg-white rounded-lg border-2 border-slate-200 hover:border-blue-300 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Nhật ký hoạt động</p>
                    <p className="text-sm text-slate-500">Theo dõi log hệ thống</p>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-left p-4 bg-white rounded-lg border-2 border-slate-200 hover:border-purple-300 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                    <Settings className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Cài đặt hệ thống</p>
                    <p className="text-sm text-slate-500">Cấu hình toàn cục</p>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 transition-colors" />
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-slate-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Hoạt động gần đây</h3>
          <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
            Xem tất cả
          </button>
        </div>
        <div className="space-y-4">
          {[
            { action: "Thêm người dùng mới", user: "Admin", time: "5 phút trước", type: "success", icon: CheckCircle },
            { action: "Cập nhật quyền Manager", user: "Admin", time: "15 phút trước", type: "info", icon: Activity },
            { action: "Cảnh báo: Đăng nhập thất bại nhiều lần", user: "System", time: "30 phút trước", type: "warning", icon: AlertCircle },
            { action: "Backup dữ liệu thành công", user: "System", time: "1 giờ trước", type: "success", icon: CheckCircle },
          ].map((activity, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div
                className={`p-2 rounded-lg flex-shrink-0 ${
                  activity.type === "success"
                    ? "bg-emerald-50"
                    : activity.type === "warning"
                    ? "bg-amber-50"
                    : "bg-blue-50"
                }`}
              >
                <activity.icon
                  className={`w-5 h-5 ${
                    activity.type === "success"
                      ? "text-emerald-600"
                      : activity.type === "warning"
                      ? "text-amber-600"
                      : "text-blue-600"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 mb-1">{activity.action}</p>
                <p className="text-sm text-slate-500">
                  Bởi <span className="font-medium">{activity.user}</span> • {activity.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}