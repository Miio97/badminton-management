import {
  LayoutDashboard,
  Target,
  Users,
  Wallet,
  MessageSquare,
  Gift,
} from "lucide-react";
import { SharedDashboardLayout } from "./shared/SharedDashboardLayout";

const navigation = [
  { name: "Dashboard", href: "/manager", icon: LayoutDashboard },
  { name: "Sân", href: "/manager/courts", icon: Target },
  { name: "Nhân viên", href: "/manager/staff", icon: Users },
  { name: "Lương", href: "/manager/salary", icon: Wallet },
  { name: "Feedback", href: "/manager/feedback", icon: MessageSquare },
  { name: "Khuyến mãi", href: "/manager/promotions", icon: Gift },
];

export function ManagerLayout() {
  return <SharedDashboardLayout navigation={navigation} roleLabel="Quản lý" />;
}