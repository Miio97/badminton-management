import { useState, useEffect } from "react";
import { Plus, Edit, Mail, Phone, X, Search, Loader2 } from "lucide-react";
import { apiClient } from "../../api";

interface Staff {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  salary: number;
  startDate: string;
  status: "active" | "inactive";
}



export function StaffManagement() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStaff = async () => {
    try {
      const response = await apiClient.get('/staff');
      const dbItems = response.data.map((s: any) => ({
        id: s.id,
        name: s.fullName,
        role: s.role,
        email: s.email,
        phone: s.phone,
        salary: s.salary,
        startDate: s.startDate ? s.startDate.split('T')[0] : "",
        status: s.status === 'active' ? 'active' : 'inactive'
      }));
      setStaff(dbItems);
    } catch (err) {
      console.error("Fetch staff error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    role: "Thu ngân",
    email: "",
    phone: "",
    salary: 8000000,
    startDate: new Date().toISOString().split("T")[0],
    status: "active" as "active" | "inactive",
  });

  const filteredStaff = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStaff = async () => {
    try {
      const payload = {
        fullName: formData.name,
        role: formData.role,
        email: formData.email,
        phone: formData.phone,
        salary: formData.salary,
        startDate: new Date(formData.startDate).toISOString(),
        status: formData.status
      };
      await apiClient.post('/staff', payload);
      fetchStaff();
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error("Add staff failed:", err);
      alert("Thêm nhân viên thất bại!");
    }
  };

  const handleEditStaff = async () => {
    if (selectedStaff) {
      try {
        const payload = {
          fullName: formData.name,
          role: formData.role,
          email: formData.email,
          phone: formData.phone,
          salary: formData.salary,
          startDate: new Date(formData.startDate).toISOString(),
          status: formData.status
        };
        await apiClient.patch(`/staff/${selectedStaff.id}`, payload);
        fetchStaff();
        setShowEditModal(false);
        setSelectedStaff(null);
        resetForm();
      } catch (err) {
        console.error("Update staff failed:", err);
        alert("Cập nhật thất bại!");
      }
    }
  };

  const openEditModal = (s: Staff) => {
    setSelectedStaff(s);
    setFormData({
      name: s.name,
      role: s.role,
      email: s.email,
      phone: s.phone,
      salary: s.salary,
      startDate: s.startDate,
      status: s.status,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      role: "Thu ngân",
      email: "",
      phone: "",
      salary: 8000000,
      startDate: new Date().toISOString().split("T")[0],
      status: "active",
    });
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
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Quản lý nhân viên
            </h2>
            <p className="text-gray-600">Quản lý thông tin nhân viên</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#00d9b8] text-white rounded-lg hover:bg-[#00c4a7] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Thêm nhân viên
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm nhân viên..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Tổng nhân viên</p>
          <p className="text-2xl font-bold text-gray-800">{staff.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-green-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Đang làm việc</p>
          <p className="text-2xl font-bold text-green-600">
            {staff.filter((s) => s.status === "active").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Nghỉ việc</p>
          <p className="text-2xl font-bold text-red-600">
            {staff.filter((s) => s.status === "inactive").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Tổng lương</p>
          <p className="text-2xl font-bold text-blue-600">
            {(staff.reduce((sum, s) => sum + s.salary, 0) / 1000000).toFixed(1)}M
          </p>
        </div>
      </div>

      {/* Staff List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                  Nhân viên
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                  Chức vụ
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                  Liên hệ
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                  Lương
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                  Ngày vào làm
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                  Trạng thái
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#00d9b8] rounded-full flex items-center justify-center text-white font-bold">
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{s.name}</p>
                        <p className="text-xs text-gray-600">ID: {s.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {s.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail className="w-4 h-4" />
                        {s.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="w-4 h-4" />
                        {s.phone}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-gray-800">
                      {s.salary.toLocaleString()} đ
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-700">
                    {new Date(s.startDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="py-4 px-6">
                    {s.status === "active" ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Đang làm
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                        Nghỉ việc
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => openEditModal(s)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Thêm nhân viên mới</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="VD: Nguyễn Văn A"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chức vụ
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                >
                  <option value="Thu ngân">Thu ngân</option>
                  <option value="Kỹ thuật viên">Kỹ thuật viên</option>
                  <option value="Phục vụ">Phục vụ</option>
                  <option value="Bảo vệ">Bảo vệ</option>
                  <option value="Quản lý kho">Quản lý kho</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="email@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="0901234567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lương (đ/tháng)
                </label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày vào làm
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddStaff}
                  className="flex-1 px-4 py-2 bg-[#00d9b8] text-white rounded-lg hover:bg-[#00c4a7] transition-colors"
                >
                  Thêm nhân viên
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Chỉnh sửa {selectedStaff.name}
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedStaff(null);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chức vụ
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                >
                  <option value="Thu ngân">Thu ngân</option>
                  <option value="Kỹ thuật viên">Kỹ thuật viên</option>
                  <option value="Phục vụ">Phục vụ</option>
                  <option value="Bảo vệ">Bảo vệ</option>
                  <option value="Quản lý kho">Quản lý kho</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lương (đ/tháng)
                </label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày vào làm
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as "active" | "inactive" })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                >
                  <option value="active">Đang làm việc</option>
                  <option value="inactive">Nghỉ việc</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleEditStaff}
                  className="flex-1 px-4 py-2 bg-[#00d9b8] text-white rounded-lg hover:bg-[#00c4a7] transition-colors"
                >
                  Lưu thay đổi
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedStaff(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
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
