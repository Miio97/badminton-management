import { useState, useEffect } from "react";
import { cashierService } from "../../services/cashierService";
import { DashboardStats } from "../../types/Cashier";
import { Court } from "../../types/Booking";
import {
  DollarSign,
  Clock,
  CalendarDays,
  TrendingUp,
  Play,
  CheckCircle,
  CreditCard,
  Plus,
  Loader2,
  AlertCircle
} from "lucide-react";
import { CourtPaymentDialog } from "./CourtPaymentDialog";
import { AddServiceDialog } from "./AddServiceDialog";

type CourtStatus = "available" | "occupied" | "maintenance";

export function CourtOperations() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showAddServiceDialog, setShowAddServiceDialog] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const dashboardStats = await cashierService.getDashboardStats();
      setData(dashboardStats);
      
      const dbCourts = dashboardStats.courts.map((c: any) => {
        const currentBooking = c.status === "in_use" ? {
          startTime: "14:00",
          customer: "Khách",
        } : undefined;

        // Map mocked statuses to UI statuses
        let uiStatus: CourtStatus = "available";
        if (c.status === "in_use") uiStatus = "occupied";
        if (c.status === "maintenance") uiStatus = "maintenance";

        return {
          id: c.id,
          name: c.name,
          status: uiStatus,
          type: c.type?.name,
          price: c.type?.hourlyPrice,
          currentBooking: currentBooking
        } as Court;
      });
      setCourts(dbCourts);
    } catch (err) {
      console.error("Fetch DB error:", err);
      setError("Không thể lấy dữ liệu dashboard. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusColor = (status: CourtStatus) => {
    switch (status) {
      case "occupied":
        return "bg-blue-50 border-blue-200";
      case "available":
        return "bg-white border-gray-200";
      case "maintenance":
        return "bg-orange-50 border-orange-200";
    }
  };

  const getStatusBadgeColor = (status: CourtStatus) => {
    switch (status) {
      case "occupied":
        return "bg-blue-600 text-white";
      case "available":
        return "bg-gray-500 text-white";
      case "maintenance":
        return "bg-orange-600 text-white";
    }
  };

  const getStatusText = (status: CourtStatus) => {
    switch (status) {
      case "occupied":
        return "Đang chơi";
      case "available":
        return "Trống";
      case "maintenance":
        return "Bảo trì"; // Dùng 'Bảo trì' như 'Chờ TT' trong mock
    }
  };

  const handleOpenCourt = (court: Court) => {
    const updatedCourts = courts.map((c) =>
      c.id === court.id
        ? {
            ...c,
            status: "occupied" as CourtStatus,
            currentBooking: {
              startTime: new Date().toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              customer: "Khách mới",
            },
          }
        : c
    );
    setCourts(updatedCourts);
  };

  const handleCompleteCourt = (court: Court) => {
    const updatedCourts = courts.map((c) =>
      c.id === court.id
        ? { ...c, status: "maintenance" as CourtStatus }
        : c
    );
    setCourts(updatedCourts);
  };

  const handlePayment = (court: Court) => {
    setSelectedCourt(court);
    setShowPaymentDialog(true);
  };

  const handleAddService = (court: Court) => {
    setSelectedCourt(court);
    setShowAddServiceDialog(true);
  };

  const confirmPayment = () => {
    if (selectedCourt) {
      const updatedCourts = courts.map((c) =>
        c.id === selectedCourt.id ? { ...c, status: "available" as CourtStatus } : c
      );
      setCourts(updatedCourts);
      setShowPaymentDialog(false);
      setSelectedCourt(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Đang tải biểu đồ và tình trạng sân...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-gray-800 font-medium mb-4">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const playingCount = courts.filter((c) => c.status === "occupied").length;
  const pendingPaymentCount = courts.filter((c) => c.status === "maintenance").length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Vận hành sân</h2>
        <p className="text-gray-600">Quản lý và theo dõi tình trạng các sân cầu lông</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Sân đang chơi</p>
              <p className="text-3xl font-bold text-gray-800">{playingCount}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Play className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Chờ thanh toán</p>
              <p className="text-3xl font-bold text-gray-800">{pendingPaymentCount}</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Lịch đặt hôm nay</p>
              <p className="text-3xl font-bold text-gray-800">{data?.today?.bookings?.length || 0}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <CalendarDays className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Doanh thu ca</p>
              <p className="text-xl font-bold text-gray-800">
                {(data?.today?.revenue || 0).toLocaleString("vi-VN")}đ
              </p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Court Diagram */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Sơ đồ sân</h3>
              
              {/* Legend */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-xs text-gray-600">Trống</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Đang chơi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Chờ TT</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Đặt trước</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {courts.map((court) => (
                <div
                  key={court.id}
                  className={`${getStatusColor(
                    court.status
                  )} border-2 rounded-lg p-4 hover:shadow-md transition-all`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-lg text-gray-800">{court.name}</h4>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusBadgeColor(court.status)}`}>
                      {getStatusText(court.status)}
                    </span>
                  </div>

                  {court.status !== "available" && (
                    <div className="text-sm space-y-1.5 mb-4 bg-white/50 rounded p-3 border border-gray-100">
                      {court.currentBooking?.customer && (
                        <p className="truncate text-gray-700">
                          <span className="font-medium">Khách:</span> {court.currentBooking.customer}
                        </p>
                      )}
                      {court.currentBooking?.startTime && (
                        <p className="text-gray-700">
                          <span className="font-medium">Giờ:</span> {court.currentBooking.startTime}
                        </p>
                      )}
                    </div>
                  )}

                  {court.status === "available" && (
                    <div className="h-24 flex items-center justify-center bg-gray-50 rounded mb-4 border border-gray-100">
                      <p className="text-gray-400 text-sm">Sẵn sàng sử dụng</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {court.status === "available" && (
                      <button
                        onClick={() => handleOpenCourt(court)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                      >
                        Mở sân
                      </button>
                    )}

                    {court.status === "occupied" && (
                      <>
                        <button
                          onClick={() => handleCompleteCourt(court)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 rounded text-xs font-medium transition-colors"
                        >
                          Hoàn tất
                        </button>
                        <button
                          onClick={() => handleAddService(court)}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-2 py-2 rounded text-xs font-medium transition-colors"
                        >
                          + Dịch vụ
                        </button>
                      </>
                    )}

                    {court.status === "maintenance" && (
                      <button
                        onClick={() => handlePayment(court)}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        Thanh toán
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Bookings */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-emerald-600" />
              Lịch đặt hôm nay
            </h3>
            <div className="space-y-3">
              {(data?.today?.bookings || []).map((booking: any) => (
                <div
                  key={booking.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-emerald-600 text-lg">
                      {new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                      {booking.details?.[0]?.court?.name || "Book"}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-800 mb-1">{booking.customer?.fullName}</p>
                  <p className="text-sm text-gray-600">{booking.customer?.phone}</p>
                </div>
              ))}
              {(!data?.today?.bookings || data.today.bookings.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">Không có lịch đặt hôm nay</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {showPaymentDialog && selectedCourt && (
        <CourtPaymentDialog
          court={selectedCourt}
          onClose={() => setShowPaymentDialog(false)}
          onSuccess={confirmPayment}
        />
      )}

      {showAddServiceDialog && selectedCourt && (
        <AddServiceDialog
          court={selectedCourt}
          onClose={() => setShowAddServiceDialog(false)}
        />
      )}
    </div>
  );
}