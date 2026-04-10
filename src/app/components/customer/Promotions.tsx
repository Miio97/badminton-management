import { useState, useEffect } from "react";
import {
  Tag,
  Clock,
  Gift,
  Percent,
  Copy,
  Check,
  Calendar,
  Loader2,
} from "lucide-react";
import { apiClient } from "../../api";

interface Promotion {
  id: number;
  code: string;
  title: string;
  description: string;
  discount: string;
  type: "percentage" | "fixed" | "gift";
  minOrder: number;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  usedCount: number;
  status: "active" | "upcoming" | "expired";
}

export function Promotions() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "upcoming" | "expired">("all");
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/promotions');
      const rawPromos = res.data || [];
      
      const mapped: Promotion[] = rawPromos.map((p: any) => {
        const now = new Date();
        const start = new Date(p.startDate);
        const end = new Date(p.endDate);
        
        let status: "active" | "upcoming" | "expired" = "active";
        if (now < start) status = "upcoming";
        if (now > end) status = "expired";
        if (p.status === 'expired') status = 'expired';

        return {
          id: p.id,
          code: p.name.split(' ').map((s: string) => s.charAt(0)).join('').toUpperCase() + p.id,
          title: p.name,
          description: p.notes || "Ưu đãi đặc biệt dành cho khách hàng",
          discount: p.type === 'Percentage' ? `${p.value}%` : `${p.value.toLocaleString()}đ`,
          type: p.type === 'Percentage' ? 'percentage' : 'fixed',
          minOrder: 0,
          validFrom: p.startDate,
          validTo: p.endDate,
          usageLimit: 100,
          usedCount: 15,
          status: status
        };
      });

      setPromotions(mapped);
    } catch (error) {
      console.error("Failed to fetch promotions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
      });
    }
  };

  const filteredPromotions = promotions.filter((promo) => {
    if (filter === "all") return true;
    return promo.status === filter;
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#00d9b8]" />
      </div>
    );
  }

  const getPromotionIcon = (type: string) => {
    switch (type) {
      case "percentage":
        return <Percent className="w-6 h-6" />;
      case "fixed":
        return <Tag className="w-6 h-6" />;
      case "gift":
        return <Gift className="w-6 h-6" />;
      default:
        return <Tag className="w-6 h-6" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            Đang áp dụng
          </span>
        );
      case "upcoming":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            Sắp diễn ra
          </span>
        );
      case "expired":
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
            Đã hết hạn
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Khuyến mãi</h2>
        <p className="text-gray-600">Các chương trình ưu đãi dành cho bạn</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Tag className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">Khuyến mãi đang áp dụng</p>
          <p className="text-3xl font-bold">
            {promotions.filter((p: any) => p.status === "active").length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">Sắp diễn ra</p>
          <p className="text-3xl font-bold">
            {promotions.filter((p: any) => p.status === "upcoming").length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Gift className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">Tổng khuyến mãi</p>
          <p className="text-3xl font-bold">{promotions.length}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-[#00d9b8] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "active"
                ? "bg-[#00d9b8] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Đang áp dụng
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "upcoming"
                ? "bg-[#00d9b8] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Sắp diễn ra
          </button>
          <button
            onClick={() => setFilter("expired")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "expired"
                ? "bg-[#00d9b8] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Đã hết hạn
          </button>
        </div>
      </div>

      {/* Promotions List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPromotions.map((promo) => (
          <div
            key={promo.id}
            className={`bg-white rounded-lg shadow-sm border-2 hover:shadow-md transition-shadow ${
              promo.status === "active"
                ? "border-[#00d9b8]"
                : promo.status === "upcoming"
                ? "border-blue-200"
                : "border-gray-200"
            }`}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-3 rounded-lg ${
                      promo.status === "active"
                        ? "bg-[#00d9b8]/10 text-[#00d9b8]"
                        : promo.status === "upcoming"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {getPromotionIcon(promo.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {promo.title}
                    </h3>
                    {getStatusBadge(promo.status)}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#00d9b8]">{promo.discount}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4">{promo.description}</p>

              {/* Code */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 bg-gradient-to-r from-[#00d9b8]/10 to-[#00d9b8]/5 border-2 border-dashed border-[#00d9b8] rounded-lg px-4 py-3">
                  <p className="text-xs text-gray-600 mb-1">Mã khuyến mãi</p>
                  <p className="text-lg font-bold text-gray-800">{promo.code}</p>
                </div>
                <button
                  onClick={() => handleCopyCode(promo.code)}
                  disabled={promo.status === "expired"}
                  className={`p-3 rounded-lg transition-colors ${
                    promo.status === "expired"
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : copiedCode === promo.code
                      ? "bg-green-500 text-white"
                      : "bg-[#00d9b8] text-white hover:bg-[#00c4a7]"
                  }`}
                >
                  {copiedCode === promo.code ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                {promo.minOrder > 0 && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Tag className="w-4 h-4" />
                    <span>Đơn tối thiểu: {promo.minOrder.toLocaleString()}đ</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Từ {new Date(promo.validFrom).toLocaleDateString("vi-VN")} đến{" "}
                    {new Date(promo.validTo).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    Đã sử dụng: {promo.usedCount}/{promo.usageLimit}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      promo.status === "active"
                        ? "bg-[#00d9b8]"
                        : promo.status === "upcoming"
                        ? "bg-blue-500"
                        : "bg-gray-400"
                    }`}
                    style={{
                      width: `${(promo.usedCount / promo.usageLimit) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPromotions.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Tag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Không có khuyến mãi nào</p>
        </div>
      )}
    </div>
  );
}