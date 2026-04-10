import { useState, useEffect } from "react";
import {
  Clock,
  MapPin,
  Calendar,
  DollarSign,
  X,
  CheckCircle,
  XCircle,
  Hourglass,
  Filter,
  Loader2,
} from "lucide-react";
import { apiClient } from "../../api";

interface Booking {
  id: number;
  courtName: string;
  date: string;
  timeSlot: string;
  duration: number;
  price: number;
  status: "upcoming" | "completed" | "cancelled";
  bookingDate: string;
  paymentMethod: string;
  courtType: string;
}

export function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "upcoming" | "completed" | "cancelled">("all");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/bookings');
      const rawData = res.data.data || [];
      
      const mapped: Booking[] = rawData.map((b: any) => {
        const detail = b.details?.[0]; // Get first detail for summary
        const now = new Date();
        const bookingDate = new Date(detail?.date || b.bookingDate);
        
        let status: "upcoming" | "completed" | "cancelled" = "upcoming";
        if (bookingDate < now) status = "completed";
        // If there's an invoice, it's definitely paid/completed or ongoing
        
        const startTime = detail?.startTime ? new Date(detail.startTime).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }) : "00:00";
        const endTime = detail?.endTime ? new Date(detail.endTime).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }) : "00:00";

        return {
          id: b.id,
          courtName: detail?.court?.name || "N/A",
          courtType: detail?.court?.type?.name || "Tiêu chuẩn",
          date: detail?.date || b.bookingDate,
          timeSlot: `${startTime} - ${endTime}`,
          duration: 1, // Simplified
          price: b.deposit || 0,
          status: status,
          bookingDate: b.bookingDate,
          paymentMethod: b.invoices?.[0]?.paymentMethod || "Chưa thanh toán"
        };
      });

      setBookings(mapped);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#00d9b8]" />
      </div>
    );
  }

  const filteredBookings = bookings.filter((booking) => {
    if (filterStatus === "all") return true;
    return booking.status === filterStatus;
  });

  const handleCancelBooking = () => {
    if (selectedBooking) {
      setBookings(
        bookings.map((b) =>
          b.id === selectedBooking.id ? { ...b, status: "cancelled" as const } : b
        )
      );
      setShowCancelModal(false);
      setSelectedBooking(null);
    }
  };

  const openCancelModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      upcoming: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    const labels = {
      upcoming: "Sắp tới",
      completed: "Đã hoàn thành",
      cancelled: "Đã hủy",
    };
    const icons = {
      upcoming: <Hourglass className="w-3 h-3" />,
      completed: <CheckCircle className="w-3 h-3" />,
      cancelled: <XCircle className="w-3 h-3" />,
    };
    return (
      <span className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${badges[status as keyof typeof badges]}`}>
        {icons[status as keyof typeof icons]}
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const upcomingCount = bookings.filter((b) => b.status === "upcoming").length;
  const completedCount = bookings.filter((b) => b.status === "completed").length;
  const cancelledCount = bookings.filter((b) => b.status === "cancelled").length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Lịch sử đặt sân</h2>
        <p className="text-gray-600">Xem và quản lý các lượt đặt sân của bạn</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Tổng đặt sân</p>
          <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Sắp tới</p>
          <p className="text-2xl font-bold text-blue-600">{upcomingCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Đã hoàn thành</p>
          <p className="text-2xl font-bold text-green-600">{completedCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Đã hủy</p>
          <p className="text-2xl font-bold text-red-600">{cancelledCount}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Lọc theo:</span>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                filterStatus === "all"
                  ? "bg-[#00d9b8] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterStatus("upcoming")}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                filterStatus === "upcoming"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Sắp tới ({upcomingCount})
            </button>
            <button
              onClick={() => setFilterStatus("completed")}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                filterStatus === "completed"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Đã hoàn thành ({completedCount})
            </button>
            <button
              onClick={() => setFilterStatus("cancelled")}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                filterStatus === "cancelled"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Đã hủy ({cancelledCount})
            </button>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Không có lượt đặt sân nào
            </h3>
            <p className="text-gray-600">
              {filterStatus === "all"
                ? "Bạn chưa có lượt đặt sân nào"
                : `Không có lượt đặt sân ${filterStatus === "upcoming" ? "sắp tới" : filterStatus === "completed" ? "đã hoàn thành" : "đã hủy"}`}
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#00d9b8] to-[#00c4a7] rounded-lg flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{booking.courtName}</h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                          {booking.courtType}
                        </span>
                      </div>
                    </div>
                  </div>
                  {booking.status === "upcoming" && (
                    <button
                      onClick={() => openCancelModal(booking)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                    >
                      Hủy đặt sân
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">Ngày đặt</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {new Date(booking.date).toLocaleDateString("vi-VN", {
                          weekday: "short",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">Giờ chơi</p>
                      <p className="text-sm font-semibold text-gray-800">{booking.timeSlot}</p>
                      <p className="text-xs text-gray-500">({booking.duration} giờ)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">Tổng tiền</p>
                      <p className="text-sm font-semibold text-[#00d9b8]">
                        {booking.price.toLocaleString()} đ
                      </p>
                      <p className="text-xs text-gray-500">{booking.paymentMethod}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">Đặt lúc</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {new Date(booking.bookingDate).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Info for Upcoming */}
                {booking.status === "upcoming" && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <span className="text-gray-600">
                        Vui lòng có mặt trước giờ đặt 10 phút để nhận sân
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Xác nhận hủy đặt sân</h3>
                  <p className="text-sm text-gray-600">Bạn có chắc muốn hủy?</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sân:</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {selectedBooking.courtName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ngày:</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {new Date(selectedBooking.date).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Giờ:</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {selectedBooking.timeSlot}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2 mt-2">
                    <span className="text-sm text-gray-600">Số tiền:</span>
                    <span className="text-sm font-semibold text-red-600">
                      {selectedBooking.price.toLocaleString()} đ
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <p className="text-xs text-yellow-800">
                  ⚠️ Lưu ý: Sau khi hủy, bạn sẽ đ��ợc hoàn tiền 100% nếu hủy trước 24h. Hủy trong vòng 24h sẽ bị phạt 30%.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setSelectedBooking(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Đóng
                </button>
                <button
                  onClick={handleCancelBooking}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Xác nhận hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
