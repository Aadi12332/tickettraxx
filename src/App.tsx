import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './routes/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { OtpPage } from './pages/OtpPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { PlaceholderPage } from './pages/PlaceholderPage';

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-otp" element={<OtpPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/assign-loads" element={<PlaceholderPage title="Assign Loads" />} />
              <Route path="/dashboard/drivers" element={<PlaceholderPage title="My Drivers" />} />
              <Route path="/dashboard/drivers/add" element={<PlaceholderPage title="Add Driver" />} />
              <Route path="/dashboard/tickets" element={<PlaceholderPage title="Ticket Management" />} />
              <Route path="/dashboard/tickets/create" element={<PlaceholderPage title="Create Ticket" />} />
              <Route path="/dashboard/payments" element={<PlaceholderPage title="Upcoming Payment" />} />
              <Route path="/dashboard/statement" element={<PlaceholderPage title="Statement" />} />
              <Route path="/dashboard/deductions" element={<PlaceholderPage title="Deductions" />} />
              <Route path="/dashboard/permissions" element={<PlaceholderPage title="Permissions" />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
