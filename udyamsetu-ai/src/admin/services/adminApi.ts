import { apiClient } from '../../services/apiClient';
import type {
  AdminDashboardStats,
  AdminUser,
  AdminSkill,
  AdminOpportunity,
  AdminLearningPath,
  AdminLesson,
  AdminScheme,
  AdminProduct,
  AdminBuyer,
  AdminOrder,
  AdminFundingApplication,
  AuditLog,
  PaginatedResponse,
  UserFilters,
  SkillFilters,
  OpportunityFilters,
  LearningPathFilters,
  SchemeFilters,
  ProductFilters,
  BuyerFilters,
  AIGenerationStats,
} from '../types';

const buildParams = (filters: Record<string, unknown>): URLSearchParams => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });
  return params;
};

export const adminApi = {
  analytics: {
    getDashboardStats: async (): Promise<AdminDashboardStats> => {
      const response = await apiClient.get('/admin/dashboard');
      return response.data.data;
    },

    getUserGrowth: async (period: string = '30d'): Promise<Array<{ date: string; newUsers: number; onboardingCompleted: number }>> => {
      const response = await apiClient.get(`/admin/analytics/user-growth?period=${period}`);
      return response.data.data;
    },

    getAIGenerationStats: async (period: string = '30d'): Promise<AIGenerationStats> => {
      const response = await apiClient.get(`/admin/analytics/ai-stats?period=${period}`);
      return response.data.data;
    },

    getBusinessAnalytics: async (period: string = '30d'): Promise<Record<string, unknown>> => {
      const response = await apiClient.get(`/admin/analytics/business?period=${period}`);
      return response.data.data;
    },
  },

  users: {
    list: async (filters: UserFilters = {}): Promise<PaginatedResponse<AdminUser>> => {
      const params = buildParams(filters as Record<string, unknown>);
      const response = await apiClient.get(`/admin/users?${params.toString()}`);
      return response.data.data;
    },

    get: async (id: string): Promise<{ user: AdminUser; progress?: Record<string, unknown>; businessPlan?: Record<string, unknown>; orderCount?: number; fundingApplications?: Array<Record<string, unknown>> }> => {
      const response = await apiClient.get(`/admin/users/${id}`);
      return response.data.data;
    },

    update: async (id: string, data: Partial<AdminUser>): Promise<AdminUser> => {
      const response = await apiClient.put(`/admin/users/${id}`, data);
      return response.data.data;
    },

    suspend: async (id: string, reason?: string): Promise<AdminUser> => {
      const response = await apiClient.patch(`/admin/users/${id}/suspend`, { reason });
      return response.data.data;
    },

    activate: async (id: string): Promise<AdminUser> => {
      const response = await apiClient.patch(`/admin/users/${id}/activate`);
      return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
      await apiClient.delete(`/admin/users/${id}`);
    },

    getAuditLogs: async (filters: Record<string, unknown> = {}): Promise<PaginatedResponse<AuditLog>> => {
      const params = buildParams(filters);
      const response = await apiClient.get(`/admin/audit-logs?${params.toString()}`);
      return response.data.data;
    },
  },

  skills: {
    list: async (filters: SkillFilters = {}): Promise<{ skills: AdminSkill[]; categories: string[]; pagination: PaginatedResponse<AdminSkill> }> => {
      const params = buildParams(filters as Record<string, unknown>);
      const response = await apiClient.get(`/admin/skills?${params.toString()}`);
      return response.data.data;
    },

    get: async (id: string): Promise<AdminSkill> => {
      const response = await apiClient.get(`/admin/skills/${id}`);
      return response.data.data;
    },

    create: async (data: Partial<AdminSkill>): Promise<AdminSkill> => {
      const response = await apiClient.post('/admin/skills', data);
      return response.data.data;
    },

    update: async (id: string, data: Partial<AdminSkill>): Promise<AdminSkill> => {
      const response = await apiClient.put(`/admin/skills/${id}`, data);
      return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
      await apiClient.delete(`/admin/skills/${id}`);
    },

    getCategories: async (): Promise<string[]> => {
      const response = await apiClient.get('/admin/skills/categories');
      return response.data.data;
    },
  },

  opportunities: {
    list: async (filters: OpportunityFilters = {}): Promise<PaginatedResponse<AdminOpportunity>> => {
      const params = buildParams(filters as Record<string, unknown>);
      const response = await apiClient.get(`/admin/opportunities?${params.toString()}`);
      return response.data.data;
    },

    get: async (id: string): Promise<AdminOpportunity> => {
      const response = await apiClient.get(`/admin/opportunities/${id}`);
      return response.data.data;
    },

    create: async (data: Partial<AdminOpportunity>): Promise<AdminOpportunity> => {
      const response = await apiClient.post('/admin/opportunities', data);
      return response.data.data;
    },

    update: async (id: string, data: Partial<AdminOpportunity>): Promise<AdminOpportunity> => {
      const response = await apiClient.put(`/admin/opportunities/${id}`, data);
      return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
      await apiClient.delete(`/admin/opportunities/${id}`);
    },

    getCategories: async (): Promise<string[]> => {
      const response = await apiClient.get('/admin/opportunities/categories');
      return response.data.data;
    },
  },

  learning: {
    listPaths: async (filters: LearningPathFilters = {}): Promise<{ paths: AdminLearningPath[]; categories: string[]; pagination: PaginatedResponse<AdminLearningPath> }> => {
      const params = buildParams(filters as Record<string, unknown>);
      const response = await apiClient.get(`/admin/learning/paths?${params.toString()}`);
      return response.data.data;
    },

    getPath: async (id: string): Promise<AdminLearningPath> => {
      const response = await apiClient.get(`/admin/learning/paths/${id}`);
      return response.data.data;
    },

    createPath: async (data: Partial<AdminLearningPath>): Promise<AdminLearningPath> => {
      const response = await apiClient.post('/admin/learning/paths', data);
      return response.data.data;
    },

    updatePath: async (id: string, data: Partial<AdminLearningPath>): Promise<AdminLearningPath> => {
      const response = await apiClient.put(`/admin/learning/paths/${id}`, data);
      return response.data.data;
    },

    deletePath: async (id: string): Promise<void> => {
      await apiClient.delete(`/admin/learning/paths/${id}`);
    },

    getLessons: async (pathId: string): Promise<AdminLesson[]> => {
      const response = await apiClient.get(`/admin/learning/paths/${pathId}/lessons`);
      return response.data.data;
    },

    getLesson: async (pathId: string, lessonId: string): Promise<AdminLesson> => {
      const response = await apiClient.get(`/admin/learning/paths/${pathId}/lessons/${lessonId}`);
      return response.data.data;
    },

    updateLesson: async (pathId: string, lessonId: string, data: Partial<AdminLesson>): Promise<AdminLesson> => {
      const response = await apiClient.patch(`/admin/learning/paths/${pathId}/lessons/${lessonId}`, data);
      return response.data.data;
    },

    getProgress: async (): Promise<PaginatedResponse<Record<string, unknown>>> => {
      const response = await apiClient.get('/admin/learning/progress');
      return response.data.data;
    },
  },

  schemes: {
    list: async (filters: SchemeFilters = {}): Promise<{ schemes: AdminScheme[]; categories: string[]; pagination: PaginatedResponse<AdminScheme> }> => {
      const params = buildParams(filters as Record<string, unknown>);
      const response = await apiClient.get(`/admin/schemes?${params.toString()}`);
      return response.data.data;
    },

    get: async (id: string): Promise<AdminScheme> => {
      const response = await apiClient.get(`/admin/schemes/${id}`);
      return response.data.data;
    },

    create: async (data: Partial<AdminScheme>): Promise<AdminScheme> => {
      const response = await apiClient.post('/admin/schemes', data);
      return response.data.data;
    },

    update: async (id: string, data: Partial<AdminScheme>): Promise<AdminScheme> => {
      const response = await apiClient.put(`/admin/schemes/${id}`, data);
      return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
      await apiClient.delete(`/admin/schemes/${id}`);
    },

    verify: async (id: string): Promise<AdminScheme> => {
      const response = await apiClient.patch(`/admin/schemes/${id}/verify`);
      return response.data.data;
    },
  },

  products: {
    list: async (filters: ProductFilters = {}): Promise<{ products: AdminProduct[]; categories: string[]; pagination: PaginatedResponse<AdminProduct> }> => {
      const params = buildParams(filters as Record<string, unknown>);
      const response = await apiClient.get(`/admin/products?${params.toString()}`);
      return response.data.data;
    },

    get: async (id: string): Promise<AdminProduct> => {
      const response = await apiClient.get(`/admin/products/${id}`);
      return response.data.data;
    },

    update: async (id: string, data: Partial<AdminProduct>): Promise<AdminProduct> => {
      const response = await apiClient.put(`/admin/products/${id}`, data);
      return response.data.data;
    },

    moderate: async (id: string, data: { moderationStatus: string; moderationNote?: string; category?: string; status?: string }): Promise<AdminProduct> => {
      const response = await apiClient.patch(`/admin/products/${id}/moderate`, data);
      return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
      await apiClient.delete(`/admin/products/${id}`);
    },

    getCategories: async (): Promise<string[]> => {
      const response = await apiClient.get('/admin/products/categories');
      return response.data.data;
    },
  },

  market: {
    listBuyers: async (filters: BuyerFilters = {}): Promise<PaginatedResponse<AdminBuyer>> => {
      const params = buildParams(filters as Record<string, unknown>);
      const response = await apiClient.get(`/admin/market/buyers?${params.toString()}`);
      return response.data.data;
    },

    getBuyer: async (id: string): Promise<AdminBuyer> => {
      const response = await apiClient.get(`/admin/market/buyers/${id}`);
      return response.data.data;
    },

    createBuyer: async (data: Partial<AdminBuyer>): Promise<AdminBuyer> => {
      const response = await apiClient.post('/admin/market/buyers', data);
      return response.data.data;
    },

    updateBuyer: async (id: string, data: Partial<AdminBuyer>): Promise<AdminBuyer> => {
      const response = await apiClient.put(`/admin/market/buyers/${id}`, data);
      return response.data.data;
    },

    deleteBuyer: async (id: string): Promise<void> => {
      await apiClient.delete(`/admin/market/buyers/${id}`);
    },

    listOrders: async (filters: Record<string, unknown> = {}): Promise<PaginatedResponse<AdminOrder>> => {
      const params = buildParams(filters);
      const response = await apiClient.get(`/admin/market/orders?${params.toString()}`);
      return response.data.data;
    },

    getOrder: async (id: string): Promise<AdminOrder> => {
      const response = await apiClient.get(`/admin/market/orders/${id}`);
      return response.data.data;
    },

    updateOrderStatus: async (id: string, status: string): Promise<AdminOrder> => {
      const response = await apiClient.patch(`/admin/market/orders/${id}/status`, { status });
      return response.data.data;
    },

    listRequests: async (filters: Record<string, unknown> = {}): Promise<PaginatedResponse<Record<string, unknown>>> => {
      const params = buildParams(filters);
      const response = await apiClient.get(`/admin/market/requests?${params.toString()}`);
      return response.data.data;
    },

    updateRequest: async (id: string, data: Record<string, unknown>): Promise<Record<string, unknown>> => {
      const response = await apiClient.patch(`/admin/market/requests/${id}`, data);
      return response.data.data;
    },

    getFundingApplications: async (filters: Record<string, unknown> = {}): Promise<PaginatedResponse<AdminFundingApplication>> => {
      const params = buildParams(filters);
      const response = await apiClient.get(`/admin/funding/applications?${params.toString()}`);
      return response.data.data;
    },

    updateFundingApplication: async (id: string, data: Record<string, unknown>): Promise<AdminFundingApplication> => {
      const response = await apiClient.patch(`/admin/funding/applications/${id}`, data);
      return response.data.data;
    },
  },
};
