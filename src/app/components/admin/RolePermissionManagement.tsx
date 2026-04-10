import { useState } from "react";
import { Shield, Check, X, Edit, Plus } from "lucide-react";

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

const allPermissions: Permission[] = [
  { id: "court_view", name: "Xem sân", description: "Xem thông tin các sân" },
  { id: "court_manage", name: "Quản lý sân", description: "Thêm, sửa, xóa sân" },
  { id: "booking_view", name: "Xem đặt sân", description: "Xem lịch đặt sân" },
  { id: "booking_manage", name: "Quản lý đặt sân", description: "Tạo, hủy đặt sân" },
  { id: "sales_view", name: "Xem bán hàng", description: "Xem thông tin bán hàng" },
  { id: "sales_manage", name: "Quản lý bán hàng", description: "Thực hiện bán hàng" },
  { id: "invoice_view", name: "Xem hóa đơn", description: "Xem lịch sử hóa đơn" },
  { id: "invoice_manage", name: "Quản lý hóa đơn", description: "Tạo, sửa hóa đơn" },
  { id: "staff_view", name: "Xem nhân viên", description: "Xem thông tin nhân viên" },
  { id: "staff_manage", name: "Quản lý nhân viên", description: "Thêm, sửa, xóa nhân viên" },
  { id: "warehouse_view", name: "Xem kho", description: "Xem hàng tồn kho" },
  { id: "warehouse_manage", name: "Quản lý kho", description: "Nhập, xuất kho" },
  { id: "customer_view", name: "Xem khách hàng", description: "Xem thông tin khách hàng" },
  { id: "customer_manage", name: "Quản lý khách hàng", description: "Chăm sóc khách hàng" },
  { id: "report_view", name: "Xem báo cáo", description: "Xem báo cáo thống kê" },
  { id: "report_manage", name: "Quản lý báo cáo", description: "Tạo, xuất báo cáo" },
  { id: "system_settings", name: "Cài đặt hệ thống", description: "Thay đổi cấu hình hệ thống" },
  { id: "user_manage", name: "Quản lý tài khoản", description: "Tạo, sửa, xóa tài khoản" },
];

const mockRoles: Role[] = [
  {
    id: "admin",
    name: "Quản trị viên",
    description: "Toàn quyền trên hệ thống",
    permissions: allPermissions.map((p) => p.id),
    userCount: 1,
  },
  {
    id: "owner",
    name: "Chủ sân",
    description: "Phê duyệt và phân tích kinh doanh",
    permissions: [
      "court_view",
      "court_manage",
      "booking_view",
      "sales_view",
      "invoice_view",
      "staff_view",
      "warehouse_view",
      "customer_view",
      "customer_manage",
      "report_view",
      "report_manage",
    ],
    userCount: 1,
  },
  {
    id: "manager",
    name: "Quản lý",
    description: "Quản lý sân và nhân viên",
    permissions: [
      "court_view",
      "court_manage",
      "booking_view",
      "booking_manage",
      "sales_view",
      "invoice_view",
      "staff_view",
      "staff_manage",
      "warehouse_view",
      "customer_view",
      "customer_manage",
      "report_view",
    ],
    userCount: 2,
  },
  {
    id: "warehouse",
    name: "Nhân viên kho",
    description: "Quản lý hàng hóa và nhập xuất kho",
    permissions: [
      "warehouse_view",
      "warehouse_manage",
      "sales_view",
      "invoice_view",
    ],
    userCount: 3,
  },
  {
    id: "cashier",
    name: "Nhân viên thu ngân",
    description: "Bán hàng và thanh toán",
    permissions: [
      "court_view",
      "booking_view",
      "booking_manage",
      "sales_view",
      "sales_manage",
      "invoice_view",
      "invoice_manage",
    ],
    userCount: 5,
  },
  {
    id: "customer",
    name: "Khách hàng",
    description: "Đặt sân và xem thông tin",
    permissions: ["court_view", "booking_view"],
    userCount: 235,
  },
];

