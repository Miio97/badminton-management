import { useState } from "react";
import { X, CreditCard, Smartphone, Banknote } from "lucide-react";

interface Court {
  id: number;
  name: string;
  customerName?: string;
  amount?: number;
  duration?: number;
  startTime?: string;
}

interface PaymentDialogProps {
  court: Court;
  onClose: () => void;
  onConfirm: () => void;
}

type PaymentMethod = "cash" | "transfer" | "momo";

export function PaymentDialog({ court, onClose, onConfirm }: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");

  const services = [
    { name: "Nước suối", quantity: 2, price: 10000 },
    { name: "Thuê vợt", quantity: 1, price: 20000 },
  ];

  const subtotal = court.amount || 0;
  const servicesTotal = services.reduce((sum, s) => sum + s.quantity * s.price, 0);
  const total = subtotal + servicesTotal;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Thanh toán - {court.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Invoice Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-sm text-gray-700">Chi tiết hóa đơn</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Khách hàng:</span>
                <span className="font-medium">{court.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Giờ vào:</span>
                <span>{court.startTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thời gian:</span>
                <span>{court.duration} phút</span>
              </div>
            </div>

            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-medium">
                <span>Tiền sân:</span>
                <span>{subtotal.toLocaleString("vi-VN")}đ</span>
              </div>
            </div>

            {services.length > 0 && (
              <>
                <div className="border-t pt-2">
                  <p className="font-semibold text-sm text-gray-700 mb-2">Dịch vụ:</p>
                  {services.map((service, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {service.name} x{service.quantity}
                      </span>
                      <span>{(service.quantity * service.price).toLocaleString("vi-VN")}đ</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="border-t pt-2">
              <div className="flex justify-between text-lg font-bold text-emerald-600">
                <span>Tổng cộng:</span>
                <span>{total.toLocaleString("vi-VN")}đ</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-3">Phương thức thanh toán</h4>
            <div className="space-y-2">
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                  paymentMethod === "cash"
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-600" />
                <span className="font-medium">Tiền mặt</span>
              </button>

              <button
                onClick={() => setPaymentMethod("transfer")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                  paymentMethod === "transfer"
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Chuyển khoản</span>
              </button>

              <button
                onClick={() => setPaymentMethod("momo")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                  paymentMethod === "momo"
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Smartphone className="w-5 h-5 text-pink-600" />
                <span className="font-medium">MoMo</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-4 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Xác nhận thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}
