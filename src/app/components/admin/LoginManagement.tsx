import { useState, useEffect } from "react";
import { LogIn, User, Clock, AlertTriangle, Shield, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import { LoginSession, LoginAttempt } from "../../../types/Auth";
import { authService } from "../../../services/authService";

export function LoginManagement() {
  const [activeTab, setActiveTab] = useState<"sessions" | "attempts">("sessions");
  const [sessions, setSessions] = useState<LoginSession[]>([]);
  const [attempts, setAttempts] = useState<LoginAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [fetchedSessions, fetchedAttempts] = await Promise.all([
        authService.getSessions(),
        authService.getLoginAttempts()
      ]);
      setSessions(fetchedSessions);
      setAttempts(fetchedAttempts);
    } catch (err) {
      console.error("Fetch auth data error:", err);
      setError("Không thể tải dữ liệu đăng nhập. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTerminateSession = async (id: number) => {
    try {
      await authService.terminateSession(id);
      setSessions(
        sessions.map((session) =>
          session.id === id ? { ...session, status: "expired" } : session
        )
      );
      alert("Phiên đăng nhập đã bị đóng");
    } catch (err) {
      console.error("Terminate session failed:", err);
      alert("Đóng phiên thất bại.");
    }
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-red-100 text-red-700",
      manager: "bg-blue-100 text-blue-700",
      cashier: "bg-green-100 text-green-700",
      warehouse: "bg-purple-100 text-purple-700",
      customer: "bg-gray-100 text-gray-700",
    };
    return colors[role] || "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
      case "active":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "blocked":
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case "expired":
        return <Clock className="w-5 h-5 text-gray-600" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Đang tải dữ liệu đăng nhập...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-gray-800 font-medium mb-4">{error}</p>
        <button 
          onClick={fetchData}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Quản lý đăng nhập
        </h2>
        <p className="text-gray-600">Theo dõi phiên đăng nhập và lịch sử truy cập</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Phiên hoạt động</p>
              <p className="text-2xl font-bold text-gray-800">
                {sessions.filter((s) => s.status === "active").length}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Đăng nhập thất bại</p>
              <p className="text-2xl font-bold text-gray-800">
                {attempts.filter((a) => a.status === "failed").length}
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">IP bị chặn</p>
              <p className="text-2xl font-bold text-gray-800">
                {attempts.filter((a) => a.status === "blocked").length}
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Tổng truy cập</p>
              <p className="text-2xl font-bold text-gray-800">{attempts.length}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <LogIn className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("sessions")}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === "sessions"
                ? "text-[#00d9b8] border-b-2 border-[#00d9b8]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-5 h-5" />
              Phiên đăng nhập
            </div>
          </button>
          <button
            onClick={() => setActiveTab("attempts")}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === "attempts"
                ? "text-[#00d9b8] border-b-2 border-[#00d9b8]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" />
              Lịch sử đăng nhập
            </div>
          </button>
        </div>
      </div>

      {/* Sessions Table */}
      {activeTab === "sessions" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Người dùng
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    IP Address
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Thiết bị
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Đăng nhập lúc
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Hoạt động gần nhất
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Trạng thái
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-800">{session.user}</p>
                          <span
                            className={`text-xs px-2 py-1 rounded ${getRoleColor(
                              session.role
                            )}`}
                          >
                            {session.role}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-sm text-gray-700">
                      {session.ipAddress}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {session.device}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {session.loginTime}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {session.lastActivity}
                    </td>
                    <td className="py-4 px-6">
                      {session.status === "active" ? (
                        <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full w-fit">
                          <CheckCircle className="w-3 h-3" />
                          Hoạt động
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full w-fit">
                          <Clock className="w-3 h-3" />
                          Hết hạn
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {session.status === "active" && (
                        <button
                          onClick={() => handleTerminateSession(session.id)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                        >
                          Đóng phiên
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Login Attempts Table */}
      {activeTab === "attempts" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Tên đăng nhập
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    IP Address
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Thời gian
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Trạng thái
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Lý do
                  </th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((attempt) => (
                  <tr key={attempt.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-800">
                          {attempt.username}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-sm text-gray-700">
                      {attempt.ipAddress}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {attempt.timestamp}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(attempt.status)}
                        <span
                          className={`text-sm font-medium ${
                            attempt.status === "success"
                              ? "text-green-700"
                              : attempt.status === "failed"
                              ? "text-red-700"
                              : "text-orange-700"
                          }`}
                        >
                          {attempt.status === "success"
                            ? "Thành công"
                            : attempt.status === "failed"
                            ? "Thất bại"
                            : "Bị chặn"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {attempt.reason || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
