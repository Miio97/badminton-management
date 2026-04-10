import { X } from "lucide-react";

interface Invoice {
  id: number;
  invoiceNumber: string;
  date: string;
  time: string;
  courtName: string;
  customerName: string;
  amount: number;
  paymentMethod: string;
  status: "paid" | "cancelled";
}

interface InvoiceDetailDialogProps {
  invoice: Invoice;
  onClose: () => void;
}

export function InvoiceDetailDialog({ invoice, onClose }: InvoiceDetailDialogProps) {
  const services = [
    { name: "Tiền sân (60 phút)", price: 100000 },
    { name: "Nước suối x2", price: 20000 },
    { name: "Thuê vợt x1", price: 20000 },
    { name: "Quả cầu x1", price: 80000 },
  ];

  const subtotal = services.reduce((sum, s) => sum + s.price, 0);
  const discount = 20000;
  const total = subtotal - discount;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Chi tiết hóa đơn</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-emerald-600 mb-2">BADMINTON CENTER</h2>
            <p className="text-gray-600">Hóa đơn thanh toán</p>
          </div>

          {/* Invoice Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Mã hóa đơn:</span>
              <span className="font-semibold">{invoice.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày:</span>
              <span className="font-medium">{formatDate(invoice.date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Giờ:</span>
              <span className="font-medium">{invoice.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sân:</span>
              <span className="font-medium">{invoice.courtName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Khách hàng:</span>
              <span className="font-medium">{invoice.customerName}</span>
            </div>
          </div>

          {/* Services */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-3">Chi tiết dịch vụ</h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Dịch vụ
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {services.map((service, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm">{service.name}</td>
                      <td className="px-4 py-2 text-sm text-right">
                        {service.price.toLocaleString("vi-VN")}đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tạm tính:</span>
              <span>{subtotal.toLocaleString("vi-VN")}đ</span>
            </div>
            <div className="flex justify-between text-sm text-red-600">
              <span>Giảm giá:</span>
              <span>-{discount.toLocaleString("vi-VN")}đ</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-lg font-bold">
              <span>Tổng cộng:</span>
              <span className="text-emerald-600">{total.toLocaleString("vi-VN")}đ</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-emerald-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Phương thức thanh toán:</span>
              <span className="font-semibold text-emerald-700">{invoice.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-700">Trạng thái:</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                Đã thanh toán
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 border-t pt-4">
            <p>Cảm ơn quý khách đã sử dụng dịch vụ!</p>
            <p>Hẹn gặp lại quý khách lần sau</p>
          </div>
        </div>

        <div className="border-t p-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
