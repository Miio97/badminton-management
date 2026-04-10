export interface Court {
  id: number;
  name: string;
  status: "available" | "occupied" | "maintenance";
  type?: string;
  price?: number;
  currentBooking?: {
    startTime: string;
    customer: string;
  };
}

export interface Booking {
  id: number;
  customerName: string;
  phone: string;
  courtName: string;
  date: string;
  time: string;
  deposit: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export interface AddBookingDto {
  customerName: string;
  phone: string;
  courtName: string;
  date: string;
  time: string;
  deposit: number;
  courtId: number;
  customerId?: number;
  duration: number; // Trong giờ
}
