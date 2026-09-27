import { apiClient } from './apiClient';
import type {
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
  DashboardStats,
  PaginatedResponse,
  UserFilters,
  SkillFilters,
  OpportunityFilters,
  LearningPathFilters,
  SchemeFilters,
  ProductFilters,
} from '../types/admin';

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
    getDashboardStats: async (): Promise<DashboardStats> => {
      const response = await apiClient.get('/admin/dashboard');
      return response.data.data;
    },
  },

  users: {
    list: async (filters: UserFilters = {}): Promise<PaginatedResponse<AdminUser>> => {
      const params = buildParams(filters as Record<string, unknown>);
      const response = await apiClient.get(`/admin/users?${params.toString()}`);
      return response.data.data;
    },
    get: async (id: string): Promise<AdminUser> => {
      const response = await apiClient.get(`/admin/users/${id}`);
      return response.data.data;
    },
    update: async (id: string, data: Partial<AdminUser>): Promise<AdminUser> => {
      const response = await apiClient.put(`/admin/users/${id}`, data);
      return response.data.data;
    },
    suspend: async (id: string): Promise<AdminUser> => {
      const response = await apiClient.patch(`/admin/users/${id}/suspend`);
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
    list: async (filters: SkillFilters = {}): Promise<PaginatedResponse<AdminSkill>> => {
      const params = buildParams(filters as Record<string, unknown>);
      const response = await apiClient.get(`/admin/skills?${params.toString()}`);
      return response.data.data;
    },
    get: async (id: string): Promise<AdminSkill> => {
      const response = await apiClient.get(`/admin/skills/${id}`);
      return response.data.data;
    },
    create: async (data: Omit<AdminSkill, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdminSkill> => {
      const response = await apiClient.post('/admin/skills', data);
      return response.data.data;
    },
    update: async (id: string, data: Partial<AdminSkill>): Promise<AdminSkill> => {
      const response = await apiClient.put(`/admin/skills/${id}`, data);
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
    create: async (data: Omit<AdminOpportunity, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdminOpportunity> => {
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
  },

  learning: {
    listPaths: async (filters: LearningPathFilters = {}): Promise<PaginatedResponse<AdminLearningPath>> => {
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
  },

  schemes: {
    list: async (filters: SchemeFilters = {}): Promise<PaginatedResponse<AdminScheme>> => {
      const params = buildParams(filters as Record<string, unknown>);
      const response = await apiClient.get(`/admin/schemes?${params.toString()}`);
      return response.data.data;
    },
    get: async (id: string): Promise<AdminScheme> => {
      const response = await apiClient.get(`/admin/schemes/${id}`);
      return response.data.data;
    },
    create: async (data: Omit<AdminScheme, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdminScheme> => {
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
    list: async (filters: ProductFilters = {}): Promise<PaginatedResponse<AdminProduct>> => {
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
    moderate: async (id: string, data: { moderationStatus: string; moderationNote?: string }): Promise<AdminProduct> => {
      const response = await apiClient.patch(`/admin/products/${id}/moderate`, data);
      return response.data.data;
    },
  },

  market: {
    listBuyers: async (filters: Record<string, unknown> = {}): Promise<PaginatedResponse<AdminBuyer>> => {
      const params = buildParams(filters);
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
    getFundingApplications: async (filters: Record<string, unknown> = {}): Promise<PaginatedResponse<AdminFundingApplication>> => {
      const params = buildParams(filters);
      const response = await apiClient.get(`/admin/funding/applications?${params.toString()}`);
      return response.data.data;
    },
  },
};
