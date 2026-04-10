import { Booking, AddBookingDto, Court } from "../types/Booking";

// Initial Mock variables
let mockBookings: Booking[] = [
  {
    id: 1,
    customerName: "Lê Văn C",
    phone: "0901234567",
    courtName: "Sân 4",
    date: new Date().toISOString().split("T")[0],
    time: "16:00",
    deposit: 100000,
    status: "pending",
  },
  {
    id: 2,
    customerName: "Võ Văn F",
    phone: "0912345678",
    courtName: "Sân 8",
    date: new Date().toISOString().split("T")[0],
    time: "17:00",
    deposit: 100000,
    status: "pending",
  },
  {
    id: 3,
    customerName: "Hoàng Thị G",
    phone: "0923456789",
    courtName: "Sân 2",
    date: new Date().toISOString().split("T")[0],
    time: "18:00",
    deposit: 50000,
    status: "confirmed",
  },
  {
    id: 4,
    customerName: "Đặng Văn H",
    phone: "0934567890",
    courtName: "Sân 6",
    date: new Date().toISOString().split("T")[0],
    time: "19:00",
    deposit: 0,
    status: "pending",
  },
];

const mockCourts: Court[] = [
  { id: 1, name: "Sân 1", status: "available", price: 80000 },
  { id: 2, name: "Sân 2", status: "occupied", price: 80000 },
  { id: 3, name: "Sân 3", status: "available", price: 80000 },
  { id: 4, name: "Sân 4", status: "maintenance", price: 100000 },
  { id: 5, name: "Sân 5", status: "available", price: 100000 },
  { id: 6, name: "Sân 6", status: "available", price: 100000 },
];

import { apiClient } from "../app/api";

export const bookingService = {
  // ✅ Kết nối thật với GET /api/bookings
  getAllBookings: async (): Promise<Booking[]> => {
    const response = await apiClient.get('/bookings');
    const raw = response.data?.data || response.data || [];
    return raw.map((b: any) => ({
      id: b.id,
      customerName: b.customer?.fullName || 'Khách vãng lai',
      phone: b.customer?.phone || 'N/A',
      courtName: b.details?.[0]?.court?.name || 'Sân ?',
      date: b.bookingDate ? new Date(b.bookingDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      time: b.details?.[0]?.startTime ? new Date(b.details[0].startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute:'2-digit' }) : '00:00',
      deposit: b.deposit || 0,
      status: b.status || 'pending', // Actually DB uses mapping or just we use pending
    })) as Booking[];
  },

  // ✅ Kết nối thật với POST /api/bookings
  addBooking: async (data: AddBookingDto): Promise<Booking> => {
    // Use provided courtId or fallback
    const courtId = data.courtId;

    // Calculate end time based on selected duration (hours)
    const [hours, minutes] = data.time.split(':');
    const endHoursNum = parseInt(hours) + data.duration;
    const endHours = String(endHoursNum).padStart(2, '0');
    const endMinutes = minutes;
    
    const response = await apiClient.post('/bookings', {
      customerId: data.customerId || 1, 
      deposit: data.deposit,
      details: [{
        courtId: courtId,
        date: data.date,
        startTime: `${data.date}T${data.time}:00`,
        endTime: `${data.date}T${endHours}:${endMinutes}:00`,
      }]
    });
    return response.data;
  },

  // ✅ Kết nối thật (chưa có endpoint confirm riêng, ta gọi PUT /api/crud/bookings/:id)
  confirmBooking: async (id: number): Promise<Booking> => {
    const response = await apiClient.put(`/crud/bookings/${id}`, {
      status: 'confirmed'
    });
    return response.data;
  },

  // ✅ Kết nối thật với GET /api/courts?status=available
  getAvailableCourts: async (): Promise<Court[]> => {
     try {
       const response = await apiClient.get('/crud/courts?status=available');
       const raw = response.data?.data || response.data || [];
       return raw.map((c: any) => ({
         id: c.id,
         name: c.name,
         status: c.status,
         price: c.hourlyPrice || 100000
       })) as Court[];
     } catch (err) {
       console.error("Get courts failed", err);
       return [];
     }
  }
};
