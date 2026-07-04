import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './state/auth-store';
import AppLayout from './components/AppLayout';
import AuthLoader from './components/AuthLoader';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ConnectPage from './pages/ConnectPage';
import ApiKeysPage from './pages/ApiKeysPage';
import CreatePaymentPage from './pages/CreatePaymentPage';
import HistoryPage from './pages/HistoryPage';
import CheckoutPage from './pages/CheckoutPage';
import ActivationPage from './pages/ActivationPage';
import SettingsPage from './pages/SettingsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PaymentOptionsPage from './pages/PaymentOptionsPage';
import PaymentThemePage from './pages/PaymentThemePage';
import SubscriptionPage from './pages/SubscriptionPage';
import SdkPage from './pages/SdkPage';
import DocumentationPage from './pages/DocumentationPage';
import DefaultLinkPage from './pages/DefaultLinkPage';
import SubscriptionHistoryPage from './pages/SubscriptionHistoryPage';

function Protected() {
  const { token, loading } = useAuth();
  if (loading) return <AuthLoader fullPage label="Checking your session…" />;
  return token ? <AppLayout /> : <Navigate to="/login" replace />;
}

export default function App() {
  return <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<AuthPage mode="login" />} />
    <Route path="/signup" element={<AuthPage mode="signup" />} />
    <Route path="/activate" element={<ActivationPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route path="/pay/:publicId" element={<CheckoutPage />} />
    <Route element={<Protected />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/connect" element={<ConnectPage />} />
      <Route path="/api-keys" element={<ApiKeysPage />} />
      <Route path="/payments/create" element={<CreatePaymentPage />} />
      <Route path="/payments/history" element={<HistoryPage />} />
      <Route path="/payments/:status" element={<HistoryPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/payment-options" element={<PaymentOptionsPage />} />
      <Route path="/themes" element={<PaymentThemePage />} />
      <Route path="/subscription" element={<SubscriptionPage />} />
      <Route path="/sdk" element={<SdkPage />} />
      <Route path="/documentation" element={<DocumentationPage />} />
      <Route path="/default-link" element={<DefaultLinkPage />} />
      <Route path="/subscription-history" element={<SubscriptionHistoryPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>;
}
