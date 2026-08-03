import { createContext, useContext, useState, ReactNode } from "react";
import { User, AuthState } from "../types";

interface AuthContextType extends AuthState {
  login: (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => Promise<void>;
  logout: () => void;
  resetPasswordEmail: string | null;
  setResetPasswordEmail: (email: string | null) => void;
}

export interface LoginApiResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  message?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_STORAGE_KEY = "tt_auth_session";

const getStoredAuthState = (): AuthState => {
  if (typeof window === "undefined") {
    return {
      user: null,
      token: null,
      authData: null,
      isAuthenticated: false,
      isLoading: false,
    };
  }

  try {
    const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!storedValue) {
      return {
        user: null,
        token: null,
        authData: null,
        isAuthenticated: false,
        isLoading: false,
      };
    }

    const parsed = JSON.parse(storedValue) as Partial<AuthState> & {
      user?: User;
      token?: string;
      authData?: LoginApiResponse | null;
    };

    return {
      user: parsed.user ?? null,
      token: parsed.token ?? null,
      authData: parsed.authData ?? null,
      isAuthenticated: Boolean(parsed.user && parsed.token),
      isLoading: false,
    };
  } catch {
    return {
      user: null,
      token: null,
      authData: null,
      isAuthenticated: false,
      isLoading: false,
    };
  }
};

const persistAuthState = (state: AuthState, rememberMe: boolean) => {
  if (typeof window === "undefined") return;

  const storage = rememberMe ? window.localStorage : window.sessionStorage;
  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
};

const clearStoredAuthState = () => {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(() => getStoredAuthState());
  const [resetPasswordEmail, setResetPasswordEmail] = useState<string | null>(
    null,
  );

  const login = async (email: string, password: string, rememberMe: boolean) => {
    const response = await fetch("https://65.1.152.16/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: email,
        password,
      }),
    });

    const payload = (await response.json().catch(() => ({ message: "Invalid email or password" }))) as LoginApiResponse & {
      message?: string;
    };

    if (!response.ok) {
      throw new Error(payload.message || "Invalid email or password");
    }

    const nextState: AuthState = {
      user: payload.user,
      token: payload.accessToken,
      authData: payload,
      isAuthenticated: true,
      isLoading: false,
    };

    setState(nextState);
    persistAuthState(nextState, rememberMe);
  };

  const logout = () => {
    const nextState: AuthState = {
      user: null,
      token: null,
      authData: null,
      isAuthenticated: false,
      isLoading: false,
    };

    setState(nextState);
    clearStoredAuthState();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        resetPasswordEmail,
        setResetPasswordEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
