export type UserRole = "admin" | "manager" | "cashier" | "warehouse" | "customer" | "owner";

export interface User {
  accountId: number;
  username: string;
  role: UserRole;
  profileId: number | null;
  fullName: string;
}

export interface LoginSession {
  id: number;
  user: string;
  role: string;
  ipAddress: string;
  device: string;
  loginTime: string;
  lastActivity: string;
  status: "active" | "expired";
}

export interface LoginAttempt {
  id: number;
  username: string;
  ipAddress: string;
  timestamp: string;
  status: "success" | "failed" | "blocked";
  reason?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
