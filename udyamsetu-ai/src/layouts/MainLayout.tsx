import { Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../hooks/useStores';
import { Sidebar } from '../components/Sidebar';
import { BottomNav } from '../components/BottomNav';
import { Header } from '../components/Header';
import { VoiceButton } from '../components/ui/VoiceButton';
import { AIChatBot } from '../components/AIChatBot';
import { useToast } from '../components/ui/Toast';

export function MainLayout() {
  const { isAuthenticated } = useAuthStore();
  void isAuthenticated;
  const location = useLocation();
  const { addToast } = useToast();
  const isAuthPage = ['/login', '/register', '/otp', '/forgot-phone', '/welcome'].includes(location.pathname);
  const isOnboarding = location.pathname === '/onboarding';

  const handleVoiceStart = () => {
    addToast({ type: 'info', title: 'Voice Assistant', message: 'Listening...' });
  };

  const handleVoiceStop = () => {
    addToast({ type: 'success', title: 'Voice Assistant', message: 'Voice input captured' });
  };

  const handleVoiceError = (error: Error) => {
    addToast({ type: 'error', title: 'Voice Error', message: error.message });
  };

  if (isAuthPage || isOnboarding) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0 pb-20 lg:pb-0">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <BottomNav />
      <AIChatBot />
      
      <div className="fixed bottom-40 right-4 z-40 lg:bottom-40 lg:right-6">
        <VoiceButton
          size="lg"
          onStartListening={handleVoiceStart}
          onStopListening={handleVoiceStop}
          onError={handleVoiceError}
          showStatus={false}
        />
      </div>
    </div>
  );
}