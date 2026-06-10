import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
  resetPasswordEmail: string | null;
  setResetPasswordEmail: (email: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: User = {
  id: '1',
  name: 'Adrian',
  email: 'contractor@gmail.com',
  role: 'contractor',
};

const MOCK_CREDENTIALS = {
  email: 'contractor@gmail.com',
  password: 'Admin@123',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [resetPasswordEmail, setResetPasswordEmail] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('tt_user');
    if (stored) {
      try {
        const user = JSON.parse(stored) as User;
        setState({ user, isAuthenticated: true, isLoading: false });
      } catch {
        setState(s => ({ ...s, isLoading: false }));
      }
    } else {
      setState(s => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));

    if (email !== MOCK_CREDENTIALS.email || password !== MOCK_CREDENTIALS.password) {
      throw new Error('Invalid email or password');
    }

    setState({ user: MOCK_USER, isAuthenticated: true, isLoading: false });
    if (rememberMe) {
      localStorage.setItem('tt_user', JSON.stringify(MOCK_USER));
    }
  };

  const logout = () => {
    localStorage.removeItem('tt_user');
    setState({ user: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, resetPasswordEmail, setResetPasswordEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};