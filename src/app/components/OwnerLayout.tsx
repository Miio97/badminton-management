import {
  LayoutDashboard,
  BarChart3,
  CheckSquare,
  History,
  Star,
} from "lucide-react";
import { SharedDashboardLayout } from "./shared/SharedDashboardLayout";

const navigation = [
  { name: "Dashboard", href: "/owner", icon: LayoutDashboard },
  { name: "Kinh doanh", href: "/owner/business", icon: BarChart3 },
  { name: "Phê duyệt", href: "/owner/approval", icon: CheckSquare },
  { name: "Lịch sử", href: "/owner/history", icon: History },
  { name: "Đánh giá", href: "/owner/reviews", icon: Star },
];

export function OwnerLayout() {
  return <SharedDashboardLayout navigation={navigation} roleLabel="Chủ sân" />;
}