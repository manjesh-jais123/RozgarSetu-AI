import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../hooks/useStores';
import { Button } from '../../components/ui/Button';
import {
  LayoutDashboard,
  Users,
  Award,
  Briefcase,
  BookOpen,
  Landmark,
  Package,
  ShoppingCart,
  BarChart3,
  Shield,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const adminNavItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { label: 'Users', icon: Users, href: '/admin/users' },
  { label: 'Skills', icon: Award, href: '/admin/skills' },
  { label: 'Opportunities', icon: Briefcase, href: '/admin/opportunities' },
  { label: 'Learning', icon: BookOpen, href: '/admin/learning' },
  { label: 'Schemes', icon: Landmark, href: '/admin/schemes' },
  { label: 'Products', icon: Package, href: '/admin/products' },
  { label: 'Market', icon: ShoppingCart, href: '/admin/market' },
  { label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
  { label: 'Audit Logs', icon: Shield, href: '/admin/audit-logs' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
];

export function AdminLayout() {
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNav = (href: string) => {
    navigate(href);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-white lg:border-r lg:border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary-600" />
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Admin Panel</h2>
              <p className="text-xs text-gray-500">RozgarSetu AI</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          <nav className="space-y-1 px-3">
            {adminNavItems.map((item) => {
              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
              return (
                <button
                  key={item.href}
                  onClick={() => handleNav(item.href)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-primary-50 text-primary-700 border-l-3 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <Users className="w-4 h-4 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.role || 'ADMIN'}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden bg-white border-b border-gray-100 p-3 flex items-center justify-between">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-50"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-600" />
            <span className="font-semibold text-gray-900">Admin Panel</span>
          </div>
          <div className="w-10" />
        </header>

        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
            <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-primary-600" />
                    <span className="font-bold text-gray-900">Admin Panel</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <nav className="space-y-1 p-3">
                {adminNavItems.map((item) => {
                  const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleNav(item.href)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                        ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}
                      `}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto pb-8">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
