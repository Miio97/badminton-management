import { Outlet } from "react-router";
import { AppNavbar } from "./shared/AppNavbar";

export function CustomerLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100">
      <AppNavbar />
      <Outlet />
    </div>
  );
}
