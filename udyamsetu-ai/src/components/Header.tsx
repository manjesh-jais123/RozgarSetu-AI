import { Menu, Bell, User, LogOut, ChevronDown, Home, TrendingUp, BookOpen, Briefcase, Settings, DollarSign, Users, Package, Bot } from 'lucide-react';
import { useAuthStore, useUIStore } from '../hooks/useStores';
import { AIChatBot } from './AIChatBot';
import { useState, useEffect } from 'react';
import { useLogout } from '../hooks/useQueries';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export function Header() {
  const { user, logout } = useAuthStore();
  const { language, setLanguage, isMobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    logoutMutation.mutate();
    navigate('/welcome');
  };

  const navItems = [
    { label: 'Home', icon: Home, href: '/welcome' },
    { label: 'Explore', icon: TrendingUp, href: '/explore' },
    { label: 'Learn', icon: BookOpen, href: '/learn' },
    { label: 'Business', icon: Briefcase, href: '/business' },
    { label: 'Funding', icon: DollarSign, href: '/funding' },
    { label: 'Market', icon: Users, href: '/market' },
    { label: 'Products', icon: Package, href: '/products' },
    { label: 'Profile', icon: User, href: '/profile' },
  ];

  const languages = [
    { code: 'hi', name: 'हिंदी' },
    { code: 'en', name: 'English' },
  ];

  return (
    <>
      <header className={`
      sticky top-0 z-40 w-full bg-white border-b border-gray-100 transition-shadow duration-200
      ${isScrolled ? 'shadow-sm' : ''}
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">ु</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900 leading-none">RozgarSetu AI</h1>
              <p className="text-xs text-gray-500">From Skill to Sustainable Income</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-0 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href || (item.href !== '/dashboard' && location.pathname.startsWith(`${item.href}/`));
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex flex-shrink-0 items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors touch-target ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="hidden sm:flex items-center gap-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as 'hi' | 'en')}
                  className={`px-2 py-1.5 rounded-lg text-sm font-medium transition-colors touch-target ${
                    language === lang.code
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  aria-label={`Switch to ${lang.name}`}
                >
                  {lang.name}
                </button>
              ))}
            </div>

            {/* AI Chat Button */}
            <button
              onClick={() => useUIStore.getState().setChatOpen(true)}
              className="p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors touch-target"
              aria-label="Open AI assistant"
            >
              <Bot className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors touch-target"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors touch-target"
                aria-expanded={showUserMenu}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-600" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.name || 'User'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
                    <p className="text-sm text-gray-500">{user?.phone || '+91 98765 43210'}</p>
                  </div>
                  <a href="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <User className="w-4 h-4" /> Profile
                  </a>
                  <a href="/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <Settings className="w-4 h-4" /> Settings
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors touch-target"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
      <AIChatBot />
    </>  
  );
}