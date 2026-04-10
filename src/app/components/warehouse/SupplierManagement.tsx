import { useState, useEffect } from "react";
import { warehouseService } from "../../../services/warehouseService";
import {
  Search,
  Plus,
  Edit,
  X,
  Phone,
  Mail,
  MapPin,
  Truck,
  Loader2,
} from "lucide-react";

interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  products: string[];
  totalOrders: number;
  status: "active" | "inactive";
}



export function SupplierManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const fetchSuppliers = async () => {
    try {
      const response = await warehouseService.getSuppliersForManagement();
      const dbItems = response.data.map((s: any) => ({
        id: s.id,
        name: s.name,
        contactPerson: s.contactPerson || "N/A",
        phone: s.phone || "N/A",
        email: s.email || "N/A",
        address: s.address || "N/A",
        products: s.products ? s.products.split(',') : [],
        totalOrders: s._count?.StockEntry || 0,
        status: s.status === 'active' ? 'active' : 'inactive'
      }));
      setSuppliers(dbItems);
    } catch (err) {
      console.error("Fetch suppliers error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    products: "",
    status: "active" as "active" | "inactive",
  });

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = async () => {
    try {
      const payload = {
        name: formData.name,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        products: formData.products,
        status: formData.status
      };
      await warehouseService.createSupplier(payload);
      fetchSuppliers();
      setShowAddModal(false);
      resetForm();
    } catch (err) {
       console.error("Add supplier failed:", err);
       alert("Thêm nhà cung cấp thất bại!");
    }
  };

  const handleUpdate = async () => {
    if (editingSupplier) {
      try {
        const payload = {
          name: formData.name,
          contactPerson: formData.contactPerson,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          products: formData.products,
          status: formData.status
        };
        await warehouseService.updateSupplier(editingSupplier.id, payload);
        fetchSuppliers();
        setEditingSupplier(null);
        resetForm();
      } catch (err) {
         console.error("Update supplier failed:", err);
         alert("Cập nhật thất bại!");
      }
    }
  };

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      products: supplier.products.join(", "),
      status: supplier.status,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      products: "",
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Quản lý nhà cung cấp</h2>
          <p className="text-gray-600">Quản lý danh sách nhà cung cấp và đối tác</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#00d9b8] text-white rounded-lg hover:bg-[#00c4a7] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm nhà cung cấp
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm nhà cung cấp theo tên hoặc người liên hệ..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Tổng số NCC</p>
          <p className="text-2xl font-bold text-gray-800">{suppliers.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Đang hoạt động</p>
          <p className="text-2xl font-bold text-green-600">
            {suppliers.filter((s) => s.status === "active").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Tạm ngưng</p>
          <p className="text-2xl font-bold text-orange-600">
            {suppliers.filter((s) => s.status === "inactive").length}
          </p>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00d9b8] to-[#00c4a7] rounded-lg flex items-center justify-center">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{supplier.name}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        supplier.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {supplier.status === "active" ? "Hoạt động" : "Tạm ngưng"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-600">{supplier.contactPerson}</p>
                    <p className="text-gray-800 font-medium">{supplier.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                  <p className="text-gray-600">{supplier.email}</p>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <p className="text-gray-600">{supplier.address}</p>
                </div>
              </div>

              {/* Products */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Sản phẩm cung cấp:</p>
                <div className="flex flex-wrap gap-1">
                  {supplier.products.map((product, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-xs text-gray-500">Tổng đơn hàng</p>
                  <p className="text-lg font-bold text-gray-800">{supplier.totalOrders}</p>
                </div>
                <button
                  onClick={() => openEditModal(supplier)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Chỉnh sửa"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingSupplier) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                {editingSupplier ? "Chỉnh sửa nhà cung cấp" : "Thêm nhà cung cấp mới"}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingSupplier(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên nhà cung cấp *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                    placeholder="Nhập tên nhà cung cấp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Người liên hệ *
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                    placeholder="Tên người liên hệ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                    placeholder="0901234567"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                    placeholder="email@example.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ *
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                    placeholder="Địa chỉ đầy đủ"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sản phẩm cung cấp
                  </label>
                  <input
                    type="text"
                    value={formData.products}
                    onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                    placeholder="Vợt, Giày, Quần áo... (phân cách bằng dấu phẩy)"
                  />
                </div>
                {editingSupplier && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Tạm ngưng</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingSupplier(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={editingSupplier ? handleUpdate : handleAdd}
                  className="flex-1 px-4 py-2 bg-[#00d9b8] text-white rounded-lg hover:bg-[#00c4a7] transition-colors"
                >
                  {editingSupplier ? "Cập nhật" : "Thêm nhà cung cấp"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
