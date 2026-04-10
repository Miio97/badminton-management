// Routes configuration for Badminton Center
import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { CourtOperations } from "./components/CourtOperations";
import { Sales } from "./components/Sales";
import { Bookings } from "./components/Bookings";
import { InvoiceHistory } from "./components/InvoiceHistory";
import { CustomerCare } from "./components/CustomerCare";
import { AdminLayout } from "./components/AdminLayout";
import { AdminDashboard } from "./components/AdminDashboard";
import { RolePermissionManagement } from "./components/admin/RolePermissionManagement";
import { ActivityLogManagement } from "./components/admin/ActivityLogManagement";
import { SystemSettings } from "./components/admin/SystemSettings";
import { LoginManagement } from "./components/admin/LoginManagement";
import { AccountInfo } from "./components/AccountInfo";
import { OwnerDashboard } from "./components/OwnerDashboard";
import { WarehouseLayout } from "./components/WarehouseLayout";
import { WarehouseDashboard } from "./components/warehouse/WarehouseDashboard";
import { ProductManagement } from "./components/warehouse/ProductManagement";
import { SupplierManagement } from "./components/warehouse/SupplierManagement";
import { StockEntry } from "./components/warehouse/StockEntry";
import { CustomerLayout } from "./components/CustomerLayout";
import { CustomerHome } from "./components/customer/CustomerHome";
import { CourtBooking } from "./components/customer/CourtBooking";
import { Promotions } from "./components/customer/Promotions";
import { CustomerFeedback } from "./components/customer/CustomerFeedback";
import { SupportChat } from "./components/customer/SupportChat";
import { BookingHistory } from "./components/customer/BookingHistory";
import { OwnerLayout } from "./components/OwnerLayout";
import { BusinessAnalytics } from "./components/owner/BusinessAnalytics";
import { ApprovalManagement } from "./components/owner/ApprovalManagement";
import { HistoryManagement } from "./components/owner/HistoryManagement";
import { ReviewManagement } from "./components/owner/ReviewManagement";
import { ManagerLayout } from "./components/ManagerLayout";
import { ManagerDashboard } from "./components/manager/ManagerDashboard";
import { CourtManagement } from "./components/manager/CourtManagement";
import { StaffManagement } from "./components/manager/StaffManagement";
import { SalaryManagement } from "./components/manager/SalaryManagement";
import { FeedbackManagement } from "./components/manager/FeedbackManagement";
import { PromotionManagement } from "./components/manager/PromotionManagement";
import { CustomerConsultation } from "./components/cashier/CustomerConsultation";
import { LandingPage } from "./components/landing/LandingPage";
import { UserRole } from "./contexts/AuthContext";

