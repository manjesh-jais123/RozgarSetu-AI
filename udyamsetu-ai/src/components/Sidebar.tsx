import { useAuthStore, useUIStore } from '../hooks/useStores';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Home, TrendingUp, BookOpen, Briefcase, DollarSign, Users, Package, User, X, LogOut } from 'lucide-react';
import { ProgressBar } from './ui/ProgressBar';
import { useLogout } from '../hooks/useQueries';

const navItems = [
  { label: 'Home', icon: Home, href: '/dashboard' },
  { label: 'Explore', icon: TrendingUp, href: '/explore' },
  { label: 'Learn', icon: BookOpen, href: '/learn' },
  { label: 'Business', icon: Briefcase, href: '/business' },
  { label: 'Funding', icon: DollarSign, href: '/funding' },
  { label: 'Market', icon: Users, href: '/market' },
  { label: 'Products', icon: Package, href: '/products' },
  { label: 'Profile', icon: User, href: '/profile' },
];

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logout();
    logoutMutation.mutate();
    navigate('/welcome');
  };

  const handleNav = (href: string) => {
    navigate(href);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r border-gray-100 min-h-[calc(100vh-4rem)] sticky top-16 z-30">
        <div className="p-4">
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl mb-4">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.phone || '+91 98765 43210'}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <button
                  key={item.href}
                  onClick={() => handleNav(item.href)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors touch-target
                    ${isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {item.label}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-6 bg-primary-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-6 p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-semibold text-gray-900">Today's Mission</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">Complete Lesson 3: Equipment Setup</p>
            <ProgressBar value={35} size="sm" showLabel={false} />
            <p className="text-xs text-gray-500 mt-1">35% complete</p>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white shadow-xl z-50 flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
                  <span className="text-white font-bold">ु</span>
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">RozgarSetu AI</h2>
                  <p className="text-xs text-gray-500">From Skill to Sustainable Income</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors touch-target"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl mb-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.phone || '+91 98765 43210'}</p>
                </div>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleNav(item.href)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors touch-target
                        ${isActive
                          ? 'bg-primary-50 text-primary-700'
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

            <div className="mt-auto p-4 border-t border-gray-100">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}