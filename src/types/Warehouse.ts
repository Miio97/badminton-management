export interface Product {
  id: number;
  name: string;
  unit: string;
  lastPrice: number;
}

export interface Supplier {
  id: number;
  name: string;
}

export interface StockEntryItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface StockEntry {
  id: number;
  entryNumber: string;
  supplier: string;
  date: string;
  items: StockEntryItem[];
  totalAmount: number;
  status: "pending" | "approved" | "received" | "paid";
  createdBy: string;
  approvedBy?: string;
  notes?: string;
}
