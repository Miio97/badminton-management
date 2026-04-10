import {
  LayoutDashboard,
  Shield,
  FileText,
  Settings,
  LogIn,
} from "lucide-react";
import { SharedDashboardLayout } from "./shared/SharedDashboardLayout";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Phân quyền", href: "/admin/permissions", icon: Shield },
  { name: "Nhật ký", href: "/admin/logs", icon: FileText },
  { name: "Cài đặt", href: "/admin/settings", icon: Settings },
  { name: "Quản lý đăng nhập", href: "/admin/login-management", icon: LogIn },
];

export function AdminLayout() {
  return <SharedDashboardLayout navigation={navigation} roleLabel="Quản trị viên" />;
}