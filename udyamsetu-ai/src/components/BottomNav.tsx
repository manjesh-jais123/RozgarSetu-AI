import { useNavigate, useLocation } from 'react-router-dom';
import { Home, TrendingUp, BookOpen, Briefcase, User } from 'lucide-react';

const navItems = [
  { label: 'Home', icon: Home, href: '/dashboard' },
  { label: 'Explore', icon: TrendingUp, href: '/explore' },
  { label: 'Learn', icon: BookOpen, href: '/learn' },
  { label: 'Business', icon: Briefcase, href: '/business' },
  { label: 'Profile', icon: User, href: '/profile' },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-lg">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className={`
                flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors touch-target
                ${isActive
                  ? 'text-primary-600'
                  : 'text-gray-400 hover:text-gray-600'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}