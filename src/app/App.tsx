import { RouterProvider } from "react-router";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { createAppRouter } from "./routes";
import { Toaster } from "./components/ui/sonner";

function AppContent() {
  const { user } = useAuth();
  const router = createAppRouter(user);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