export function RolePermissionManagement() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPermissions, setEditPermissions] = useState<string[]>([]);

  const openEditModal = (role: Role) => {
    setSelectedRole(role);
    setEditPermissions([...role.permissions]);
    setShowEditModal(true);
  };

  const togglePermission = (permissionId: string) => {
    if (editPermissions.includes(permissionId)) {
      setEditPermissions(editPermissions.filter((p) => p !== permissionId));
    } else {
      setEditPermissions([...editPermissions, permissionId]);
    }
  };

  const handleSave = () => {
    if (selectedRole) {
      setRoles(
        roles.map((role) =>
          role.id === selectedRole.id
            ? { ...role, permissions: editPermissions }
            : role
        )
      );
      setShowEditModal(false);
      setSelectedRole(null);
      setEditPermissions([]);
    }
  };

  const getRoleColor = (roleId: string) => {
    const colors: Record<string, string> = {
      admin: "from-red-500 to-red-600",
      owner: "from-orange-500 to-orange-600",
      manager: "from-blue-500 to-blue-600",
      warehouse: "from-purple-500 to-purple-600",
      cashier: "from-green-500 to-green-600",
      customer: "from-gray-500 to-gray-600",
    };
    return colors[roleId] || "from-gray-500 to-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Quản lý phân quyền
            </h2>
            <p className="text-gray-600">Cấu hình quyền truy cập cho từng vai trò</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#00d9b8] text-white rounded-lg hover:bg-[#00c4a7] transition-colors">
            <Plus className="w-5 h-5" />
            Thêm vai trò
          </button>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:border-[#00d9b8] transition-colors overflow-hidden"
          >
            <div className={`bg-gradient-to-r ${getRoleColor(role.id)} p-4 text-white`}>
              <div className="flex items-center justify-between mb-2">
                <Shield className="w-6 h-6" />
                <span className="text-sm font-medium">{role.userCount} người dùng</span>
              </div>
              <h3 className="text-xl font-bold">{role.name}</h3>
              <p className="text-sm opacity-90 mt-1">{role.description}</p>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Quyền được cấp: {role.permissions.length}/{allPermissions.length}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#00d9b8] h-2 rounded-full transition-all"
                    style={{
                      width: `${(role.permissions.length / allPermissions.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-600 mb-2">Một số quyền:</p>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 4).map((permId) => {
                    const perm = allPermissions.find((p) => p.id === permId);
                    return (
                      <span
                        key={permId}
                        className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded"
                      >
                        {perm?.name}
                      </span>
                    );
                  })}
                  {role.permissions.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded">
                      +{role.permissions.length - 4} khác
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => openEditModal(role)}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                Chỉnh sửa quyền
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Permissions Reference Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Danh sách tất cả quyền
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allPermissions.map((permission) => (
            <div
              key={permission.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-[#00d9b8]" />
                <p className="font-medium text-gray-800">{permission.name}</p>
              </div>
              <p className="text-xs text-gray-600">{permission.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedRole && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Chỉnh sửa quyền: {selectedRole.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Đã chọn: {editPermissions.length}/{allPermissions.length} quyền
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedRole(null);
                    setEditPermissions([]);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allPermissions.map((permission) => {
                  const isChecked = editPermissions.includes(permission.id);
                  return (
                    <button
                      key={permission.id}
                      onClick={() => togglePermission(permission.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        isChecked
                          ? "border-[#00d9b8] bg-[#00d9b8]/10"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 mb-1">
                            {permission.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {permission.description}
                          </p>
                        </div>
                        <div
                          className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${
                            isChecked
                              ? "bg-[#00d9b8] text-white"
                              : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          {isChecked ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50">
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-3 bg-[#00d9b8] text-white rounded-lg hover:bg-[#00c4a7] transition-colors font-medium"
                >
                  Lưu thay đổi
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedRole(null);
                    setEditPermissions([]);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}