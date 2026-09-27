import { apiClient, isMockApi } from './apiClient';
import { authService } from './mockServices';
import type { User, Opportunity, LearningPath, Scheme, Product, Buyer, BusinessPlan, AIRecommendation } from '../types';
import { useAuthStore } from '../hooks/useStores';

function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}

function setTokens(user: User, accessToken: string, refreshToken: string) {
  useAuthStore.getState().setAuth(user, accessToken, refreshToken);
}

function clearTokens() {
  useAuthStore.getState().logout();
}

export const apiServices = {
  authService: {
    async login(phone: string): Promise<{ success: boolean; message: string }> {
      const response = await apiClient.post('/auth/login', { phone });
      return { success: true, message: response.data.message };
    },

    async verifyOtp(phone: string, otp: string): Promise<{ user: User; accessToken: string; refreshToken: string }> {
      const response = await apiClient.post('/auth/verify-otp', { phone, otp });
      const { user, accessToken, refreshToken } = response.data.data;
      setTokens(user, accessToken, refreshToken);
      return { user, accessToken, refreshToken };
    },

    async register(data: { name: string; phone: string; language: string }): Promise<{ user: User; accessToken: string; refreshToken: string }> {
      const response = await apiClient.post('/auth/register', data);
      const { user, accessToken, refreshToken } = response.data.data;
      setTokens(user, accessToken, refreshToken);
      return { user, accessToken, refreshToken };
    },

    async getMe(): Promise<User> {
      const token = getAccessToken();
      if (!token) throw new Error('No access token');
      const response = await apiClient.get('/auth/me');
      return response.data.data;
    },

    async logout(): Promise<void> {
      await apiClient.post('/auth/logout');
      clearTokens();
    },
  },

  profileService: {
    async getProfile(): Promise<User> {
      const response = await apiClient.get('/users/profile');
      return response.data.data;
    },

    async updateBasicInfo(data: Partial<User['profile']>): Promise<User> {
      const response = await apiClient.put('/users/profile/basic', data);
      return response.data.data;
    },

    async updateSkills(skills: User['profile']['skills']): Promise<User> {
      const response = await apiClient.put('/users/profile/skills', { skills });
      return response.data.data;
    },

    async updateInterests(interests: User['profile']['interests']): Promise<User> {
      const response = await apiClient.put('/users/profile/interests', { interests });
      return response.data.data;
    },

    async updateFinancialInfo(financialInfo: User['profile']['financialInfo']): Promise<User> {
      const response = await apiClient.put('/users/profile/financial', financialInfo);
      return response.data.data;
    },

    async updateGoals(goals: User['profile']['goals']): Promise<User> {
      const response = await apiClient.put('/users/profile/goals', { goals });
      return response.data.data;
    },

    async completeOnboarding(): Promise<User> {
      const response = await apiClient.post('/users/onboarding/complete');
      return response.data.data;
    },
  },

  opportunityService: {
    async getOpportunities(filters?: Record<string, unknown>): Promise<Opportunity[]> {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }
      const response = await apiClient.get(`/opportunities?${params.toString()}`);
      return response.data.data.data;
    },

    async getOpportunity(id: string): Promise<Opportunity | null> {
      const response = await apiClient.get(`/opportunities/${id}`);
      return response.data.data;
    },

    async getRecommendedOpportunities(_userId: string): Promise<Opportunity[]> {
      const response = await apiClient.get(`/opportunities/recommendations`);
      return response.data.data;
    },

    async getCategories(): Promise<string[]> {
      const response = await apiClient.get('/opportunities/categories');
      return response.data.data;
    },
  },

  learningService: {
    async getLearningPaths(): Promise<LearningPath[]> {
      const response = await apiClient.get('/learning/paths');
      return response.data.data.data;
    },

    async getLearningPath(id: string): Promise<LearningPath | null> {
      const response = await apiClient.get(`/learning/paths/${id}`);
      return response.data.data;
    },

    async getLesson(pathId: string, lessonId: string): Promise<LearningPath['lessons'][0] | null> {
      const response = await apiClient.get(`/learning/paths/${pathId}/lessons/${lessonId}`);
      return response.data.data;
    },

    async completeLesson(pathId: string, lessonId: string): Promise<{ success: boolean; nextLessonId?: string }> {
      const response = await apiClient.post(`/learning/paths/${pathId}/lessons/${lessonId}/complete`);
      return response.data.data;
    },

    async submitQuiz(pathId: string, lessonId: string, answers: number[]): Promise<{ score: number; passed: boolean; correctAnswers: number[] }> {
      const response = await apiClient.post(`/learning/paths/${pathId}/lessons/${lessonId}/quiz`, { answers });
      return response.data.data;
    },

    async getProgress(_userId: string): Promise<Record<string, number>> {
      const response = await apiClient.get('/learning/progress');
      return response.data.data.learningPaths;
    },

    async getRecommendedPaths(_userId: string): Promise<LearningPath[]> {
      const response = await apiClient.get('/learning/recommendations');
      return response.data.data;
    },
  },

  schemeService: {
    async getSchemes(): Promise<Scheme[]> {
      const response = await apiClient.get('/schemes');
      return response.data.data.data;
    },

    async getScheme(id: string): Promise<Scheme | null> {
      const response = await apiClient.get(`/schemes/${id}`);
      return response.data.data;
    },

    async getRecommendedSchemes(_userId: string): Promise<Scheme[]> {
      return apiServices.schemeService.getSchemes().then(schemes => {
        return schemes.sort((a, b) => b.matchPercentage - a.matchPercentage);
      });
    },

    async checkEligibility(schemeId: string, _userId: string): Promise<{ eligible: boolean; reasons: string[] }> {
      const response = await apiClient.get(`/schemes/${schemeId}/eligibility`);
      return response.data.data;
    },
  },

  productService: {
    async getProducts(): Promise<Product[]> {
      const response = await apiClient.get('/products/my');
      return response.data.data;
    },

    async getProduct(id: string): Promise<Product | null> {
      const response = await apiClient.get(`/products/${id}`);
      return response.data.data;
    },

    async createProduct(data: Omit<Product, 'id'>): Promise<Product> {
      const response = await apiClient.post('/products', data);
      return response.data.data;
    },

    async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
      const response = await apiClient.put(`/products/${id}`, data);
      return response.data.data;
    },

    async deleteProduct(id: string): Promise<void> {
      await apiClient.delete(`/products/${id}`);
    },
  },

  marketService: {
    async getBuyers(filters?: Record<string, unknown>): Promise<Buyer[]> {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }
      const response = await apiClient.get(`/market/buyers?${params.toString()}`);
      return response.data.data.data;
    },

    async getBuyer(id: string): Promise<Buyer | null> {
      const response = await apiClient.get(`/market/buyers/${id}`);
      return response.data.data;
    },

    async connectWithBuyer(buyerId: string, userId: string, message: string): Promise<{ success: boolean; connectionId: string }> {
      const response = await apiClient.post(`/market/buyers/${buyerId}/connect`, { message });
      return { success: true, connectionId: response.data.data._id };
    },

    async submitRfq(data: { productId: string; quantity: number; message: string }): Promise<{ success: boolean; rfqId: string }> {
      const response = await apiClient.post('/market/rfq', { ...data, type: 'rfq' });
      return { success: true, rfqId: response.data.data._id };
    },
  },

  businessService: {
    async getBusinessPlan(_userId: string): Promise<BusinessPlan | null> {
      const response = await apiClient.get('/business/plan');
      return response.data.data;
    },

    async createBusinessPlan(data: Omit<BusinessPlan, 'id' | 'status'>): Promise<BusinessPlan> {
      const response = await apiClient.post('/business/plan', data);
      return response.data.data;
    },

    async updateBusinessPlan(id: string, data: Partial<BusinessPlan>): Promise<BusinessPlan> {
      const response = await apiClient.put('/business/plan', data);
      return response.data.data;
    },

    async getDashboard(_userId: string): Promise<Record<string, unknown>> {
      const response = await apiClient.get('/business/dashboard');
      return response.data.data;
    },
  },

  aiService: {
    async getRecommendations(_userId: string): Promise<AIRecommendation[]> {
      const response = await apiClient.get('/ai/recommendations');
      return response.data.data;
    },

    async chat(message: string, context?: Record<string, unknown>): Promise<{ response: string; suggestions?: string[] }> {
      const response = await apiClient.post('/ai/chat', { message, context });
      return response.data.data;
    },

    async explain(topic: string, language: 'hi' | 'en', style: 'simple' | 'example' | 'village'): Promise<string> {
      const response = await apiClient.post('/ai/explain', { topic, language, style });
      return response.data.data.explanation;
    },

    async getRoadmap(_userId: string): Promise<{ currentStep: string; nextAction: string; steps: Array<{ id: string; label: string; completed: boolean }> }> {
      const response = await apiClient.get('/ai/roadmap');
      return response.data.data;
    },
  },
};

export function getAuthService() {
  return isMockApi() ? authService : apiServices.authService;
}

export function getProfileService() {
  return isMockApi() ? null : apiServices.profileService;
}
