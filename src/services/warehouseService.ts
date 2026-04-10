import { StockEntry, Product, Supplier } from "../types/Warehouse";
import { apiClient } from "../app/api";

const mockStockEntries: StockEntry[] = [
  {
    id: 1,
    entryNumber: "PN2024030001",
    supplier: "Yonex Vietnam",
    date: "2024-03-28",
    items: [
      { productId: 1, productName: "Vợt cầu lông Yonex Astrox 99", quantity: 10, unitPrice: 4500000, total: 45000000 },
      { productId: 2, productName: "Quả cầu Yonex AS50", quantity: 20, unitPrice: 320000, total: 6400000 },
    ],
    totalAmount: 51400000,
    status: "paid",
    createdBy: "Nguyễn Văn A",
    approvedBy: "Trần Văn B",
  },
  {
    id: 2,
    entryNumber: "PN2024030002",
    supplier: "Lining Store",
    date: "2024-03-29",
    items: [
      { productId: 3, productName: "Giày cầu lông Lining Cloud Ace", quantity: 5, unitPrice: 2200000, total: 11000000 },
    ],
    totalAmount: 11000000,
    status: "approved",
    createdBy: "Nguyễn Văn A",
    approvedBy: "Trần Văn B",
  },
  {
    id: 3,
    entryNumber: "PN2024030003",
    supplier: "Victor Vietnam",
    date: "2024-03-30",
    items: [
      { productId: 4, productName: "Vợt cầu lông Victor Thruster", quantity: 8, unitPrice: 3800000, total: 30400000 },
    ],
    totalAmount: 30400000,
    status: "pending",
    createdBy: "Nguyễn Văn A",
  },
];

const mockProducts: Product[] = [
  { id: 1, name: "Vợt cầu lông Yonex Astrox 99", unit: "cái", lastPrice: 4500000 },
  { id: 2, name: "Quả cầu Yonex AS50", unit: "hộp", lastPrice: 320000 },
  { id: 3, name: "Giày cầu lông Lining Cloud Ace", unit: "đôi", lastPrice: 2200000 },
  { id: 4, name: "Vợt cầu lông Victor Thruster", unit: "cái", lastPrice: 3800000 },
  { id: 5, name: "Nước suối Lavie", unit: "chai", lastPrice: 5000 },
];

const mockSuppliers: Supplier[] = [
  { id: 1, name: "Yonex Vietnam" },
  { id: 2, name: "Lining Store" },
  { id: 3, name: "Victor Vietnam" },
  { id: 4, name: "Lavie Distribution" },
];

export const warehouseService = {
  // ✅ Kết nối thật với GET /api/products/stock-receipts/list
  getStockEntries: async (): Promise<StockEntry[]> => {
    const response = await apiClient.get('/products/stock-receipts/list');
    const raw = response.data?.data || response.data || [];
    return raw.map((r: any) => ({
      id: r.id,
      entryNumber: `PN${String(r.id).padStart(6, '0')}`,
      supplier: r.supplier?.name || 'N/A',
      date: r.date,
      totalAmount: r.details?.reduce((sum: number, d: any) => sum + (d.quantity * d.unitPrice), 0) || 0,
      status: r.status || 'pending',
      createdBy: r.staff?.fullName || 'N/A',
      notes: r.notes,
      items: r.details?.map((d: any) => ({
        productId: d.productId,
        productName: d.product?.name || 'N/A',
        quantity: d.quantity,
        unitPrice: d.unitPrice,
        total: d.quantity * d.unitPrice,
      })) || [],
    })) as StockEntry[];
  },

  // ✅ Kết nối thật với POST /api/products/stock-receipts
  createStockEntry: async (entry: any): Promise<StockEntry> => {
    const response = await apiClient.post('/products/stock-receipts', {
      supplierId: entry.supplierId, // Cần pass ID
      notes: entry.notes,
      details: entry.items.map((i: any) => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        unit: i.unit || 'Cái'
      }))
    });
    return response.data;
  },

  // ✅ Kết nối thật với GET /api/products
  getProductsForEntry: async (): Promise<Product[]> => {
    const response = await apiClient.get('/products?status=active');
    const raw = response.data?.data || response.data || [];
    return raw.map((p: any) => ({
      id: p.id,
      name: p.name,
      unit: p.unit,
      lastPrice: p.price
    })) as Product[];
  },

  // ✅ Kết nối thật với GET /api/products/suppliers/list
  getSuppliersForEntry: async (): Promise<Supplier[]> => {
    const response = await apiClient.get('/products/suppliers/list?status=active');
    const raw = response.data?.data || response.data || [];
    return raw.map((s: any) => ({
      id: s.id,
      name: s.name
    })) as Supplier[];
  },

  getProductsForManagement: async () => {
    const response = await apiClient.get('/products');
    return response.data;
  },

  getSuppliersForManagement: async () => {
    const response = await apiClient.get('/products/suppliers/list');
    return response.data;
  },

  createSupplier: async (payload: any) => {
    const response = await apiClient.post('/products/suppliers', payload);
    return response.data;
  },

  updateSupplier: async (id: number, payload: any) => {
    const response = await apiClient.put(`/products/suppliers/${id}`, payload);
    return response.data;
  },
};
