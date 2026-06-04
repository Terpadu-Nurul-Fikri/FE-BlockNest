import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { authService } from "../lib/authService";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, userData: AuthUser) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

/** Baca token dari localStorage secara sinkron — tidak perlu hit API */
function getInitialUser(): AuthUser | null {
  try {
    const token = authService.getToken();
    if (!token) return null;

    // Decode payload JWT tanpa verifikasi (verifikasi ada di backend)
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));

    // Cek expiry
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      authService.removeToken();
      return null;
    }

    // Kembalikan user minimal dari JWT payload
    // Data lengkap akan di-fetch di background
    return {
      id: payload.id || payload.sub || "",
      name: payload.name || "",
      email: payload.email || "",
      firstName: (payload.name || "").split(" ")[0] || "",
      lastName: (payload.name || "").split(" ").slice(1).join(" ") || undefined,
      phone: payload.phone,
      role: payload.role || "CUSTOMER",
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Inisialisasi sinkron dari token — tidak ada loading flash
  const [user, setUser] = useState<AuthUser | null>(getInitialUser);
  const [loading] = useState(false);

  const refreshUser = useCallback(async () => {
    const token = authService.getToken();
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const res = await authService.getProfile(token);
      if (res.success) {
        const d = res.data;
        const nameParts = (d.name || d.firstName || "").split(" ");
        setUser({
          id: d.id,
          name: d.name || `${d.firstName} ${d.lastName || ""}`.trim(),
          email: d.email,
          firstName: nameParts[0] || d.firstName || "",
          lastName: nameParts.slice(1).join(" ") || d.lastName || undefined,
          phone: d.phone,
          role: d.role,
        });
      } else {
        authService.removeToken();
        setUser(null);
      }
    } catch {
      // Jika API tidak bisa dicapai, tetap pakai data dari token
      // Jangan hapus token hanya karena network error
    }
  }, []);

  // Background refresh — validasi token ke server setelah render pertama
  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      refreshUser();
    }
  }, [refreshUser]);

  const login = (token: string, userData: AuthUser) => {
    authService.saveToken(token);
    setUser(userData);
  };

  const logout = () => {
    authService.removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
