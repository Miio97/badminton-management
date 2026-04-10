import { Feedback, Promotion } from "../types/Manager";
import { apiClient } from "../app/api";

const mockFeedback: Feedback[] = [
  {
    id: 1,
    customerName: "Nguyễn Văn A",
    type: "complain",
    rating: 2,
    message: "Sân 3 có vấn đề về ánh sáng, quá tối không thể chơi được",
    date: "2024-03-29 14:00",
    status: "pending",
  },
  {
    id: 2,
    customerName: "Trần Thị B",
    type: "suggestion",
    rating: 4,
    message: "Nên có thêm chỗ ngồi chờ cho khách hàng",
    date: "2024-03-29 10:30",
    status: "pending",
  },
  {
    id: 3,
    customerName: "Lê Văn C",
    type: "praise",
    rating: 5,
    message: "Nhân viên phục vụ rất tốt, nhiệt tình",
    date: "2024-03-28 16:00",
    status: "resolved",
    response: "Cảm ơn quý khách đã đánh giá tốt!",
  },
];

const mockPromotions: Promotion[] = [
  {
    id: 1,
    code: "SUMMER2024",
    type: "percent",
    value: 20,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    usageLimit: 1000,
    usedCount: 150,
    minOrderValue: 200000,
    status: "active",
    description: "Khuyến mãi mùa hè giảm 20% cho hóa đơn từ 200k",
  },
  {
    id: 2,
    code: "NEWBIE50K",
    type: "fixed",
    value: 50000,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    usageLimit: 500,
    usedCount: 450,
    minOrderValue: 100000,
    status: "active",
    description: "Giảm 50k cho khách hàng mới",
  },
  {
    id: 3,
    code: "FLASH",
    type: "percent",
    value: 50,
    startDate: "2024-03-25",
    endDate: "2024-03-26",
    usageLimit: 100,
    usedCount: 100,
    minOrderValue: 0,
    status: "expired",
    description: "Flash sale 50% trong 24h",
  },
];

export const managerService = {
  // ✅ Kết nối thật qua autoCrud: /api/crud/feedbacks
  getFeedbacks: async (): Promise<Feedback[]> => {
    const response = await apiClient.get('/crud/feedbacks');
    const raw = response.data?.data || response.data || [];
    return raw.map((f: any) => ({
      id: f.id,
      customerName: f.customerName,
      type: f.type || 'suggestion',
      rating: f.rating,
      message: f.comment,
      date: f.date,
      status: f.status || 'pending',
      response: f.reply,
    })) as Feedback[];
  },

  // ✅ Kết nối thật qua autoCrud PUT: /api/crud/feedbacks/:id
  replyFeedback: async (id: number, replyMessage: string): Promise<boolean> => {
    await apiClient.put(`/crud/feedbacks/${id}`, {
      reply: replyMessage,
      status: 'resolved'
    });
    return true;
  },

  // ✅ Kết nối thật qua autoCrud PUT: /api/crud/feedbacks/:id
  updateFeedbackStatus: async (id: number, status: "processing" | "resolved"): Promise<boolean> => {
    await apiClient.put(`/crud/feedbacks/${id}`, { status });
    return true;
  },

  // ✅ Kết nối thật với GET /api/promotions
  getPromotions: async (): Promise<Promotion[]> => {
    const response = await apiClient.get('/promotions');
    const raw = response.data || [];
    return raw.map((p: any) => ({
      id: p.id,
      code: p.code || p.name,
      type: p.type?.toLowerCase() === 'percentage' ? 'percent' : 'fixed',
      value: p.value,
      startDate: p.startDate,
      endDate: p.endDate,
      usageLimit: p.usageLimit || 999,
      usedCount: p.usedCount || 0,
      minOrderValue: p.minOrderValue || 0,
      status: p.status || 'active',
      description: p.notes || p.name,
    })) as Promotion[];
  },

  // ✅ Kết nối thật với POST /api/promotions
  createPromotion: async (promotion: any): Promise<Promotion> => {
    const response = await apiClient.post('/promotions', {
      name: promotion.code,
      type: promotion.type === 'percent' ? 'Percentage' : 'Fixed',
      value: promotion.value,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      notes: promotion.description,
      status: 'active'
    });
    return response.data;
  },
};