// Protected Route Component
function ProtectedRoute({
  children,
  user,
  allowedRoles,
}: {
  children: React.ReactNode;
  user: { role: UserRole } | null;
  allowedRoles: UserRole[];
}) {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Role-based dashboard router
function DashboardRouter({ user }: { user: { role: UserRole } | null }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  switch (user.role) {
    case "admin":
      return <Navigate to="/admin" replace />;
    case "warehouse":
      return <Navigate to="/warehouse" replace />;
    case "customer":
      return <Navigate to="/customer" replace />;
    case "owner":
      return <Navigate to="/owner" replace />;
    case "manager":
      return <Navigate to="/manager" replace />;
    case "cashier":
      return <Navigate to="/app" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}

export function createAppRouter(user: { role: UserRole } | null) {
  return createBrowserRouter([
    {
      path: "/",
      element: user ? <DashboardRouter user={user} /> : <LandingPage />,
    },
    {
      path: "/app",
      element: user ? (
        ["manager", "cashier"].includes(user.role) ? (
          <Layout />
        ) : (
          <Navigate to="/" replace />
        )
      ) : (
        <Navigate to="/" replace />
      ),
      children: [
        {
          index: true,
          element: <CourtOperations />,
        },
        {
          path: "sales",
          element: <Sales />,
        },
        {
          path: "bookings",
          element: <Bookings />,
        },
        {
          path: "invoice-history",
          element: <InvoiceHistory />,
        },
        {
          path: "customer-care",
          element: user?.role === "manager" ? <CustomerCare /> : <Navigate to="/app" replace />,
        },
        {
          path: "account",
          element: <AccountInfo />,
        },
        {
          path: "consultation",
          element: user?.role === "cashier" ? <CustomerConsultation /> : <Navigate to="/app" replace />,
        },
      ],
    },
    {
      path: "/warehouse",
      element: user ? (
        user?.role === "warehouse" ? (
          <WarehouseLayout />
        ) : (
          <Navigate to="/" replace />
        )
      ) : (
        <Navigate to="/" replace />
      ),
      children: [
        {
          index: true,
          element: <WarehouseDashboard />,
        },
        {
          path: "products",
          element: <ProductManagement />,
        },
        {
          path: "suppliers",
          element: <SupplierManagement />,
        },
        {
          path: "stock-entry",
          element: <StockEntry />,
        },
        {
          path: "account",
          element: <AccountInfo />,
        },
      ],
    },
    {
      path: "/customer",
      element: user ? (
        user?.role === "customer" ? (
          <CustomerLayout />
        ) : (
          <Navigate to="/" replace />
        )
      ) : (
        <Navigate to="/" replace />
      ),
      children: [
        {
          index: true,
          element: <CustomerHome />,
        },
        {
          path: "booking",
          element: <CourtBooking />,
        },
        {
          path: "promotions",
          element: <Promotions />,
        },
        {
          path: "feedback",
          element: <CustomerFeedback />,
        },
        {
          path: "support-chat",
          element: <SupportChat />,
        },
        {
          path: "history",
          element: <BookingHistory />,
        },
        {
          path: "account",
          element: <AccountInfo />,
        },
      ],
    },
    {
      path: "/owner",
      element: user ? (
        user?.role === "owner" ? (
          <OwnerLayout />
        ) : (
          <Navigate to="/" replace />
        )
      ) : (
        <Navigate to="/" replace />
      ),
      children: [
        {
          index: true,
          element: <OwnerDashboard />,
        },
        {
          path: "business",
          element: <BusinessAnalytics />,
        },
        {
          path: "approval",
          element: <ApprovalManagement />,
        },
        {
          path: "history",
          element: <HistoryManagement />,
        },
        {
          path: "reviews",
          element: <ReviewManagement />,
        },
        {
          path: "account",
          element: <AccountInfo />,
        },
      ],
    },
    {
      path: "/manager",
      element: user ? (
        user?.role === "manager" ? (
          <ManagerLayout />
        ) : (
          <Navigate to="/" replace />
        )
      ) : (
        <Navigate to="/" replace />
      ),
      children: [
        {
          index: true,
          element: <ManagerDashboard />,
        },
        {
          path: "courts",
          element: <CourtManagement />,
        },
        {
          path: "staff",
          element: <StaffManagement />,
        },
        {
          path: "salary",
          element: <SalaryManagement />,
        },
        {
          path: "feedback",
          element: <FeedbackManagement />,
        },
        {
          path: "promotions",
          element: <PromotionManagement />,
        },
        {
          path: "account",
          element: <AccountInfo />,
        },
      ],
    },
    {
      path: "/admin",
      element: user ? (
        user?.role === "admin" ? (
          <AdminLayout />
        ) : (
          <Navigate to="/" replace />
        )
      ) : (
        <Navigate to="/" replace />
      ),
      children: [
        {
          index: true,
          element: <AdminDashboard />,
        },
        {
          path: "permissions",
          element: <RolePermissionManagement />,
        },
        {
          path: "logs",
          element: <ActivityLogManagement />,
        },
        {
          path: "settings",
          element: <SystemSettings />,
        },
        {
          path: "login-management",
          element: <LoginManagement />,
        },
        {
          path: "account",
          element: <AccountInfo />,
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);
}
