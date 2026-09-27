import { Routes, Route, Navigate } from 'react-router-dom';
import { Providers } from './providers/Providers';
import { useAuthStore } from './hooks/useAuthStore';
import { AdminRoute } from './hooks/adminRouteGuards';
import { AdminLayout } from './layouts/AdminLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { Users } from './pages/admin/Users';
import { UserDetail } from './pages/admin/UserDetail';
import { Skills, SkillForm } from './pages/admin/Skills';
import { Opportunities } from './pages/admin/Opportunities';
import { OpportunityForm } from './pages/admin/OpportunityForm';
import { Learning, LearningPathForm } from './pages/admin/Learning';
import { Schemes, SchemeForm } from './pages/admin/Schemes';
import { Products } from './pages/admin/Products';
import { Market } from './pages/admin/Market';
import { Analytics } from './pages/admin/Analytics';
import { Settings } from './pages/admin/Settings';

function AppContent() {
  const { isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/users/:id" element={<UserDetail />} />
        <Route path="/admin/skills" element={<Skills />} />
        <Route path="/admin/skills/create" element={<SkillForm />} />
        <Route path="/admin/skills/:id/edit" element={<SkillForm />} />
        <Route path="/admin/opportunities" element={<Opportunities />} />
        <Route path="/admin/opportunities/create" element={<OpportunityForm />} />
        <Route path="/admin/opportunities/:id/edit" element={<OpportunityForm />} />
        <Route path="/admin/learning" element={<Learning />} />
        <Route path="/admin/learning/create" element={<LearningPathForm />} />
        <Route path="/admin/learning/:id/edit" element={<LearningPathForm />} />
        <Route path="/admin/schemes" element={<Schemes />} />
        <Route path="/admin/schemes/create" element={<SchemeForm />} />
        <Route path="/admin/schemes/:id/edit" element={<SchemeForm />} />
        <Route path="/admin/products" element={<Products />} />
        <Route path="/admin/market" element={<Market />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Providers>
      <AppContent />
    </Providers>
  );
}

export default App;
