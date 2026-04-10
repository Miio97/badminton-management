import {
  TrendingUp,
  Users,
  MapPin,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
} from "lucide-react";
import { StatCard } from "../shared/StatCard";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { apiClient } from "../../api";
import { Loader2 } from "lucide-react";

export function ManagerDashboard() {
  const [data, setData] = useState<any>(null);
  const [cashierData, setCashierData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, cashierRes] = await Promise.all([
          apiClient.get('/dashboard/overview'),
          apiClient.get('/dashboard/cashier')
        ]);
        setData(overviewRes.data);
        setCashierData(cashierRes.data);
      } catch (error) {
        console.error("Failed to fetch manager dashboard data:", error);
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
    { label: "Tổng số sân", value: data?.courts?.total?.toString() || "0", icon: MapPin, trend: { value: "100%", isPositive: true }, iconColor: "text-cyan-600", iconBgColor: "bg-cyan-50" },
    { label: "Nhân viên", value: data?.staff?.total?.toString() || "0", icon: Users, iconColor: "text-blue-600", iconBgColor: "bg-blue-50" },
    { label: "Doanh thu hôm nay", value: (data?.revenue?.today || 0).toLocaleString("vi-VN") + "đ", icon: DollarSign, trend: { value: "+15%", isPositive: true }, iconColor: "text-emerald-600", iconBgColor: "bg-emerald-50" },
    { label: "Lượt đặt sân", value: data?.bookings?.today?.toString() || "0", icon: Calendar, trend: { value: "+5", isPositive: true }, iconColor: "text-purple-600", iconBgColor: "bg-purple-50" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h2>
        <p className="text-slate-600">Tổng quan quản lý</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Court Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Trạng thái sân</h3>
          <div className="space-y-2">
            {(cashierData?.courts || []).map((court: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      court.status === "available"
                        ? "bg-emerald-500"
                        : court.status === "in_use"
                        ? "bg-blue-500"
                        : "bg-amber-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{court.name}</p>
                    <p className="text-xs text-slate-500">{court.type?.name}</p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    court.status === "available"
                      ? "bg-emerald-50 text-emerald-700"
                      : court.status === "in_use"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {court.status === "available"
                    ? "Trống"
                    : court.status === "in_use"
                    ? "Đang chơi"
                    : "Bảo trì"}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Lịch đặt hôm nay</h3>
          <div className="space-y-4">
            {(cashierData?.today?.bookings || []).map((booking: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="p-2 rounded-lg flex-shrink-0 bg-emerald-50">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm mb-1">{booking.customer?.fullName}</p>
                  <p className="text-sm text-slate-600">{booking.details?.[0]?.court?.name} • {new Date(booking.startTime).toLocaleTimeString()}</p>
                  <p className="text-xs text-slate-500 mt-1">{booking.customer?.phone}</p>
                </div>
              </motion.div>
            ))}
            {(!cashierData?.today?.bookings || cashierData.today.bookings.length === 0) && (
               <p className="text-sm text-slate-500 text-center py-4">Không có hoạt động nào mới</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border-2 border-amber-200 p-6"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
              3
            </span>
          </div>
          <h4 className="font-semibold text-slate-900 mb-2">Chờ phê duyệt</h4>
          <p className="text-sm text-slate-600">
            3 đề xuất đang chờ chủ sân phê duyệt
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border-2 border-blue-200 p-6"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
              85%
            </span>
          </div>
          <h4 className="font-semibold text-slate-900 mb-2">Hiệu suất tốt</h4>
          <p className="text-sm text-slate-600">
            Tỷ lệ lấp đầy sân hôm nay đạt 85%
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl border-2 border-emerald-200 p-6"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
              OK
            </span>
          </div>
          <h4 className="font-semibold text-slate-900 mb-2">Hoạt động tốt</h4>
          <p className="text-sm text-slate-600">
            Không có vấn đề cần xử lý khẩn cấp
          </p>
        </motion.div>
      </div>
    </div>
  );
}
