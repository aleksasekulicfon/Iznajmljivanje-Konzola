import { createContext, useContext, useMemo, useState } from "react";
import * as AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const navigate = useNavigate();

  async function login(username, password) {
    const data = await AuthService.login({ korisnickoIme: username, lozinka: password });
    const normalized = {
      id: data.id ?? data.userId ?? data.radnikId ?? data.klijentId,
      username: data.korisnickoIme ?? data.username,
      role: data.role,
      token: data.token ?? null,
    };
    localStorage.setItem("user", JSON.stringify(normalized));
    setUser(normalized);
    navigate(normalized.role === "RADNIK" ? "/admin" : "/app", { replace: true });
  }

  function logout() {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login", { replace: true });
  }

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}