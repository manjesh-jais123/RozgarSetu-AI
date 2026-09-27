import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../hooks/useStores';
import { useToast } from '../../components/ui/Toast';

export function ProtectedAdminRoute({ children }: { children: React.ReactElement }) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const { addToast } = useToast();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
    addToast({
      type: 'error',
      title: 'Access Denied',
      message: 'Admin privileges required',
    });
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
