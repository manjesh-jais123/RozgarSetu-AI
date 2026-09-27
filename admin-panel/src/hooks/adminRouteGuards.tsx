import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const isAdmin = user && ['ADMIN', 'SUPER_ADMIN'].includes(user.role);
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to="/admin" replace />;
  return <>{children}</>;
}
