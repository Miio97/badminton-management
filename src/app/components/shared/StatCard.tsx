import { motion } from "motion/react";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconColor?: string;
  iconBgColor?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  iconColor = "text-emerald-600",
  iconBgColor = "bg-emerald-50",
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)" }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl border border-slate-200 p-6 cursor-default"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-2">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {trend.value}
              </span>
              <span className="text-xs text-slate-500 ml-1">vs hôm qua</span>
            </div>
          )}
        </div>
        <div className={`${iconBgColor} p-3 rounded-xl`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </motion.div>
  );
}
