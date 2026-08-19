import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { login as loginApi, registerStudent } from "../services/api";
import { TOKEN_KEY, USER_KEY } from "../utils/constants";
import { getErrorMessage } from "../utils/helpers";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  function persistSession(data) {
    // authController returns { _id, name, email, role, token } directly
    const { token, ...userData } = data;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  }
// Works for students and admins
// The login API returns the user's role

  async function login(credentials) {
    try {
      const res = await loginApi(credentials);
      persistSession(res.data);
      return { success: true, role: res.data.role };
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    }
  }

  async function register(formData) {
    try {
      const res = await registerStudent(formData);
      persistSession(res.data);
      return { success: true };
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }
// Updates the user's details after a profile change
// without requiring them to log in again
  function refreshUser(updatedFields) {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isInstructor: user?.role === "instructor",
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
