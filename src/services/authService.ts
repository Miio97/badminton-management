import { LoginSession, LoginAttempt, AuthResponse, User } from "../types/Auth";

// Mock data chỉ dùng cho sessions/attempts (chưa có endpoint thật)
let mockSessions: LoginSession[] = [
  {
    id: 1,
    user: "Admin",
    role: "admin",
    ipAddress: "192.168.1.100",
    device: "Chrome on Windows",
    loginTime: "2024-03-31 08:00:00",
    lastActivity: "2024-03-31 14:30:25",
    status: "active",
  },
  {
    id: 2,
    user: "Nguyễn Văn Quản Lý",
    role: "manager",
    ipAddress: "192.168.1.105",
    device: "Safari on MacOS",
    loginTime: "2024-03-31 09:15:00",
    lastActivity: "2024-03-31 13:20:10",
    status: "active",
  },
  {
    id: 3,
    user: "Trần Thị Thu Ngân",
    role: "cashier",
    ipAddress: "192.168.1.110",
    device: "Chrome on Windows",
    loginTime: "2024-03-31 07:30:00",
    lastActivity: "2024-03-31 14:35:00",
    status: "active",
  },
  {
    id: 4,
    user: "Phạm Văn Kho",
    role: "warehouse",
    ipAddress: "192.168.1.115",
    device: "Firefox on Windows",
    loginTime: "2024-03-30 16:00:00",
    lastActivity: "2024-03-30 17:30:00",
    status: "expired",
  },
];

let mockAttempts: LoginAttempt[] = [
  {
    id: 1,
    username: "admin",
    ipAddress: "192.168.1.100",
    timestamp: "2024-03-31 08:00:00",
    status: "success",
  },
  {
    id: 2,
    username: "unknown_user",
    ipAddress: "203.162.10.50",
    timestamp: "2024-03-31 07:45:30",
    status: "failed",
    reason: "Sai tên đăng nhập",
  },
];

const API_BASE = 'https://badminton-management-production-b2ba.up.railway.app/api';

export const authService = {
  // ✅ Kết nối thật với POST /api/auth/login
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Đăng nhập thất bại');
    }

    const data = await response.json();
    return data as AuthResponse;
  },

  // ✅ Kết nối thật với GET /api/auth/me
  verifyToken: async (): Promise<User> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('Token không hợp lệ');
    const data = await response.json();
    return {
      accountId: data.id,
      username: data.username,
      role: data.role,
      profileId: data.staff?.id || data.customer?.id || null,
      fullName: data.staff?.fullName || data.customer?.fullName || data.username,
    } as User;
  },

  // TODO: Replace with actual endpoint /api/admin/sessions
  getSessions: async (): Promise<LoginSession[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockSessions]), 600);
    });
  },

  // TODO: Replace with actual endpoint /api/admin/sessions/:id/terminate
  terminateSession: async (id: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const idx = mockSessions.findIndex(s => s.id === id);
        if (idx > -1) {
          mockSessions[idx].status = "expired";
          resolve(true);
        } else {
          reject(new Error("Session not found"));
        }
      }, 400);
    });
  },

  // TODO: Replace with actual endpoint /api/admin/attempts
  getLoginAttempts: async (): Promise<LoginAttempt[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockAttempts]), 600);
    });
  }
};
