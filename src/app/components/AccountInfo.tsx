import { User, Mail, Phone, MapPin, Calendar, Edit2, Shield, Key } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export function AccountInfo() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.fullName || "",
    email: "admin@badmintoncenter.com",
    phone: "0901234567",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    joinDate: "01/01/2024",
  });

  const handleSave = () => {
    setIsEditing(false);
    alert("Thông tin đã được cập nhật!");
  };

  const getRoleName = (role: string) => {
    const roleNames: Record<string, string> = {
      admin: "Quản trị viên",
      owner: "Chủ sân",
      manager: "Quản lý",
      cashier: "Nhân viên thu ngân",
      warehouse: "Nhân viên kho",
      customer: "Khách hàng",
    };
    return roleNames[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: "from-red-500 to-red-600",
      owner: "from-orange-500 to-orange-600",
      manager: "from-blue-500 to-blue-600",
      cashier: "from-green-500 to-green-600",
      warehouse: "from-purple-500 to-purple-600",
      customer: "from-gray-500 to-gray-600",
    };
    return colors[role || "customer"] || "from-gray-500 to-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-32 pb-6 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Thông tin tài khoản</h2>
          <p className="text-gray-600">Quản lý thông tin cá nhân của bạn</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className={`bg-gradient-to-r ${getRoleColor(user?.role || "")} p-8 text-white`}>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold border-4 border-white/30">
                {(user?.fullName || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{user?.fullName || "Người dùng"}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5" />
                  <span className="text-lg capitalize">{getRoleName(user?.role || "")}</span>
                </div>
                <p className="text-white/80 text-sm">Thành viên từ {formData.joinDate}</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors flex items-center gap-2 border border-white/30"
              >
                <Edit2 className="w-4 h-4" />
                {isEditing ? "Hủy" : "Chỉnh sửa"}
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#00d9b8]" />
                  Họ và tên
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                  />
                ) : (
                  <p className="text-gray-800 font-medium px-4 py-2 bg-gray-50 rounded-lg">
                    {formData.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#00d9b8]" />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                  />
                ) : (
                  <p className="text-gray-800 font-medium px-4 py-2 bg-gray-50 rounded-lg">
                    {formData.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#00d9b8]" />
                  Số điện thoại
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                  />
                ) : (
                  <p className="text-gray-800 font-medium px-4 py-2 bg-gray-50 rounded-lg">
                    {formData.phone}
                  </p>
                )}
              </div>

              {/* Join Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#00d9b8]" />
                  Ngày tham gia
                </label>
                <p className="text-gray-800 font-medium px-4 py-2 bg-gray-50 rounded-lg">
                  {formData.joinDate}
                </p>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#00d9b8]" />
                  Địa chỉ
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                  />
                ) : (
                  <p className="text-gray-800 font-medium px-4 py-2 bg-gray-50 rounded-lg">
                    {formData.address}
                  </p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-3 bg-[#00d9b8] text-white rounded-lg hover:bg-[#00c4a7] transition-colors font-medium"
                >
                  Lưu thay đổi
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Hủy
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-[#00d9b8]" />
            Bảo mật
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Đổi mật khẩu</p>
                  <p className="text-sm text-gray-600">Cập nhật mật khẩu của bạn</p>
                </div>
                <Edit2 className="w-5 h-5 text-gray-400" />
              </div>
            </button>
            <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Xác thực 2 bước</p>
                  <p className="text-sm text-gray-600">Tăng cường bảo mật tài khoản</p>
                </div>
                <div className="text-sm text-gray-500">Chưa bật</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
