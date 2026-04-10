import { useState, useEffect } from "react";
import { X, Plus, Minus, Loader2 } from "lucide-react";
import { Court } from "../../types/Booking";
import { Product } from "../../types/Cashier";
import { cashierService } from "../../services/cashierService";

interface AddServiceDialogProps {
  court: Court;
  onClose: () => void;
}

export function AddServiceDialog({ court, onClose }: AddServiceDialogProps) {
  const [selectedServices, setSelectedServices] = useState<{ [key: number]: number }>({});
  const [availableServices, setAvailableServices] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    cashierService.getProducts().then((products) => {
      setAvailableServices(products);
      setIsLoading(false);
    });
  }, []);

  const handleQuantityChange = (serviceId: number, change: number) => {
    const currentQty = selectedServices[serviceId] || 0;
    const newQty = Math.max(0, currentQty + change);

    if (newQty === 0) {
      const updated = { ...selectedServices };
      delete updated[serviceId];
      setSelectedServices(updated);
    } else {
      setSelectedServices({
        ...selectedServices,
        [serviceId]: newQty,
      });
    }
  };

  const total = availableServices.reduce((sum, service) => {
    const qty = selectedServices[service.id] || 0;
    return sum + service.price * qty;
  }, 0);

  const handleConfirm = () => {
    // In a real app, this would update the court's services via an API call
    console.log("Services added to court: ", court.id, selectedServices);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Thêm dịch vụ - {court.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center py-6 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mb-2" />
              <p>Đang tải danh sách dịch vụ...</p>
            </div>
          ) : (
            availableServices.map((service) => {
              const quantity = selectedServices[service.id] || 0;
              return (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-gray-600">{service.price.toLocaleString("vi-VN")}đ</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(service.id, -1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className="w-8 text-center font-medium">{quantity}</span>

                    <button
                      onClick={() => handleQuantityChange(service.id, 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {total > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Tổng cộng:</span>
              <span className="text-lg font-bold text-emerald-600">
                {total.toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-3 p-4 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={total === 0 || isLoading}
            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:bg-gray-400"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
