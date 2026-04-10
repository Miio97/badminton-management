import { Approval, ApprovalStatus } from "../types/Owner";
import { apiClient } from "../app/api";

export const ownerService = {
  // ✅ Kết nối thật: Lấy phiếu nhập kho cần duyệt
  getApprovals: async (): Promise<Approval[]> => {
    try {
      const response = await apiClient.get('/products/stock-receipts/list');
      const raw = response.data?.data || response.data || [];
      
      return raw.map((r: any) => ({
        id: r.id,
        type: "stock_entry",
        title: `Phiếu nhập ${String(r.id).padStart(6, '0')}`,
        description: r.notes || `Nhập hàng từ ${r.supplier?.name || "N/A"}`,
        requestedBy: r.staff?.fullName || "N/A",
        requestedAt: r.date,
        status: r.status === "pending" ? "pending" : (r.status === "rejected" ? "rejected" : "approved"),
        details: {
          supplier: r.supplier?.name || "N/A",
          totalCost: r.details?.reduce((sum: number, d: any) => sum + (d.quantity * d.unitPrice), 0) || 0,
          items: r.details?.map((d: any) => `${d.product?.name} (x${d.quantity})`).join(", "),
        },
      })) as Approval[];
    } catch (err) {
      console.error("Fetch approvals error:", err);
      return [];
    }
  },

  // ✅ Kết nối thật: Cập nhật trạng thái phiếu nhập kho
  updateApprovalStatus: async (id: number, status: ApprovalStatus): Promise<boolean> => {
    try {
      // Vì backend chưa có endpoint duyệt riêng, ta dùng autoCrud hoặc endpoint update status
      await apiClient.put(`/crud/stockreceipts/${id}`, {
        status: status === "approved" ? "approved" : "rejected"
      });
      return true;
    } catch (err) {
      console.error("Update approval error:", err);
      return false;
    }
  },
};
