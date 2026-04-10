import { useState, useEffect } from "react";
import { apiClient } from "../../api";
import {
  Plus,
  Edit,
  X,
  Tag,
  Calendar,
  Percent,
  DollarSign,
  Users,
  Clock,
  Loader2,
} from "lucide-react";

interface Promotion {
  id: number;
  code: string;
  name: string;
  type: "percentage" | "fixed";
  value: number;
  minAmount: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
  status: "active" | "inactive" | "expired";
  description: string;
}



export function PromotionManagement() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);

  const fetchPromotions = async () => {
    try {
      const response = await apiClient.get('/promotions');
      const dbItems = response.data.map((p: any) => ({
        id: p.id,
        code: p.code,
        name: p.name,
        type: p.type === 'percentage' ? 'percentage' : 'fixed',
        value: p.value || 0,
        minAmount: p.minAmount || 0,
        maxDiscount: p.maxDiscount || 0,
        startDate: p.startDate ? p.startDate.split('T')[0] : "",
        endDate: p.endDate ? p.endDate.split('T')[0] : "",
        usageLimit: p.usageLimit || 0,
        usageCount: p.usageCount || 0,
        status: p.status === 'active' ? 'active' : (p.status === 'expired' ? 'expired' : 'inactive'),
        description: p.description || ""
      }));
      setPromotions(dbItems);
    } catch (err) {
      console.error("Fetch promotions error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "percentage" as "percentage" | "fixed",
    value: 0,
    minAmount: 0,
    maxDiscount: 0,
    startDate: "",
    endDate: "",
    usageLimit: 0,
    status: "active" as "active" | "inactive" | "expired",
    description: "",
  });

  const handleAdd = async () => {
    try {
      const payload = {
        code: formData.code.toUpperCase(),
        name: formData.name,
        type: formData.type,
        value: formData.value,
        minAmount: formData.minAmount,
        maxDiscount: formData.type === "percentage" ? formData.maxDiscount : undefined,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        usageLimit: formData.usageLimit,
        status: formData.status,
        description: formData.description
      };
      await apiClient.post('/promotions', payload);
      fetchPromotions();
      setShowAddModal(false);
      resetForm();
    } catch (err) {
       console.error("Add promotion error:", err);
       alert("Thêm khuyến mãi thất bại!");
    }
  };

  const handleUpdate = async () => {
    if (editingPromotion) {
      try {
        const payload = {
          code: formData.code.toUpperCase(),
          name: formData.name,
          type: formData.type,
          value: formData.value,
          minAmount: formData.minAmount,
          maxDiscount: formData.type === "percentage" ? formData.maxDiscount : undefined,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
          usageLimit: formData.usageLimit,
          status: formData.status,
          description: formData.description
        };
        await apiClient.patch(`/promotions/${editingPromotion.id}`, payload);
        fetchPromotions();
        setEditingPromotion(null);
        resetForm();
      } catch (error) {
         console.error("Update promotion error:", error);
         alert("Cập nhật thất bại!");
      }
    }
  };

  const openEditModal = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      code: promotion.code,
      name: promotion.name,
      type: promotion.type,
      value: promotion.value,
      minAmount: promotion.minAmount,
      maxDiscount: promotion.maxDiscount || 0,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      usageLimit: promotion.usageLimit,
      status: promotion.status,
      description: promotion.description,
    });
  };

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      type: "percentage",
      value: 0,
      minAmount: 0,
      maxDiscount: 0,
      startDate: "",
      endDate: "",
      usageLimit: 0,
      status: "active",
      description: "",
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: "bg-green-100 text-green-700",
      inactive: "bg-gray-100 text-gray-700",
      expired: "bg-red-100 text-red-700",
    };
    const labels = {
      active: "Đang áp dụng",
      inactive: "Tạm ngưng",
      expired: "Hết hạn",
    };
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Quản lý Khuyến mãi</h2>
          <p className="text-gray-600">Tạo và quản lý các chương trình khuyến mãi</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#00d9b8] text-white rounded-lg hover:bg-[#00c4a7] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tạo chương trình mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Tổng chương trình</p>
          <p className="text-2xl font-bold text-gray-800">{promotions.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Đang áp dụng</p>
          <p className="text-2xl font-bold text-green-600">
            {promotions.filter((p) => p.status === "active").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Tạm ngưng</p>
          <p className="text-2xl font-bold text-gray-600">
            {promotions.filter((p) => p.status === "inactive").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Hết hạn</p>
          <p className="text-2xl font-bold text-red-600">
            {promotions.filter((p) => p.status === "expired").length}
          </p>
        </div>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00d9b8] to-[#00c4a7] rounded-lg flex items-center justify-center">
                    <Tag className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{promo.name}</h3>
                    <p className="text-sm text-[#00d9b8] font-mono font-bold">{promo.code}</p>
                  </div>
                </div>
                <button
                  onClick={() => openEditModal(promo)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Chỉnh sửa"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>

              {/* Value */}
              <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  {promo.type === "percentage" ? (
                    <Percent className="w-4 h-4 text-orange-600" />
                  ) : (
                    <DollarSign className="w-4 h-4 text-orange-600" />
                  )}
                  <p className="text-xs text-orange-700 font-medium">Giá trị ưu đãi</p>
                </div>
                <p className="text-2xl font-bold text-orange-600">
                  {promo.type === "percentage" ? `${promo.value}%` : `${promo.value.toLocaleString()} đ`}
                </p>
                {promo.maxDiscount && (
                  <p className="text-xs text-orange-600 mt-1">Tối đa {promo.maxDiscount.toLocaleString()} đ</p>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4">{promo.description}</p>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Đơn tối thiểu: </span>
                  <span className="font-semibold text-gray-800">{promo.minAmount.toLocaleString()} đ</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    {new Date(promo.startDate).toLocaleDateString("vi-VN")} -{" "}
                    {new Date(promo.endDate).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Đã dùng: </span>
                  <span className="font-semibold text-gray-800">
                    {promo.usageCount}/{promo.usageLimit}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#00d9b8] h-2 rounded-full transition-all"
                    style={{ width: `${(promo.usageCount / promo.usageLimit) * 100}%` }}
                  />
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between pt-4 border-t">
                {getStatusBadge(promo.status)}
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {promo.usageLimit - promo.usageCount} lượt còn lại
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingPromotion) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                {editingPromotion ? "Chỉnh sửa chương trình" : "Tạo chương trình mới"}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingPromotion(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã khuyến mãi *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8] font-mono"
                    placeholder="SUMMER2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên chương trình *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                    placeholder="Khuyến mãi mùa hè"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại giảm giá *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as "percentage" | "fixed" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                  >
                    <option value="percentage">Phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định (đ)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá trị giảm *
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                    placeholder={formData.type === "percentage" ? "20" : "50000"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đơn hàng tối thiểu (đ) *
                  </label>
                  <input
                    type="number"
                    value={formData.minAmount}
                    onChange={(e) => setFormData({ ...formData, minAmount: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                    placeholder="100000"
                  />
                </div>
                {formData.type === "percentage" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giảm tối đa (đ)
                    </label>
                    <input
                      type="number"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                      placeholder="100000"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày bắt đầu *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày kết thúc *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng sử dụng *
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                    placeholder="100"
                  />
                </div>
                {editingPromotion && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" | "expired" })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                    >
                      <option value="active">Đang áp dụng</option>
                      <option value="inactive">Tạm ngưng</option>
                      <option value="expired">Hết hạn</option>
                    </select>
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                    placeholder="Mô tả chương trình khuyến mãi..."
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingPromotion(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={editingPromotion ? handleUpdate : handleAdd}
                  className="flex-1 px-4 py-2 bg-[#00d9b8] text-white rounded-lg hover:bg-[#00c4a7] transition-colors"
                >
                  {editingPromotion ? "Cập nhật" : "Tạo chương trình"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
