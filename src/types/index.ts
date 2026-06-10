export interface User {
  id: string;
  name: string;
  email: string;
  role: 'contractor' | 'admin';
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface OtpFormData {
  otp: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface Load {
  id: string;
  ticketId: string;
  driver: string;
  driverAvatar?: string;
  pickup: string;
  dropoff: string;
  status: 'In Transit' | 'Delivered' | 'Delayed' | 'Pending';
  deliveryDate: string;
}

export interface Alert {
  id: string;
  message: string;
  type: 'error' | 'warning';
  time: string;
}
