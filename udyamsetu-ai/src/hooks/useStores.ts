import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Toast } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      setAuth: (user, accessToken, refreshToken) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        return set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false });
      },
      setUser: (user) => set({ user }),
      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'rozgarsetu-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

interface UIState {
  language: 'hi' | 'en';
  toasts: Toast[];
  isMobileMenuOpen: boolean;
  isVoiceListening: boolean;
  isChatOpen: boolean;
  setLanguage: (language: 'hi' | 'en') => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setVoiceListening: (listening: boolean) => void;
  setChatOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      language: 'hi',
      toasts: [],
      isMobileMenuOpen: false,
      isVoiceListening: false,
      isChatOpen: false,
      setLanguage: (language) => set({ language }),
      addToast: (toast) =>
        set((state) => ({
          toasts: [...state.toasts, { ...toast, id: `toast-${Date.now()}` }],
        })),
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
      setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
      setVoiceListening: (isVoiceListening) => set({ isVoiceListening }),
      setChatOpen: (isChatOpen) => set({ isChatOpen }),
    }),
    {
      name: 'rozgarsetu-ui',
      partialize: (state) => ({ language: state.language }),
    }
  )
);

interface OnboardingState {
  currentStep: number;
  formData: Record<string, unknown>;
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Record<string, unknown>) => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStep: 1,
      formData: {},
      setCurrentStep: (currentStep) => set({ currentStep }),
      updateFormData: (formData) =>
        set((state) => ({ formData: { ...state.formData, ...formData } })),
      resetOnboarding: () => set({ currentStep: 1, formData: {} }),
    }),
    {
      name: 'rozgarsetu-onboarding',
    }
  )
);