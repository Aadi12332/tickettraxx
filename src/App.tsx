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
import DeductionPage from "./pages/DeductionPage";
import StatementPage from "./pages/StatementPage";
import UpcomingPaymentPage from "./pages/UpcomingPaymentPage";
import UploadTicketPage from "./pages/UploadTicketPage";
import TicketStatusPage from "./pages/TicketStatusPage";
import AllDriversPage from "./pages/Alldriverspage";
import ActiveLoadsPage from "./pages/Activeloadspage";
import TruckDetailsPage from "./pages/Truckdetailspage";
import AddDriver from "./pages/AddDriver";
import DriverDetailPage from "./pages/Driverdetailpage";

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
                element={<AllDriversPage />}
              />

              <Route
                path="/dashboard/drivers/details"
                element={<DriverDetailPage />}
              />

              <Route
                path="/dashboard/drivers/add-driver"
                element={<AddDriver />}
              />

              <Route
                path="/dashboard/active-loads"
                element={<ActiveLoadsPage />}
              />

              <Route
                path="/dashboard/trucks"
                element={<TruckDetailsPage />}
              />

              <Route
                path="/dashboard/upload-tickets"
                element={<UploadTicketPage />}
              />

              <Route
                path="/dashboard/tickets"
                element={<TicketStatusPage />}
              />

              <Route
                path="/dashboard/payments"
                element={<UpcomingPaymentPage />}
              />

              <Route
                path="/dashboard/statement"
                element={<StatementPage />}
              />

              <Route
                path="/dashboard/deductions"
                element={<DeductionPage />}
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
