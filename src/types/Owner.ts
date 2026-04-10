export type ApprovalType =
  | "add_court"
  | "remove_court"
  | "price_change"
  | "peak_hours"
  | "supplier_payment"
  | "product_price_change"
  | "salary_payment"
  | "stock_entry";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface Approval {
  id: number;
  type: ApprovalType;
  title: string;
  description: string;
  requestedBy: string;
  requestedAt: string;
  status: ApprovalStatus;
  details: any;
}
