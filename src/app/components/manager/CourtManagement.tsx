import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Clock,
  DollarSign,
  MapPin,
  Send,
  X,
  Loader2,
} from "lucide-react";
import { apiClient } from "../../api";

interface Court {
  id: number;
  name: string;
  type: string;
  price: number;
  status: "active" | "inactive" | "maintenance";
  peakHours: string;
}



export function CourtManagement() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPriceProposal, setShowPriceProposal] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);

  const fetchCourts = async () => {
    try {
      const response = await apiClient.get('/courts');
      const dbItems = response.data.map((c: any) => ({
         id: c.id,
         name: c.name,
         type: c.type?.name || "Tiêu chuẩn",
         price: c.type?.hourlyPrice || 100000,
         status: c.status === 'maintenance' ? 'maintenance' : (c.status === 'in_use' || c.status === 'available' ? 'active' : 'inactive'),
         peakHours: "18:00 - 21:00"
      }));
      setCourts(dbItems);
    } catch (err) {
      console.error("Fetch courts error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    type: "Tiêu chuẩn",
    price: 100000,
    peakHours: "18:00 - 21:00",
    status: "active" as "active" | "inactive" | "maintenance",
  });
  const [proposalReason, setProposalReason] = useState("");

  const handleAddCourt = async () => {
    try {
       await apiClient.post('/courts', {
         name: formData.name,
         status: 'available',
         // type is more complex as it needs a CourtTypeId, simplified for this phase
       });
       fetchCourts();
       setShowAddForm(false);
       resetForm();
    } catch (err) {
       console.error("Add court error:", err);
       alert("Thêm sân thất bại!");
    }
  };

  const handleEditCourt = async () => {
    if (selectedCourt) {
      try {
        await apiClient.patch(`/courts/${selectedCourt.id}`, {
          name: formData.name,
          status: formData.status === 'active' ? 'available' : formData.status
        });
        fetchCourts();
        setShowEditForm(false);
        setSelectedCourt(null);
        resetForm();
      } catch (err) {
        console.error("Edit court error:", err);
        alert("Cập nhật thất bại!");
      }
    }
  };

  const handlePriceProposal = () => {
    alert(`Đề xuất sửa giá ${selectedCourt?.name} đã được gửi đến chủ sân để phê duyệt`);
    setShowPriceProposal(false);
    setSelectedCourt(null);
    setProposalReason("");
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "Tiêu chuẩn",
      price: 100000,
      peakHours: "18:00 - 21:00",
      status: "active",
    });
  };

  const openEditForm = (court: Court) => {
    setSelectedCourt(court);
    setFormData({
      name: court.name,
      type: court.type,
      price: court.price,
      peakHours: court.peakHours,
      status: court.status,
    });
    setShowEditForm(true);
  };

  const openPriceProposal = (court: Court) => {
    setSelectedCourt(court);
    setFormData({
      name: court.name,
      type: court.type,
      price: court.price,
      peakHours: court.peakHours,
      status: court.status,
    });
    setShowPriceProposal(true);
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Quản lý sân</h2>
            <p className="text-gray-600">Quản lý thông tin sân cầu lông</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#00d9b8] text-white rounded-lg hover:bg-[#00c4a7] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Thêm sân mới
          </button>
        </div>
      </div>

      {/* Courts List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                Tên sân
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                Loại
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                Giá
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                Trạng thái
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                Peak hours
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {courts.map((court) => (
              <tr key={court.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-800">{court.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-700">{court.type}</td>
                <td className="py-4 px-6">
                  <span className="font-semibold text-gray-800">
                    {court.price.toLocaleString()} đ/h
                  </span>
                </td>
                <td className="py-4 px-6">
                  {court.status === "active" && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Hoạt động
                    </span>
                  )}
                  {court.status === "inactive" && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                      Không hoạt động
                    </span>
                  )}
                  {court.status === "maintenance" && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                      Bảo trì
                    </span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {court.peakHours}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditForm(court)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openPriceProposal(court)}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Đề xuất sửa giá"
                    >
                      <DollarSign className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Court Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Thêm sân mới</h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
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
                  Tên sân
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="VD: Sân 10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại sân
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                >
                  <option value="Tiêu chuẩn">Tiêu chuẩn</option>
                  <option value="Cao cấp">Cao cấp</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá (đ/giờ)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giờ cao điểm
                </label>
                <input
                  type="text"
                  value={formData.peakHours}
                  onChange={(e) =>
                    setFormData({ ...formData, peakHours: e.target.value })
                  }
                  placeholder="VD: 18:00 - 21:00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddCourt}
                  className="flex-1 px-4 py-2 bg-[#00d9b8] text-white rounded-lg hover:bg-[#00c4a7] transition-colors"
                >
                  Thêm sân
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
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

      {/* Edit Court Modal */}
      {showEditForm && selectedCourt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Chỉnh sửa {selectedCourt.name}
              </h3>
              <button
                onClick={() => {
                  setShowEditForm(false);
                  setSelectedCourt(null);
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
                  Tên sân
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
                  Loại sân
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                >
                  <option value="Tiêu chuẩn">Tiêu chuẩn</option>
                  <option value="Cao cấp">Cao cấp</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá (đ/giờ)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giờ cao điểm
                </label>
                <input
                  type="text"
                  value={formData.peakHours}
                  onChange={(e) =>
                    setFormData({ ...formData, peakHours: e.target.value })
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
                    setFormData({ ...formData, status: e.target.value as "active" | "inactive" | "maintenance" })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                  <option value="maintenance">Bảo trì</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleEditCourt}
                  className="flex-1 px-4 py-2 bg-[#00d9b8] text-white rounded-lg hover:bg-[#00c4a7] transition-colors"
                >
                  Lưu thay đổi
                </button>
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setSelectedCourt(null);
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

      {/* Price Proposal Modal */}
      {showPriceProposal && selectedCourt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Đề xuất sửa giá {selectedCourt.name}
              </h3>
              <button
                onClick={() => {
                  setShowPriceProposal(false);
                  setSelectedCourt(null);
                  setProposalReason("");
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
                  Giá mới (đ/giờ)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Giá hiện tại: {selectedCourt.price.toLocaleString()} đ/giờ
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do đề xuất
                </label>
                <textarea
                  value={proposalReason}
                  onChange={(e) => setProposalReason(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                  placeholder="Nhập lý do đề xuất thay đổi giá..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handlePriceProposal}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Gửi đề xuất
                </button>
                <button
                  onClick={() => {
                    setShowPriceProposal(false);
                    setSelectedCourt(null);
                    setProposalReason("");
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
