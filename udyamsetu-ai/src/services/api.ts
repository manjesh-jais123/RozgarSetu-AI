import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                refreshToken,
              });

              const { accessToken, refreshToken: newRefreshToken } = response.data;
              localStorage.setItem('access_token', accessToken);
              localStorage.setItem('refresh_token', newRefreshToken);

              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  get<T>(url: string, params?: Record<string, unknown>) {
    return this.client.get<T>(url, { params });
  }

  post<T>(url: string, data?: unknown) {
    return this.client.post<T>(url, data);
  }

  put<T>(url: string, data?: unknown) {
    return this.client.put<T>(url, data);
  }

  patch<T>(url: string, data?: unknown) {
    return this.client.patch<T>(url, data);
  }

  delete<T>(url: string) {
    return this.client.delete<T>(url);
  }
}

export const apiClient = new ApiClient();

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    verifyOtp: '/auth/verify-otp',
    resendOtp: '/auth/resend-otp',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  profile: {
    get: '/profile',
    update: '/profile',
    updateBasic: '/profile/basic',
    updateSkills: '/profile/skills',
    updateInterests: '/profile/interests',
    updateFinancial: '/profile/financial',
    updateGoals: '/profile/goals',
    completeOnboarding: '/profile/complete-onboarding',
  },
  opportunities: {
    list: '/opportunities',
    get: (id: string) => `/opportunities/${id}`,
    recommend: '/opportunities/recommend',
    filter: '/opportunities/filter',
    categories: '/opportunities/categories',
  },
  learning: {
    paths: '/learning/paths',
    getPath: (id: string) => `/learning/paths/${id}`,
    getLesson: (pathId: string, lessonId: string) => `/learning/paths/${pathId}/lessons/${lessonId}`,
    completeLesson: (pathId: string, lessonId: string) => `/learning/paths/${pathId}/lessons/${lessonId}/complete`,
    submitQuiz: (pathId: string, lessonId: string) => `/learning/paths/${pathId}/lessons/${lessonId}/quiz`,
    progress: '/learning/progress',
    recommend: '/learning/recommend',
  },
  business: {
    plan: '/business/plan',
    getPlan: (id: string) => `/business/plan/${id}`,
    updatePlan: (id: string) => `/business/plan/${id}`,
    dashboard: '/business/dashboard',
    ideas: '/business/ideas',
  },
  schemes: {
    list: '/schemes',
    get: (id: string) => `/schemes/${id}`,
    recommend: '/schemes/recommend',
    eligibility: (id: string) => `/schemes/${id}/eligibility`,
    apply: (id: string) => `/schemes/${id}/apply`,
  },
  products: {
    list: '/products',
    get: (id: string) => `/products/${id}`,
    create: '/products',
    update: (id: string) => `/products/${id}`,
    delete: (id: string) => `/products/${id}`,
    myProducts: '/products/my',
  },
  market: {
    buyers: '/market/buyers',
    getBuyer: (id: string) => `/market/buyers/${id}`,
    connect: (id: string) => `/market/buyers/${id}/connect`,
    rfq: '/market/rfq',
    myConnections: '/market/connections',
  },
  ai: {
    chat: '/ai/chat',
    voice: '/ai/voice',
    recommendations: '/ai/recommendations',
    explain: '/ai/explain',
    roadmap: '/ai/roadmap',
  },
} as const;