import { useState } from "react";
import { FileText, User, Calendar, Search, Filter } from "lucide-react";

interface ActivityLog {
  id: number;
  user: string;
  role: string;
  action: string;
  module: string;
  timestamp: string;
  ipAddress: string;
  status: "success" | "warning" | "error";
}

interface InvoiceLog {
  id: number;
  invoiceNumber: string;
  customer: string;
  cashier: string;
  amount: number;
  paymentMethod: string;
  timestamp: string;
  status: "completed" | "cancelled" | "refunded";
}

const mockActivityLogs: ActivityLog[] = [
  {
    id: 1,
    user: "Admin",
    role: "admin",
    action: "Thêm người dùng mới: nguyen.van.a",
    module: "Quản lý tài khoản",
    timestamp: "2024-03-31 14:30:25",
    ipAddress: "192.168.1.100",
    status: "success",
  },
  {
    id: 2,
    user: "Nguyễn Văn Quản Lý",
    role: "manager",
    action: "Cập nhật quyền cho role: Cashier",
    module: "Phân quyền",
    timestamp: "2024-03-31 13:15:10",
    ipAddress: "192.168.1.105",
    status: "success",
  },
  {
    id: 3,
    user: "Unknown",
    role: "unknown",
    action: "Đăng nhập thất bại nhiều lần",
    module: "Xác thực",
    timestamp: "2024-03-31 12:45:33",
    ipAddress: "203.162.10.50",
    status: "warning",
  },
  {
    id: 4,
    user: "System",
    role: "system",
    action: "Backup dữ liệu tự động",
    module: "Hệ thống",
    timestamp: "2024-03-31 12:00:00",
    ipAddress: "127.0.0.1",
    status: "success",
  },
  {
    id: 5,
    user: "Phạm Văn Kho",
    role: "warehouse",
    action: "Nhập hàng: 50 Vợt Yonex",
    module: "Quản lý kho",
    timestamp: "2024-03-31 11:20:15",
    ipAddress: "192.168.1.110",
    status: "success",
  },
];

const mockInvoiceLogs: InvoiceLog[] = [
  {
    id: 1,
    invoiceNumber: "HD-2024-001234",
    customer: "Nguyễn Văn A",
    cashier: "Trần Thị Thu Ngân",
    amount: 250000,
    paymentMethod: "Tiền mặt",
    timestamp: "2024-03-31 14:35:20",
    status: "completed",
  },
  {
    id: 2,
    invoiceNumber: "HD-2024-001233",
    customer: "Lê Văn B",
    cashier: "Trần Thị Thu Ngân",
    amount: 180000,
    paymentMethod: "Chuyển khoản",
    timestamp: "2024-03-31 13:20:15",
    status: "completed",
  },
  {
    id: 3,
    invoiceNumber: "HD-2024-001232",
    customer: "Phạm Thị C",
    cashier: "Nguyễn Văn Thu",
    amount: 320000,
    paymentMethod: "Tiền mặt",
    timestamp: "2024-03-31 12:10:30",
    status: "completed",
  },
  {
    id: 4,
    invoiceNumber: "HD-2024-001231",
    customer: "Hoàng Văn D",
    cashier: "Trần Thị Thu Ngân",
    amount: 150000,
    paymentMethod: "Thẻ",
    timestamp: "2024-03-31 11:45:10",
    status: "cancelled",
  },
];

export function ActivityLogManagement() {
  const [activeTab, setActiveTab] = useState<"activity" | "invoice">("activity");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredActivityLogs = mockActivityLogs.filter(
    (log) =>
      (log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "all" || log.status === filterStatus)
  );

  const filteredInvoiceLogs = mockInvoiceLogs.filter(
    (log) =>
      (log.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.customer.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "all" || log.status === filterStatus)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
      case "completed":
        return "bg-green-100 text-green-700";
      case "warning":
        return "bg-yellow-100 text-yellow-700";
      case "error":
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "refunded":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "success":
        return "Thành công";
      case "warning":
        return "Cảnh báo";
      case "error":
        return "Lỗi";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      case "refunded":
        return "Hoàn tiền";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Nhật ký hệ thống</h2>
        <p className="text-gray-600">Theo dõi hoạt động và giao dịch</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("activity")}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === "activity"
                ? "text-[#00d9b8] border-b-2 border-[#00d9b8]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FileText className="w-5 h-5" />
              Log hoạt động
            </div>
          </button>
          <button
            onClick={() => setActiveTab("invoice")}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === "invoice"
                ? "text-[#00d9b8] border-b-2 border-[#00d9b8]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FileText className="w-5 h-5" />
              Log hóa đơn
            </div>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="p-4 bg-gray-50 border-b flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                activeTab === "activity"
                  ? "Tìm kiếm theo người dùng hoặc hành động..."
                  : "Tìm kiếm theo mã hóa đơn hoặc khách hàng..."
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
          >
            <option value="all">Tất cả trạng thái</option>
            {activeTab === "activity" ? (
              <>
                <option value="success">Thành công</option>
                <option value="warning">Cảnh báo</option>
                <option value="error">Lỗi</option>
              </>
            ) : (
              <>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
                <option value="refunded">Hoàn tiền</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Activity Logs Table */}
      {activeTab === "activity" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Người dùng
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Hành động
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Module
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Thời gian
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    IP Address
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredActivityLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-800">{log.user}</p>
                          <p className="text-xs text-gray-600 capitalize">{log.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">{log.action}</td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {log.module}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {log.timestamp}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 font-mono">
                      {log.ipAddress}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          log.status
                        )}`}
                      >
                        {getStatusLabel(log.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoice Logs Table */}
      {activeTab === "invoice" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Mã hóa đơn
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Khách hàng
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Thu ngân
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Số tiền
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Phương thức
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Thời gian
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoiceLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <span className="font-mono font-medium text-gray-800">
                        {log.invoiceNumber}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-700">{log.customer}</td>
                    <td className="py-4 px-6 text-gray-700">{log.cashier}</td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-gray-800">
                        {log.amount.toLocaleString()} đ
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                        {log.paymentMethod}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {log.timestamp}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          log.status
                        )}`}
                      >
                        {getStatusLabel(log.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
