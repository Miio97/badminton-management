import {
  LayoutDashboard,
  Package,
  Truck,
  FileInput,
} from "lucide-react";
import { SharedDashboardLayout } from "./shared/SharedDashboardLayout";

const navigation = [
  { name: "Dashboard", href: "/warehouse", icon: LayoutDashboard },
  { name: "Quản lý sản phẩm", href: "/warehouse/products", icon: Package },
  { name: "Nhà cung cấp", href: "/warehouse/suppliers", icon: Truck },
  { name: "Nhập hàng", href: "/warehouse/stock-entry", icon: FileInput },
];

export function WarehouseLayout() {
  return <SharedDashboardLayout navigation={navigation} roleLabel="Quản lý kho" />;
}