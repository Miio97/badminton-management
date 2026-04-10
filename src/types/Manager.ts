export interface Feedback {
  id: number;
  customerName: string;
  type: "complain" | "suggestion" | "praise";
  rating: number;
  message: string;
  date: string;
  status: "pending" | "processing" | "resolved";
  response?: string;
}

export interface Promotion {
  id: number;
  code: string;
  type: "percent" | "fixed";
  value: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  minOrderValue: number;
  status: "active" | "inactive" | "expired";
  description: string;
}
