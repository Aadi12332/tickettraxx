import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, PublicRoute } from "./routes/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { LoginPage } from "./pages/LoginPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { OtpPage } from "./pages/OtpPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { DashboardPage } from "./pages/DashboardPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import {AssignLoadPage} from "./pages/AssignLoadPage";
import PermissionsPage from "./pages/PermissionPage";
import CreateNewRole from "./pages/CreateNewRole";

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

              <Route
                path="/dashboard/assign-loads"
                element={<AssignLoadPage />}
              />

              <Route
                path="/dashboard/drivers"
                element={<PlaceholderPage title="Drivers" />}
              />

              <Route
                path="/dashboard/active-loads"
                element={<PlaceholderPage title="Active Loads" />}
              />

              <Route
                path="/dashboard/trucks"
                element={<PlaceholderPage title="Truck Details" />}
              />

              <Route
                path="/dashboard/upload-tickets"
                element={<PlaceholderPage title="Upload Tickets" />}
              />

              <Route
                path="/dashboard/tickets"
                element={<PlaceholderPage title="Ticket Status" />}
              />

              <Route
                path="/dashboard/payments"
                element={<PlaceholderPage title="Upcoming Payment" />}
              />

              <Route
                path="/dashboard/statement"
                element={<PlaceholderPage title="Statement" />}
              />

              <Route
                path="/dashboard/deductions"
                element={<PlaceholderPage title="Deductions" />}
              />

              <Route
                path="/dashboard/permissions"
                element={<PermissionsPage />}
              />

              <Route path="/permissions/create-role" element={<CreateNewRole mode="create" />} />
              
              <Route path="/permissions/edit-role" element={<CreateNewRole mode="edit" />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
