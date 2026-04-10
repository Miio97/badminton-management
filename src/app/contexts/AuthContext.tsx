import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { authService } from "../../services/authService";
import { User, UserRole } from "../../types/Auth";

export type { UserRole, User };

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      
      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Optionally: verify token with authService
          // const validUser = await authService.verifyToken();
          // setUser(validUser);
        } catch (err) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login(username, password);
      
      if (response && response.token && response.user) {
        const loggedInUser = response.user;
        
        // Save to state
        setUser(loggedInUser);
        
        // Save to localStorage
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    // Clear state
    setUser(null);
    
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
