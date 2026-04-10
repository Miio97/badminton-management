import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  X,
  Package
} from "lucide-react";
import { warehouseService } from "../../../services/warehouseService";

interface Product {
  id: number;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
  price: number;
  supplier: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
  activeStatus: "active" | "inactive";
}

const categories = ["Tất cả", "Vợt cầu lông", "Giày", "Phụ kiện", "Đồ uống"];
const statusOptions = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "in-stock", label: "Còn hàng" },
  { value: "low-stock", label: "Sắp hết" },
  { value: "out-of-stock", label: "Hết hàng" },
];

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Vợt cầu lông",
    stock: 0,
    minStock: 0,
    unit: "",
    price: 0,
    supplier: "",
    activeStatus: "active" as "active" | "inactive",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await warehouseService.getProductsForManagement();
        const mappedData = response.data.map((p: any) => ({
          ...p,
          category: p.category || "Hàng hóa",
          stock: p.stock || 0,
          minStock: p.minStock || 5,
          supplier: p.supplier || "N/A",
          status: p.stock === 0 ? "out-of-stock" : p.stock < 5 ? "low-stock" : "in-stock",
          activeStatus: p.status === "active" ? "active" : "inactive"
        }));
        setProducts(mappedData);
      } catch (err) {
        console.error("Fetch products error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Tất cả" || product.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || product.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAdd = () => {
    // Logic thêm mới có thể gọi API POST ở đây
    setShowAddModal(false);
    resetForm();
  };

  const handleUpdate = () => {
    // Logic cập nhật có thể gọi API PUT ở đây
    setEditingProduct(null);
    resetForm();
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      stock: product.stock,
      minStock: product.minStock,
      unit: product.unit,
      price: product.price,
      supplier: product.supplier,
      activeStatus: product.activeStatus,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "Vợt cầu lông",
      stock: 0,
      minStock: 0,
      unit: "",
      price: 0,
      supplier: "",
      activeStatus: "active",
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      "in-stock": "bg-green-100 text-green-700",
      "low-stock": "bg-orange-100 text-orange-700",
      "out-of-stock": "bg-red-100 text-red-700",
    };
    const labels = {
      "in-stock": "Còn hàng",
      "low-stock": "Sắp hết",
      "out-of-stock": "Hết hàng",
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getActiveStatusBadge = (activeStatus: string) => {
    if (activeStatus === "active") {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
          Đang bán
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
        Ngừng bán
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Quản lý sản phẩm</h2>
          <p className="text-gray-600">Quản lý danh sách sản phẩm trong kho</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#00d9b8] text-white rounded-lg hover:bg-[#00c4a7] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm sản phẩm
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00d9b8] appearance-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00d9b8] appearance-none"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Tổng sản phẩm</p>
          <p className="text-2xl font-bold text-gray-800">{isLoading ? "..." : filteredProducts.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Còn hàng</p>
          <p className="text-2xl font-bold text-green-600">
            {filteredProducts.filter((p) => p.status === "in-stock").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Sắp hết</p>
          <p className="text-2xl font-bold text-orange-600">
            {filteredProducts.filter((p) => p.status === "low-stock").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Hết hàng</p>
          <p className="text-2xl font-bold text-red-600">
            {filteredProducts.filter((p) => p.status === "out-of-stock").length}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sản phẩm</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Danh mục</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Tồn kho</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Giá nhập</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nhà cung cấp</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">TT Kho</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">TT Bán</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr><td colSpan={8} className="text-center py-10 text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{product.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-semibold text-gray-800">
                      {product.stock} {product.unit}
                    </span>
                    <p className="text-xs text-gray-500">Tối thiểu: {product.minStock}</p>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-gray-800">
                    {product.price.toLocaleString()} đ
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{product.supplier}</td>
                  <td className="px-4 py-3 text-center">{getStatusBadge(product.status)}</td>
                  <td className="px-4 py-3 text-center">{getActiveStatusBadge(product.activeStatus)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal (Bản rút gọn - bạn có thể thêm lại các input như cũ) */}
      {(showAddModal || editingProduct) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">{editingProduct ? "Cập nhật" : "Thêm mới"}</h3>
              <p className="text-gray-600 mb-6">Tính năng thêm/sửa đang được đồng bộ với API...</p>
              <button 
                onClick={() => { setShowAddModal(false); setEditingProduct(null); }}
                className="w-full bg-[#00d9b8] text-white py-2 rounded-lg"
              >
                Đóng
              </button>
           </div>
        </div>
      )}
    </div>
  );
}