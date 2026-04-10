import { useState, useEffect } from "react";
import {
  Plus,
  X,
  FileText,
  Calendar,
  Package,
  DollarSign,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react";

import { StockEntry as StockEntryType, StockEntryItem, Product, Supplier } from "../../../types/Warehouse";
import { warehouseService } from "../../../services/warehouseService";

export function StockEntry() {
  const [stockEntries, setStockEntries] = useState<StockEntryType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEntry, setSelectedEntry] = useState<StockEntryType | null>(null);

  // Form state
  const [supplierId, setSupplierId] = useState<number | "">("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [items, setItems] = useState<StockEntryItem[]>([]);
  const [notes, setNotes] = useState("");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [entriesData, productsData, suppliersData] = await Promise.all([
        warehouseService.getStockEntries(),
        warehouseService.getProductsForEntry(),
        warehouseService.getSuppliersForEntry()
      ]);
      setStockEntries(entriesData);
      setProducts(productsData);
      setSuppliers(suppliersData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredEntries = stockEntries.filter((entry) => {
    const matchesSearch =
      entry.entryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || entry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const addItem = () => {
    setItems([
      ...items,
      { productId: 0, productName: "", quantity: 1, unitPrice: 0, total: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof StockEntryItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field === "quantity" || field === "unitPrice") {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    setItems(newItems);
  };

  const handleProductSelect = (index: number, productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      updateItem(index, "productId", product.id);
      updateItem(index, "productName", product.name);
      updateItem(index, "unitPrice", product.lastPrice);
    }
  };

  const getTotalAmount = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Chờ phê duyệt", icon: Clock },
      approved: { bg: "bg-blue-100", text: "text-blue-700", label: "Đã phê duyệt", icon: CheckCircle },
      received: { bg: "bg-green-100", text: "text-green-700", label: "Đã nhận hàng", icon: Package },
      paid: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Đã thanh toán", icon: DollarSign },
    };
    const config = badges[status as keyof typeof badges];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const handleSubmit = async () => {
    if (!supplierId || items.length === 0) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      await warehouseService.createStockEntry({
        supplierId: Number(supplierId),
        date,
        items,
        totalAmount: getTotalAmount(),
        createdBy: "Nguyễn Văn A", // Should come from Auth context
        notes,
      });

      setShowCreateModal(false);
      fetchData(); // reload
      
      // Reset form
      setSupplierId("");
      setDate(new Date().toISOString().split("T")[0]);
      setItems([]);
      setNotes("");
    } catch (err) {
      alert("Lỗi khi tạo phiếu nhập");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Nhập hàng</h2>
          <p className="text-gray-600">Quản lý phiếu nhập hàng và lịch sử nhập kho</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#00d9b8] text-white rounded-lg hover:bg-[#00c4a7] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tạo phiếu nhập mới
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo mã phiếu hoặc nhà cung cấp..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00d9b8] appearance-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ phê duyệt</option>
              <option value="approved">Đã phê duyệt</option>
              <option value="received">Đã nhận hàng</option>
              <option value="paid">Đã thanh toán</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Chờ phê duyệt</p>
          <p className="text-2xl font-bold text-yellow-600">
            {stockEntries.filter((e) => e.status === "pending").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Đã phê duyệt</p>
          <p className="text-2xl font-bold text-blue-600">
            {stockEntries.filter((e) => e.status === "approved").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Đã nhận hàng</p>
          <p className="text-2xl font-bold text-green-600">
            {stockEntries.filter((e) => e.status === "received").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Đã thanh toán</p>
          <p className="text-2xl font-bold text-emerald-600">
            {stockEntries.filter((e) => e.status === "paid").length}
          </p>
        </div>
      </div>

      {/* Entry List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Mã phiếu</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nhà cung cấp</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ngày nhập</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Tổng tiền</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Trạng thái</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Người tạo</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-800">{entry.entryNumber}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{entry.supplier}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(entry.date).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-right text-gray-800">
                    {entry.totalAmount.toLocaleString()} đ
                  </td>
                  <td className="px-4 py-3 text-center">{getStatusBadge(entry.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{entry.createdBy}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setSelectedEntry(entry)}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Entry Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-800">Tạo phiếu nhập mới</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhà cung cấp *
                  </label>
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                  >
                    <option value="">Chọn nhà cung cấp</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày nhập *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                  />
                </div>
              </div>

              {/* Items */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">Danh sách sản phẩm</h4>
                  <button
                    onClick={addItem}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm sản phẩm
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-3 items-start p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-600 mb-1">Sản phẩm</label>
                          <select
                            value={item.productId}
                            onChange={(e) => handleProductSelect(index, Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                          >
                            <option value={0}>Chọn sản phẩm</option>
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Số lượng</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Đơn giá</label>
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(index, "unitPrice", Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Thành tiền</label>
                          <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded text-sm font-medium text-gray-800">
                            {item.total.toLocaleString()} đ
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(index)}
                        className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {items.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Chưa có sản phẩm nào. Nhấn "Thêm sản phẩm" để bắt đầu.
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                  placeholder="Thêm ghi chú cho phiếu nhập..."
                />
              </div>

              {/* Total */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#00d9b8]/10 to-[#00d9b8]/5 rounded-lg mb-6">
                <span className="text-lg font-semibold text-gray-800">Tổng cộng:</span>
                <span className="text-2xl font-bold text-[#00d9b8]">
                  {getTotalAmount().toLocaleString()} đ
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-[#00d9b8] text-white rounded-lg hover:bg-[#00c4a7] transition-colors"
                >
                  Gửi đơn cho quản lý
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Entry Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{selectedEntry.entryNumber}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedEntry.supplier}</p>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Info */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Ngày nhập</p>
                  <p className="text-sm font-medium text-gray-800">
                    {new Date(selectedEntry.date).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Trạng thái</p>
                  {getStatusBadge(selectedEntry.status)}
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Người tạo</p>
                  <p className="text-sm font-medium text-gray-800">{selectedEntry.createdBy}</p>
                </div>
                {selectedEntry.approvedBy && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Người phê duyệt</p>
                    <p className="text-sm font-medium text-gray-800">{selectedEntry.approvedBy}</p>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Danh sách sản phẩm</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Sản phẩm</th>
                        <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700">SL</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Đơn giá</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedEntry.items.map((item: StockEntryItem, idx: number) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 text-sm text-gray-800">{item.productName}</td>
                          <td className="px-4 py-2 text-sm text-center text-gray-800">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-right text-gray-800">
                            {item.unitPrice.toLocaleString()} đ
                          </td>
                          <td className="px-4 py-2 text-sm text-right font-medium text-gray-800">
                            {item.total.toLocaleString()} đ
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-right font-semibold text-gray-800">
                          Tổng cộng:
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-[#00d9b8] text-lg">
                          {selectedEntry.totalAmount.toLocaleString()} đ
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Notes */}
              {selectedEntry.notes && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Ghi chú</p>
                  <p className="text-sm text-gray-800">{selectedEntry.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}