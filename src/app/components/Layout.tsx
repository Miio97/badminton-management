import {
  LayoutGrid,
  ShoppingCart,
  Calendar,
  FileText,
  MessageCircle,
} from "lucide-react";
import { SharedDashboardLayout } from "./shared/SharedDashboardLayout";

const navigation = [
  { name: "Vận hành sân", href: "/app", icon: LayoutGrid },
  { name: "Bán hàng", href: "/app/sales", icon: ShoppingCart },
  { name: "Lịch đặt sân", href: "/app/bookings", icon: Calendar },
  { name: "Lịch sử hóa đơn", href: "/app/invoice-history", icon: FileText },
  { name: "Hỗ trợ tư vấn", href: "/app/consultation", icon: MessageCircle },
];

export function Layout() {
  return <SharedDashboardLayout navigation={navigation} roleLabel="Thu ngân" />;
}