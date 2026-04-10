import { Product, Customer, DiscountCode, DashboardStats, Consultation, Message } from "../types/Cashier";
import { apiClient } from "../app/api";

// Mock data cho consultation (chưa có endpoint thật)
const mockConsultations: Consultation[] = [
  {
    id: 1,
    customerName: "Nguyễn Văn A",
    phone: "0901234567",
    date: "2024-03-31",
    time: "14:00",
    duration: "2 giờ",
    courtType: "Sân đơn",
    status: "pending",
    notes: "Khách hàng muốn đặt sân vào cuối tuần",
    messages: [
      { id: 1, sender: "customer", content: "Cho em hỏi cuối tuần có sân trống không ạ?", time: "13:45" },
      { id: 2, sender: "cashier", content: "Dạ có ạ, anh/chị muốn đặt sân nào và thời gian nào ạ?", time: "13:46" },
      { id: 3, sender: "customer", content: "Em muốn đặt sân đơn vào Chủ nhật lúc 2 giờ chiều được không?", time: "13:47" },
    ],
  },
  {
    id: 2,
    customerName: "Trần Thị B",
    phone: "0912345678",
    date: "2024-03-31",
    time: "16:00",
    duration: "1.5 giờ",
    courtType: "Sân đôi",
    status: "in-progress",
    notes: "Đang tư vấn về gói ưu đãi",
    messages: [
      { id: 1, sender: "customer", content: "Shop có ưu đãi gì cho khách đặt nhiều giờ không?", time: "15:30" },
      { id: 2, sender: "cashier", content: "Dạ có ạ, bên em có gói ưu đãi đặt từ 10 giờ trở lên giảm 15%", time: "15:32" },
    ],
  },
  {
    id: 3,
    customerName: "Lê Văn C",
    phone: "0923456789",
    date: "2024-03-30",
    time: "10:00",
    duration: "3 giờ",
    courtType: "Sân đơn",
    status: "completed",
    notes: "Đã hoàn thành tư vấn và đặt sân",
    messages: [
      { id: 1, sender: "customer", content: "Em muốn hỏi về giá thuê sân ạ", time: "09:45" },
      { id: 2, sender: "cashier", content: "Dạ giá sân đơn là 80k/giờ, sân đôi là 100k/giờ ạ.", time: "09:46" },
      { id: 3, sender: "customer", content: "Ok em đặt 3 giờ sáng mai từ 6h nhé", time: "09:48" },
      { id: 4, sender: "cashier", content: "Dạ em đã ghi nhận. Anh đặt cọc 50% là 120k nhé ạ", time: "09:49" },
    ],
  },
];

// Mock discount codes (chưa có endpoint thật)
const mockDiscountCodes: DiscountCode[] = [
  { code: "GIAM20K", type: "fixed", value: 20000, description: "Giảm 20.000đ" },
  { code: "GIAM10", type: "percent", value: 10, description: "Giảm 10%" },
  { code: "GIAM50K", type: "fixed", value: 50000, description: "Giảm 50.000đ" },
];

export const cashierService = {
  // ✅ Kết nối thật với GET /api/dashboard/cashier
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/dashboard/cashier');
    const raw = response.data;
    // API trả về { courts, today: { revenue, invoiceCount, bookings } }
    return {
      courts: raw.courts || [],
      today: {
        revenue: raw.today?.revenue || 0,
        invoiceCount: raw.today?.invoiceCount || 0,
        bookings: raw.today?.bookings || [],
      },
    } as DashboardStats;
  },

  // ✅ Kết nối thật với GET /api/products
  getProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get('/products');
    return response.data.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category || "Sản phẩm",
    })) as Product[];
  },

  // ✅ Kết nối thật với GET /api/customers?search=...
  searchCustomers: async (query: string): Promise<Customer[]> => {
    const response = await apiClient.get(`/customers${query ? `?search=${query}` : ''}`);
    // API trả về { data: [...], total, page, limit }
    const customers = response.data?.data || response.data || [];
    return customers.map((c: any) => ({
      id: c.id,
      name: c.fullName,
      phone: c.phone || '',
      email: c.email || '',
      points: c.points || 0,
      tier: c.points >= 2000 ? 'platinum' : c.points >= 1000 ? 'gold' : c.points >= 500 ? 'silver' : 'bronze',
      discount: c.points >= 2000 ? 15 : c.points >= 1000 ? 10 : c.points >= 500 ? 5 : 0,
    })) as Customer[];
  },

  // ✅ Kết nối thật với GET /api/promotions?code=...
  validateDiscountCode: async (code: string): Promise<DiscountCode | null> => {
    try {
      const response = await apiClient.get(`/promotions?code=${code}`);
      const promos = response.data;
      if (!promos || promos.length === 0) return null;
      const promo = promos[0];
      return {
        code: promo.code || code,
        type: promo.type?.toLowerCase() === 'percentage' ? 'percent' : 'fixed',
        value: promo.value,
        description: promo.name || promo.description || `Giảm ${promo.value}`,
      } as DiscountCode;
    } catch {
      // Fallback to mock if API doesn't support code lookup
      const found = mockDiscountCodes.find(d => d.code.toLowerCase() === code.toLowerCase());
      return found || null;
    }
  },

  // ✅ Kết nối thật với POST /api/invoices
  processPayment: async (paymentData: any): Promise<boolean> => {
    try {
      await apiClient.post('/invoices', paymentData);
      return true;
    } catch (err) {
      console.error("Payment error:", err);
      return false;
    }
  },

  // TODO: Replace with actual endpoint /api/consultations
  getConsultations: async (): Promise<Consultation[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockConsultations]), 600);
    });
  },

  // TODO: Replace with actual endpoint /api/consultations/:id/reply
  replyConsultation: async (id: number, message: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const consult = mockConsultations.find((c) => c.id === id);
        if (consult) {
          consult.messages.push({
            id: Date.now(),
            sender: "cashier",
            content: message,
            time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
          });
          resolve(true);
        } else {
          reject(new Error("Không tìm thấy yêu cầu tư vấn này"));
        }
      }, 400);
    });
  },
};
