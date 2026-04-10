import { useState, useEffect } from "react";
import {
  DollarSign,
  Calendar,
  Edit,
  Check,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Save,
  X,
  Users,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { apiClient } from "../../api";

interface SalaryRecord {
  id: number;
  staffId: number;
  staffName: string;
  role: string;
  baseSalary: number;
  bonus: number;
  deduction: number;
  totalSalary: number;
  month: string;
  status: "pending" | "paid";
}

// Count-up animation hook
function useCountUp(end: number, duration: number = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
}

export function SalaryManagement() {
  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editBonus, setEditBonus] = useState(0);
  const [editDeduction, setEditDeduction] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "pending">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSalaries();
    setIsLoaded(true);
  }, []);

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      // We fetch staff to get their names and positions
      const staffRes = await apiClient.get('/staff');
      const staffList = staffRes.data || [];
      
      // We fetch monthly salaries
      const salariesRes = await apiClient.get('/crud/monthlysalarys');
      const rawSalaries = (salariesRes.data as any).data || [];

      const mappedSalaries: SalaryRecord[] = rawSalaries.map((s: any) => {
        const staffMember = staffList.find((st: any) => st.id === s.staffId);
        return {
          id: s.id,
          staffId: s.staffId,
          staffName: staffMember?.fullName || "Nhân viên " + s.staffId,
          role: staffMember?.position || "N/A",
          baseSalary: s.mainSalary || 0,
          bonus: s.bonusPenalty > 0 ? s.bonusPenalty : 0,
          deduction: s.bonusPenalty < 0 ? Math.abs(s.bonusPenalty) : 0,
          totalSalary: (s.mainSalary || 0) + (s.bonusPenalty || 0),
          month: s.monthYear,
          status: "paid", // Local state usually handles paid status if not in DB
        };
      });

      setSalaryRecords(mappedSalaries);
    } catch (error) {
      console.error("Failed to fetch salaries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: SalaryRecord) => {
    setEditingId(record.id);
    setEditBonus(record.bonus);
    setEditDeduction(record.deduction);
  };

  const handleSave = async (id: number) => {
    const record = salaryRecords.find((r) => r.id === id);
    if (!record) return;

    try {
      const netAdjustment = editBonus - editDeduction;
      await apiClient.put(`/crud/monthlysalarys/${id}`, {
        bonusPenalty: netAdjustment,
      });

      setSalaryRecords(
        salaryRecords.map((r) =>
          r.id === id
            ? {
                ...r,
                bonus: editBonus,
                deduction: editDeduction,
                totalSalary: r.baseSalary + netAdjustment,
              }
            : r
        )
      );
      setEditingId(null);
    } catch (error) {
      alert("Lỗi khi cập nhật lương");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditBonus(0);
    setEditDeduction(0);
  };

  const handlePay = (id: number) => {
    setSalaryRecords(
      salaryRecords.map((record) =>
        record.id === id ? { ...record, status: "paid" as const } : record
      )
    );
  };

  // Filter and search
  const filteredRecords = salaryRecords.filter((record) => {
    const matchesSearch =
      record.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (record.role && record.role.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

  // Stats calculations
  const totalPending = salaryRecords
    .filter((r) => r.status === "pending")
    .reduce((sum, r) => sum + r.totalSalary, 0);

  const totalPaid = salaryRecords
    .filter((r) => r.status === "paid")
    .reduce((sum, r) => sum + r.totalSalary, 0);

  const totalSalary = totalPaid + totalPending;
  const totalStaff = salaryRecords.length;

  // Animated counters
  const animatedTotal = useCountUp(totalSalary);
  const animatedPaid = useCountUp(totalPaid);
  const animatedPending = useCountUp(totalPending);
  const animatedStaff = useCountUp(totalStaff);

  if (loading && salaryRecords.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-cyan-600" />
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30 p-8">
      {/* Header */}
      <div
        className={`mb-8 transition-all duration-700 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <h2 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
          Quản lý lương nhân viên
        </h2>
        <p className="text-gray-500 font-light text-lg">
          Tính toán và theo dõi lương nhân viên một cách hiệu quả
        </p>
      </div>

      {/* Stats Cards */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 transition-all duration-700 delay-100 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Total Salary Card */}
        <div className="group relative bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-lg">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-white/80 text-sm font-medium mb-2 tracking-wide">
              Tổng lương tháng này
            </p>
            <p className="text-white text-3xl font-bold tracking-tight">
              {(animatedTotal / 1000000).toFixed(1)}M đ
            </p>
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mb-16 -mr-16"></div>
        </div>

        {/* Paid Card */}
        <div className="group relative bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-lg">
                <Check className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-white/80 text-sm font-medium mb-2 tracking-wide">
              Đã thanh toán
            </p>
            <p className="text-white text-3xl font-bold tracking-tight">
              {(animatedPaid / 1000000).toFixed(1)}M đ
            </p>
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mb-16 -mr-16"></div>
        </div>

        {/* Pending Card */}
        <div className="group relative bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-lg">
                <Calendar className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-white/80 text-sm font-medium mb-2 tracking-wide">
              Chưa thanh toán
            </p>
            <p className="text-white text-3xl font-bold tracking-tight">
              {(animatedPending / 1000000).toFixed(1)}M đ
            </p>
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mb-16 -mr-16"></div>
        </div>

        {/* Total Staff Card */}
        <div className="group relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-white/80 text-sm font-medium mb-2 tracking-wide">
              Tổng nhân viên
            </p>
            <p className="text-white text-3xl font-bold tracking-tight">
              {animatedStaff} người
            </p>
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mb-16 -mr-16"></div>
        </div>
      </div>

      {/* Search and Filter */}
      <div
        className={`bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 mb-6 transition-all duration-700 delay-200 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc chức vụ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "paid" | "pending")}
              className="pl-12 pr-10 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer min-w-[200px]"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="paid">Đã thanh toán</option>
              <option value="pending">Chờ thanh toán</option>
            </select>
          </div>
        </div>
      </div>

      {/* Salary Table */}
      <div
        className={`bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden transition-all duration-700 delay-300 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm sticky top-0 z-10">
              <tr>
                <th className="text-left py-5 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nhân viên
                </th>
                <th className="text-left py-5 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Lương cơ bản
                </th>
                <th className="text-left py-5 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thưởng
                </th>
                <th className="text-left py-5 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Khấu trừ
                </th>
                <th className="text-left py-5 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tổng lương
                </th>
                <th className="text-left py-5 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="text-right py-5 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedRecords.map((record, index) => (
                <tr
                  key={record.id}
                  className={`transition-all duration-200 hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-blue-50/50 hover:scale-[1.005] ${
                    index % 2 === 0 ? "bg-white/40" : "bg-gray-50/30"
                  }`}
                >
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-md">
                        {record.staffName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {record.staffName}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">{record.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span className="text-gray-700 font-medium">
                      {record.baseSalary.toLocaleString()} đ
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    {editingId === record.id ? (
                      <input
                        type="number"
                        value={editBonus}
                        onChange={(e) => setEditBonus(parseInt(e.target.value) || 0)}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                      />
                    ) : (
                      <span className="text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-lg">
                        +{record.bonus.toLocaleString()} đ
                      </span>
                    )}
                  </td>
                  <td className="py-5 px-6">
                    {editingId === record.id ? (
                      <input
                        type="number"
                        value={editDeduction}
                        onChange={(e) => setEditDeduction(parseInt(e.target.value) || 0)}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                      />
                    ) : (
                      <span className="text-red-600 font-semibold bg-red-50 px-3 py-1 rounded-lg">
                        -{record.deduction.toLocaleString()} đ
                      </span>
                    )}
                  </td>
                  <td className="py-5 px-6">
                    <span className="font-bold text-gray-900 text-base">
                      {record.totalSalary.toLocaleString()} đ
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    {record.status === "paid" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs font-semibold rounded-full shadow-sm">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Đã thanh toán
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 text-xs font-semibold rounded-full shadow-sm">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                        Chờ thanh toán
                      </span>
                    )}
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center justify-end gap-2">
                      {editingId === record.id ? (
                        <>
                          <button
                            onClick={() => handleSave(record.id)}
                            className="group relative p-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/50 transition-all duration-200 hover:scale-105"
                            title="Lưu thay đổi"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="group relative p-2.5 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl hover:shadow-lg hover:shadow-gray-500/50 transition-all duration-200 hover:scale-105"
                            title="Hủy"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(record)}
                            className="group relative p-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200 hover:scale-105"
                            title="Chỉnh sửa lương"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {record.status === "pending" && (
                            <button
                              onClick={() => handlePay(record.id)}
                              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-200 hover:scale-105"
                            >
                              Thanh toán
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-5 bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Hiển thị{" "}
                <span className="font-semibold text-gray-900">
                  {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredRecords.length)}
                </span>{" "}
                trong tổng số{" "}
                <span className="font-semibold text-gray-900">{filteredRecords.length}</span> bản
                ghi
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 hover:text-white hover:border-transparent disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 transition-all duration-200 hover:shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-[40px] h-10 rounded-xl font-semibold transition-all duration-200 ${
                      currentPage === page
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 hover:text-white hover:border-transparent disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 transition-all duration-200 hover:shadow-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredRecords.length === 0 && (
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Không tìm thấy kết quả
          </h3>
          <p className="text-gray-500">
            Không có nhân viên nào phù hợp với tiêu chí tìm kiếm của bạn
          </p>
        </div>
      )}
    </div>
  );
}
