export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  points: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
  discount: number; // % discount for loyalty tier
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface DiscountCode {
  code: string;
  type: "fixed" | "percent";
  value: number;
  description: string;
}

export interface DashboardStats {
  today: {
    bookings: any[];
    revenue: number;
    invoiceCount?: number;
  };
  courts: any[];
}

export interface Message {
  id: number;
  sender: "cashier" | "customer";
  content: string;
  time: string;
}

export interface Consultation {
  id: number;
  customerName: string;
  phone: string;
  date: string;
  time: string;
  duration: string;
  courtType: string;
  status: "pending" | "in-progress" | "completed";
  notes: string;
  messages: Message[];
}
