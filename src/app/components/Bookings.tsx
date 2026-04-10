import { useState, useEffect } from "react";
import { Plus, CheckCircle, Clock, Phone, Loader2, AlertCircle } from "lucide-react";
import { bookingService } from "../../services/bookingService";
import { Booking } from "../../types/Booking";
import { AddBookingDialog } from "./AddBookingDialog";

export function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.getAllBookings();
      setBookings(data);
    } catch (err) {
      console.error("Fetch bookings error:", err);
      setError("Không thể tải dữ liệu lịch đặt sân. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleConfirmBooking = async (id: number) => {
    try {
      await bookingService.confirmBooking(id);
      // Update state optimistically or re-fetch
      setBookings(
        bookings.map((booking) =>
          booking.id === id ? { ...booking, status: "confirmed" } : booking
        )
      );
    } catch (error) {
       console.error("Confirm booking error:", error);
       alert("Xác nhận trạng thái thất bại.");
    }
  };

  const handleBookingAdded = () => {
    setShowAddDialog(false);
    fetchBookings(); // refresh list
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const groupedBookings = bookings.reduce((acc, booking) => {
    if (!acc[booking.date]) {
      acc[booking.date] = [];
    }
    acc[booking.date].push(booking);
    return acc;
  }, {} as { [key: string]: Booking[] });

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Đang tải dữ liệu lịch đặt sân...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-gray-800 font-medium mb-4">{error}</p>
        <button 
          onClick={fetchBookings}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Lịch đặt sân</h2>
        <button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Thêm lịch đặt sân
        </button>
      </div>

      {Object.keys(groupedBookings).length === 0 ? (
         <div className="text-center py-12 bg-white rounded-lg shadow">
           <p className="text-gray-500">Chưa có lịch đặt sân nào.</p>
         </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedBookings).map(([date, dateBookings]) => (
            <div key={date} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-emerald-600 text-white px-6 py-3">
                <h3 className="font-semibold">{formatDate(date)}</h3>
              </div>

              <div className="divide-y">
                {dateBookings.map((booking) => (
                  <div key={booking.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-bold text-emerald-600">{booking.time}</span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                            {booking.courtName}
                          </span>
                          {booking.status === "confirmed" ? (
                            <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                              <CheckCircle className="w-4 h-4" />
                              Đã xác nhận
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
                              <Clock className="w-4 h-4" />
                              Chờ xác nhận
                            </span>
                          )}
                        </div>

                        <div className="space-y-1">
                          <p className="font-medium text-gray-900">{booking.customerName}</p>
                          <p className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            {booking.phone}
                          </p>
                          <p className="text-sm text-gray-600">
                            Tiền cọc: {booking.deposit.toLocaleString("vi-VN")}đ
                          </p>
                        </div>
                      </div>

                      {booking.status === "pending" && (
                        <button
                          onClick={() => handleConfirmBooking(booking.id)}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                        >
                          Xác nhận vào sân
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddDialog && <AddBookingDialog onClose={() => setShowAddDialog(false)} onSuccess={handleBookingAdded} />}
    </div>
  );
}
