import { useState, useEffect } from "react";
import {
  Check,
  X,
  Clock,
  Plus,
  Trash2,
  Edit,
  Clock3,
  AlertCircle,
  User,
  CheckCircle,
  XCircle,
  CreditCard,
  Package,
  DollarSign,
  PackagePlus,
} from "lucide-react";

import { Approval, ApprovalStatus, ApprovalType } from "../../../types/Owner";
import { ownerService } from "../../../services/ownerService";

export function ApprovalManagement() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [filter, setFilter] = useState<"all" | ApprovalStatus>("all");
  const [selectedType, setSelectedType] = useState<"all" | ApprovalType>("all");
  const [loading, setLoading] = useState(true);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const data = await ownerService.getApprovals();
      setApprovals(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const getTypeIcon = (type: ApprovalType) => {
    switch (type) {
      case "add_court":
        return <Plus className="w-5 h-5" />;
      case "remove_court":
        return <Trash2 className="w-5 h-5" />;
      case "price_change":
        return <Edit className="w-5 h-5" />;
      case "peak_hours":
        return <Clock3 className="w-5 h-5" />;
      case "supplier_payment":
        return <CreditCard className="w-5 h-5" />;
      case "product_price_change":
        return <Package className="w-5 h-5" />;
      case "salary_payment":
        return <DollarSign className="w-5 h-5" />;
      case "stock_entry":
        return <PackagePlus className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: ApprovalType) => {
    switch (type) {
      case "add_court":
        return "Thêm sân";
      case "remove_court":
        return "Xóa sân";
      case "price_change":
        return "Sửa giá";
      case "peak_hours":
        return "Peak hours";
      case "supplier_payment":
        return "Thanh toán nhà cung cấp";
      case "product_price_change":
        return "Sửa giá sản phẩm";
      case "salary_payment":
        return "Thanh toán lương";
      case "stock_entry":
        return "Nhập kho";
    }
  };

  const getTypeColor = (type: ApprovalType) => {
    switch (type) {
      case "add_court":
        return "bg-green-100 text-green-700 border-green-200";
      case "remove_court":
        return "bg-red-100 text-red-700 border-red-200";
      case "price_change":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "peak_hours":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "supplier_payment":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "product_price_change":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "salary_payment":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "stock_entry":
        return "bg-teal-100 text-teal-700 border-teal-200";
    }
  };

  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Chờ duyệt
          </span>
        );
      case "approved":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Đã duyệt
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Từ chối
          </span>
        );
    }
  };

  const handleApprove = async (id: number) => {
    await ownerService.updateApprovalStatus(id, "approved");
    fetchApprovals();
  };

  const handleReject = async (id: number) => {
    await ownerService.updateApprovalStatus(id, "rejected");
    fetchApprovals();
  };

  const filteredApprovals = approvals.filter((approval) => {
    const matchStatus = filter === "all" || approval.status === filter;
    const matchType = selectedType === "all" || approval.type === selectedType;
    return matchStatus && matchType;
  });

  const pendingCount = approvals.filter((a) => a.status === "pending").length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Phê duyệt</h2>
            <p className="text-gray-600">Quản lý các đề xuất từ quản lý</p>
          </div>
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-700" />
              <span className="text-sm font-medium text-yellow-800">
                {pendingCount} đề xuất chờ duyệt
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng đề xuất</p>
              <p className="text-2xl font-bold text-gray-800">{approvals.length}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-yellow-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Chờ duyệt</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Đã duyệt</p>
              <p className="text-2xl font-bold text-green-600">
                {approvals.filter((a) => a.status === "approved").length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Từ chối</p>
              <p className="text-2xl font-bold text-red-600">
                {approvals.filter((a) => a.status === "rejected").length}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
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
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "pending"
                    ? "bg-[#00d9b8] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Chờ duyệt
              </button>
              <button
                onClick={() => setFilter("approved")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "approved"
                    ? "bg-[#00d9b8] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Đã duyệt
              </button>
              <button
                onClick={() => setFilter("rejected")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "rejected"
                    ? "bg-[#00d9b8] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Từ chối
              </button>
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại đề xuất
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedType("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === "all"
                    ? "bg-[#00d9b8] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setSelectedType("add_court")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === "add_court"
                    ? "bg-[#00d9b8] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Thêm sân
              </button>
              <button
                onClick={() => setSelectedType("remove_court")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === "remove_court"
                    ? "bg-[#00d9b8] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Xóa sân
              </button>
              <button
                onClick={() => setSelectedType("price_change")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === "price_change"
                    ? "bg-[#00d9b8] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Sửa giá
              </button>
              <button
                onClick={() => setSelectedType("peak_hours")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === "peak_hours"
                    ? "bg-[#00d9b8] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Peak hours
              </button>
              <button
                onClick={() => setSelectedType("supplier_payment")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === "supplier_payment"
                    ? "bg-[#00d9b8] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Thanh toán nhà cung cấp
              </button>
              <button
                onClick={() => setSelectedType("product_price_change")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === "product_price_change"
                    ? "bg-[#00d9b8] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Sửa giá sản phẩm
              </button>
              <button
                onClick={() => setSelectedType("salary_payment")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === "salary_payment"
                    ? "bg-[#00d9b8] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Thanh toán lương
              </button>
              <button
                onClick={() => setSelectedType("stock_entry")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === "stock_entry"
                    ? "bg-[#00d9b8] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Nhập kho
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {filteredApprovals.map((approval) => (
          <div
            key={approval.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                {/* Icon */}
                <div className={`p-3 rounded-lg border ${getTypeColor(approval.type)}`}>
                  {getTypeIcon(approval.type)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-800">
                      {approval.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded border ${getTypeColor(
                        approval.type
                      )}`}
                    >
                      {getTypeLabel(approval.type)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{approval.description}</p>

                  {/* Details */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-3">
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(approval.details).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs text-gray-500 capitalize mb-1">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </p>
                          <p className="text-sm font-medium text-gray-800">
                            {typeof value === "number"
                              ? value.toLocaleString() + (key.includes("Price") || key.includes("Cost") ? " đ" : "")
                              : String(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{approval.requestedBy}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{approval.requestedAt}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex flex-col items-end gap-3">
                {getStatusBadge(approval.status)}

                {approval.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(approval.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Duyệt
                    </button>
                    <button
                      onClick={() => handleReject(approval.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Từ chối
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredApprovals.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Không có đề xuất nào</p>
        </div>
      )}
    </div>
  );
}