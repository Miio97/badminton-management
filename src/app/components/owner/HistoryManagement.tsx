import { useState, useEffect } from "react";
import { Receipt, CreditCard, Filter, Download, Search, Loader2 } from "lucide-react";
import { apiClient } from "../../api";

interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
  date: string;
  paymentMethod: string;
}

interface Invoice {
  id: string;
  customerName: string;
  courtName: string;
  duration: number;
  amount: number;
  date: string;
  status: "paid" | "pending" | "cancelled";
  paymentMethod: string;
}

export function HistoryManagement() {
  const [activeTab, setActiveTab] = useState<"transactions" | "invoices">("transactions");
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      // 1. Fetch Invoices (Income)
      const invRes = await apiClient.get('/invoices');
      const rawInvoices = invRes.data || [];
      
      const mappedInvoices: Invoice[] = rawInvoices.map((inv: any) => ({
        id: `HD${inv.id}`,
        customerName: inv.customer?.fullName || "Khách lẻ",
        courtName: inv.details?.[0]?.court?.name || "N/A",
        duration: 0, // Need to calculate from startTime/endTime if available
        amount: inv.totalAmount,
        date: new Date(inv.invoiceDate).toLocaleDateString("vi-VN") + " " + new Date(inv.timeCreated).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }),
        status: "paid",
        paymentMethod: inv.paymentMethod
      }));

      // 2. Fetch Stock Receipts (Expense)
      const stockRes = await apiClient.get('/crud/stockreceipts');
      const rawStock = (stockRes.data as any).data || [];

      const mappedExpenses: Transaction[] = rawStock.map((s: any) => {
        // Find total amount from details if possible, or just mock it for now if details are not included
        const amount = s.totalAmount || 500000; // Database might not have totalAmount in StockReceipt directly
        return {
          id: `NK${s.id}`,
          type: "expense",
          category: "Nhập hàng",
          amount: amount,
          description: `Nhập hàng mã #${s.id}`,
          date: new Date(s.date).toLocaleDateString("vi-VN"),
          paymentMethod: "Chuyển khoản"
        };
      });

      const mappedIncome: Transaction[] = rawInvoices.map((inv: any) => ({
        id: `TX${inv.id}`,
        type: "income",
        category: inv.bookingId ? "Đặt sân" : "Bán lẻ",
        amount: inv.totalAmount,
        description: inv.bookingId ? `Thanh toán đặt sân #${inv.bookingId}` : "Bán lẻ sản phẩm",
        date: new Date(inv.invoiceDate).toLocaleDateString("vi-VN"),
        paymentMethod: inv.paymentMethod
      }));

      setInvoices(mappedInvoices);
      setTransactions([...mappedIncome, ...mappedExpenses].sort((a, b) => b.id.localeCompare(a.id)));

    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalIncome = transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#00d9b8]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Lịch sử</h2>
        <p className="text-gray-600">Giao dịch và hóa đơn</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">Tổng thu</p>
          <p className="text-3xl font-bold">{(totalIncome / 1000000).toFixed(1)}M đ</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Receipt className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">Tổng chi</p>
          <p className="text-3xl font-bold">{(totalExpense / 1000000).toFixed(1)}M đ</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Filter className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">Lợi nhuận ròng</p>
          <p className="text-3xl font-bold">
            {((totalIncome - totalExpense) / 1000000).toFixed(1)}M đ
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === "transactions"
                ? "text-[#00d9b8] border-b-2 border-[#00d9b8]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Giao dịch
          </button>
          <button
            onClick={() => setActiveTab("invoices")}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === "invoices"
                ? "text-[#00d9b8] border-b-2 border-[#00d9b8]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Hóa đơn
          </button>
        </div>

        {/* Search and Filter */}
        <div className="p-4 flex items-center gap-4 border-b">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#00d9b8] text-white rounded-lg hover:bg-[#00c4a7] transition-colors">
            <Download className="w-4 h-4" />
            Xuất file
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "transactions" ? (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        transaction.type === "income"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <CreditCard className="w-5 h-5" />
                      ) : (
                        <Receipt className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-800">
                          {transaction.description}
                        </h4>
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded">
                          {transaction.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>{transaction.id}</span>
                        <span>•</span>
                        <span>{transaction.date}</span>
                        <span>•</span>
                        <span>{transaction.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {transaction.amount.toLocaleString()} đ
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Mã HĐ
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Khách hàng
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Sân
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Thời gian
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Ngày
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Số tiền
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-800">
                        {invoice.id}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {invoice.customerName}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {invoice.courtName}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {invoice.duration} giờ
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {invoice.date}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-800">
                        {invoice.amount.toLocaleString()} đ
                      </td>
                      <td className="py-3 px-4">
                        {invoice.status === "paid" && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Đã thanh toán
                          </span>
                        )}
                        {invoice.status === "pending" && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                            Chưa thanh toán
                          </span>
                        )}
                        {invoice.status === "cancelled" && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                            Đã hủy
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
