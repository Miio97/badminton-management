import { useState, useEffect } from "react";
import { X, CreditCard, Smartphone, Banknote, CheckCircle, Star, Search, User as UserIcon, Phone, Loader2 } from "lucide-react";
import { apiClient } from "../api";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  points: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
}

interface PaymentDialogProps {
  items: CartItem[];
  totalAmount: number;
  onClose: () => void;
  onSuccess: () => void;
}

type PaymentMethod = "cash" | "transfer" | "momo";

export function PaymentDialog({ items, totalAmount, onClose, onSuccess }: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Customer lookup states
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWalkInCustomer, setIsWalkInCustomer] = useState(false);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [earnedPoints, setEarnedPoints] = useState(0);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await apiClient.get('/customers');
        setCustomers(response.data);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Calculate points to earn (1 point per 10,000 VND)
  const calculatePoints = (amount: number) => {
    return Math.floor(amount / 10000);
  };

  useEffect(() => {
    if (!isWalkInCustomer && !selectedCustomer) {
      setEarnedPoints(calculatePoints(totalAmount));
    } else if (selectedCustomer && !isWalkInCustomer) {
      setEarnedPoints(calculatePoints(totalAmount));
    } else {
      setEarnedPoints(0);
    }
  }, [totalAmount, isWalkInCustomer, selectedCustomer]);

  const filteredCustomers = (customers || []).filter(
    (customer) =>
      (customer.name?.toLowerCase() || "").includes(customerSearchQuery.toLowerCase()) ||
      (customer.phone || "").includes(customerSearchQuery)
  );

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "platinum":
        return "from-purple-500 to-purple-600";
      case "gold":
        return "from-yellow-500 to-yellow-600";
      case "silver":
        return "from-gray-400 to-gray-500";
      case "bronze":
        return "from-orange-600 to-orange-700";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  const getTierName = (tier: string) => {
    switch (tier) {
      case "platinum":
        return "Bạch kim";
      case "gold":
        return "Vàng";
      case "silver":
        return "Bạc";
      case "bronze":
        return "Đồng";
      default:
        return tier;
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Real API call to create invoice
      const invoiceData = {
        customerId: selectedCustomer ? selectedCustomer.id : null,
        totalAmount: totalAmount,
        paymentMethod: paymentMethod,
        details: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.price
        }))
      };
      
      await apiClient.post('/invoices', invoiceData);
      
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Close after showing success
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (error) {
      console.error("Payment failed:", error);
      setIsProcessing(false);
      alert("Thanh toán thất bại. Vui lòng thử lại!");
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h3>
            <p className="text-gray-600">Cảm ơn quý khách đã mua hàng</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Thanh toán đơn hàng</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Loyalty Points Section */}
          <div className="bg-gradient-to-r from-[#00d9b8]/10 to-blue-50 rounded-lg p-4 border-2 border-[#00d9b8]/30">
            <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-[#00d9b8]" />
              Tích điểm thành viên
            </h4>

            {/* Walk-in Customer Checkbox */}
            <div className="mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isWalkInCustomer}
                  onChange={(e) => {
                    setIsWalkInCustomer(e.target.checked);
                    if (e.target.checked) {
                      setSelectedCustomer(null);
                      setShowCustomerSearch(false);
                    }
                  }}
                  className="w-4 h-4 text-[#00d9b8] border-gray-300 rounded focus:ring-[#00d9b8]"
                />
                <span className="text-sm text-gray-700 font-medium">
                  Khách hàng vãng lai (không tích điểm)
                </span>
              </label>
            </div>

            {!isWalkInCustomer && (
              <>
                {/* Customer Search */}
                {!selectedCustomer ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowCustomerSearch(!showCustomerSearch)}
                      className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-white border-2 border-[#00d9b8] text-[#00d9b8] rounded-lg hover:bg-[#00d9b8] hover:text-white transition-colors font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-5 h-5" />
                        <span>Tra cứu khách hàng thành viên</span>
                      </div>
                      <Search className="w-5 h-5" />
                    </button>

                    {showCustomerSearch && (
                      <div className="space-y-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={customerSearchQuery}
                            onChange={(e) => setCustomerSearchQuery(e.target.value)}
                            placeholder="Tìm theo tên hoặc số điện thoại..."
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8] text-sm"
                          />
                        </div>

                        <div className="max-h-48 overflow-y-auto space-y-2">
                          {filteredCustomers.map((customer) => (
                            <button
                              key={customer.id}
                              onClick={() => {
                                setSelectedCustomer(customer);
                                setShowCustomerSearch(false);
                                setCustomerSearchQuery("");
                              }}
                              className="w-full p-3 bg-white border border-gray-200 rounded-lg hover:border-[#00d9b8] hover:bg-[#00d9b8]/5 transition-colors text-left"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-[#00d9b8]/10 flex items-center justify-center text-[#00d9b8] font-bold text-sm">
                                    {(customer.name || "?").charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm text-gray-800">
                                      {customer.name}
                                    </p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                      <Phone className="w-3 h-3" />
                                      {customer.phone}
                                    </p>
                                  </div>
                                </div>
                                <div
                                  className={`px-2 py-1 rounded-full text-white text-xs font-bold bg-gradient-to-r ${getTierColor(
                                    customer.tier || "bronze"
                                  )}`}
                                >
                                  {getTierName(customer.tier || "bronze")}
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">Điểm hiện có:</span>
                                <span className="font-bold text-[#00d9b8] flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-[#00d9b8]" />
                                  {(customer.points || 0).toLocaleString()}
                                </span>
                              </div>
                            </button>
                          ))}

                          {filteredCustomers.length === 0 && (
                            <div className="text-center py-6 text-gray-500 text-sm">
                              {loading ? "Đang tải..." : "Không tìm thấy khách hàng"}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Selected Customer Info */
                  <div className="bg-white rounded-lg border-2 border-[#00d9b8] p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#00d9b8]/10 flex items-center justify-center text-[#00d9b8] font-bold text-lg">
                          {(selectedCustomer.name || "?").charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">
                            {selectedCustomer.name}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {selectedCustomer.phone}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedCustomer(null)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Hạng thành viên</p>
                        <div
                          className={`inline-block px-3 py-1 rounded-full text-white text-xs font-bold bg-gradient-to-r ${getTierColor(
                            selectedCustomer.tier || "bronze"
                          )}`}
                        >
                          {getTierName(selectedCustomer.tier || "bronze")}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Điểm hiện có</p>
                        <p className="text-lg font-bold text-[#00d9b8] flex items-center gap-1">
                          <Star className="w-4 h-4 fill-[#00d9b8]" />
                          {(selectedCustomer.points || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {earnedPoints > 0 && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">
                              Điểm sẽ nhận từ giao dịch này:
                            </p>
                            <p className="text-2xl font-bold text-green-600 flex items-center gap-2">
                              +{earnedPoints}
                              <Star className="w-5 h-5 fill-green-600" />
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Tổng điểm sau:</p>
                            <p className="text-lg font-bold text-[#00d9b8]">
                              {((selectedCustomer.points || 0) + earnedPoints).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          💡 1 điểm = 10.000đ chi tiêu
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {isWalkInCustomer && (
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-center">
                <UserIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 font-medium">
                  Khách vãng lai - Không tích điểm
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Khách hàng chưa đăng ký thành viên sẽ không nhận điểm thưởng
                </p>
              </div>
            )}
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-sm text-gray-700">Thông tin bổ sung (Tùy chọn)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Tên khách hàng"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Số điện thoại"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-3">Chi tiết đơn hàng</h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Sản phẩm
                    </th>
                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                      SL
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                      Đơn giá
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm">{item.name}</td>
                      <td className="px-4 py-3 text-sm text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        {item.price.toLocaleString("vi-VN")}đ
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium">
                        {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-gray-800">Tổng cộng:</span>
              <span className="text-emerald-600 text-2xl">
                {totalAmount.toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-3">Phương thức thanh toán</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                  paymentMethod === "cash"
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Banknote className="w-8 h-8 text-emerald-600" />
                <span className="font-medium">Tiền mặt</span>
              </button>

              <button
                onClick={() => setPaymentMethod("transfer")}
                className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                  paymentMethod === "transfer"
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <CreditCard className="w-8 h-8 text-blue-600" />
                <span className="font-medium">Chuyển khoản</span>
              </button>

              <button
                onClick={() => setPaymentMethod("momo")}
                className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                  paymentMethod === "momo"
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Smartphone className="w-8 h-8 text-pink-600" />
                <span className="font-medium">MoMo</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-white transition-colors font-medium"
            disabled={isProcessing}
          >
            Hủy
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Đang xử lý..." : "Xác nhận thanh toán"}
          </button>
        </div>
      </div>
    </div>
  );
}