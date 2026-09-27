import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Providers } from './hooks/Providers';
import { useAuthStore } from './hooks/useStores';
import { ToastProvider } from './components/ui/Toast';
import { MainLayout } from './layouts/MainLayout';
import { Welcome } from './pages/Welcome';
import { Login } from './pages/Login';
import { CreateAccount } from './pages/CreateAccount';
import { OTPVerification } from './pages/OTPVerification';
import { OnboardingStep1 } from './pages/OnboardingStep1';
import { OnboardingStep2 } from './pages/OnboardingStep2';
import { OnboardingStep3 } from './pages/OnboardingStep3';
import { OnboardingStep4 } from './pages/OnboardingStep4';
import { OnboardingStep5 } from './pages/OnboardingStep5';
import { Dashboard } from './pages/Dashboard';
import { Explore } from './pages/Explore';
import { Learn } from './pages/Learn';
import { LearnPath } from './pages/LearnPath';
import { Roadmap } from './pages/Roadmap';
import { Business } from './pages/Business';
import { Funding } from './pages/Funding';
import { Products } from './pages/Products';
import { Market } from './pages/Market';
import { Profile } from './pages/Profile';
import { AdminLayout } from './admin/layouts/AdminLayout';
import { ProtectedAdminRoute } from './admin/hooks/adminRouteGuards';
import { Dashboard as AdminDashboard } from './admin/pages/Dashboard';
import { Users as AdminUsers } from './admin/pages/Users';
import { UserDetail } from './admin/pages/UserDetail';
import { Skills } from './admin/pages/Skills';
import { Opportunities } from './admin/pages/Opportunities';
import { Learning } from './admin/pages/Learning';
import { Schemes } from './admin/pages/Schemes';
import { Products as AdminProducts } from './admin/pages/Products';
import { Market as AdminMarket } from './admin/pages/Market';
import { Analytics } from './admin/pages/Analytics';
import { AuditLogs } from './admin/pages/AuditLogs';
import { AdminSettings } from './admin/pages/Settings';

function HomeRoute() {
  return <Navigate to="/welcome" replace />;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to="/welcome" replace />;
  return children;
}

function AppContent() {
  const { isLoading } = useAuthStore();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading RozgarSetu AI...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
      <Route path="/register" element={<AuthRoute><CreateAccount /></AuthRoute>} />
      <Route path="/otp" element={<AuthRoute><OTPVerification /></AuthRoute>} />
      <Route path="/onboarding/step-1" element={<ProtectedRoute><OnboardingStep1 /></ProtectedRoute>} />
      <Route path="/onboarding/step-2" element={<ProtectedRoute><OnboardingStep2 /></ProtectedRoute>} />
      <Route path="/onboarding/step-3" element={<ProtectedRoute><OnboardingStep3 /></ProtectedRoute>} />
      <Route path="/onboarding/step-4" element={<ProtectedRoute><OnboardingStep4 /></ProtectedRoute>} />
      <Route path="/onboarding/step-5" element={<ProtectedRoute><OnboardingStep5 /></ProtectedRoute>} />

      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/explore/:id" element={<Explore />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/:pathId" element={<LearnPath />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/business" element={<Business />} />
        <Route path="/funding" element={<Funding />} />
        <Route path="/products" element={<Products />} />
        <Route path="/market" element={<Market />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/users/:id" element={<UserDetail />} />
        <Route path="/admin/skills" element={<Skills />} />
        <Route path="/admin/opportunities" element={<Opportunities />} />
        <Route path="/admin/learning" element={<Learning />} />
        <Route path="/admin/schemes" element={<Schemes />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/market" element={<AdminMarket />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/audit-logs" element={<AuditLogs />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Providers>
      <BrowserRouter>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </BrowserRouter>
    </Providers>
  );
}

export default App;
