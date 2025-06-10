import { useState, useEffect } from "react";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  const router = useRouter();

  useEffect(() => {
    // Check if token exists on mount
    const token = localStorage.getItem("adminToken");
    setAuthState((prev) => ({
      ...prev,
      isAuthenticated: !!token,
      isLoading: false,
    }));
  }, []);

  const login = async (username: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    const response = await authApi.login(username, password);

    if (response.error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: response.error!,
      }));
      return false;
    }

    if (response.data?.token) {
      localStorage.setItem("adminToken", response.data.token);
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      router.push("/dashboard");
      return true;
    }

    setAuthState((prev) => ({
      ...prev,
      isLoading: false,
      error: "Invalid response from server",
    }));
    return false;
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    router.push("/login");
  };

  return {
    ...authState,
    login,
    logout,
  };
}
