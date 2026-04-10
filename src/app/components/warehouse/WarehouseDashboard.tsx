import {
  Package,
  AlertTriangle,
  DollarSign,
  FileInput,
  AlertCircle,
  Clock,
  Loader2
} from "lucide-react";
import { StatCard } from "../shared/StatCard";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { apiClient } from "../../api";

interface LowStockProduct {
  id: number;
  name: string;
  stock: number;
  minStock: number;
  unit: string;
  status: "low" | "out";
}

export function WarehouseDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWarehouseData = async () => {
      try {
        const response = await apiClient.get('/dashboard/warehouse');
        setData(response.data);
      } catch (err) {
        console.error("Fetch warehouse dashboard data failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWarehouseData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const stats = [
    { label: "Tổng số sản phẩm", value: data?.products?.total?.toString() || "0", icon: Package, trend: { value: "+12", isPositive: true }, iconColor: "text-blue-600", iconBgColor: "bg-blue-50" },
    { label: "Hoạt động tháng", value: data?.receipts?.monthCount?.toString() || "0", icon: DollarSign, trend: { value: "+5.2%", isPositive: true }, iconColor: "text-emerald-600", iconBgColor: "bg-emerald-50" },
    { label: "Sản phẩm đang bán", value: data?.products?.active?.toString() || "0", icon: AlertTriangle, iconColor: "text-orange-600", iconBgColor: "bg-orange-50" },
    { label: "Nhà cung cấp", value: data?.suppliers?.active?.toString() || "0", icon: FileInput, iconColor: "text-purple-600", iconBgColor: "bg-purple-50" },
  ];

  const recentReceipts = data?.recentReceipts || [];
  const lowStockProducts: LowStockProduct[] = []; // In a real app, this would be computed

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Dashboard Quản lý kho</h2>
        <p className="text-slate-600">Tổng quan tình hình kho hàng</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Chi tiết sản phẩm</h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
              {data?.products?.total} sản phẩm
            </span>
          </div>

          <div className="space-y-3">
             <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-sm text-slate-600">Hệ thống đang hoạt động ổn định. Tổng giá trị hàng nhập tháng này: <span className="font-bold">{(data?.receipts?.monthValue || 0).toLocaleString("vi-VN")}đ</span></p>
             </div>
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Hoạt động gần đây</h3>
            <Clock className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-4">
            {recentReceipts.map((receipt: any, index: number) => (
              <motion.div
                key={receipt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="p-2 rounded-lg flex-shrink-0 bg-emerald-50 text-emerald-600">
                    <FileInput className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 mb-1">
                    Nhập kho từ: {receipt.supplier?.name}
                  </p>
                  <p className="text-sm text-slate-600">
                    Ghi chú: {receipt.notes || "Không có ghi chú"} • NV: {receipt.staff?.fullName}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{new Date(receipt.date).toLocaleString("vi-VN")}</p>
                </div>
              </motion.div>
            ))}
            {recentReceipts.length === 0 && (
               <p className="text-sm text-slate-500 text-center py-4">Chưa có hoạt động nhập kho nào</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
