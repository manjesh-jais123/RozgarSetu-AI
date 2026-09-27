import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/adminApi';
import type { AdminUser, AdminSkill, AdminOpportunity, AdminLearningPath, AdminScheme } from '../types/admin';

export const adminKeys = {
  dashboard: () => ['admin', 'dashboard'] as const,
  users: () => ['admin', 'users'] as const,
  user: (id: string) => ['admin', 'users', id] as const,
  skills: () => ['admin', 'skills'] as const,
  skill: (id: string) => ['admin', 'skills', id] as const,
  opportunities: () => ['admin', 'opportunities'] as const,
  opportunity: (id: string) => ['admin', 'opportunities', id] as const,
  learningPaths: () => ['admin', 'learning'] as const,
  learningPath: (id: string) => ['admin', 'learning', id] as const,
  schemes: () => ['admin', 'schemes'] as const,
  scheme: (id: string) => ['admin', 'schemes', id] as const,
  products: () => ['admin', 'products'] as const,
  product: (id: string) => ['admin', 'products', id] as const,
  buyers: () => ['admin', 'buyers'] as const,
  orders: () => ['admin', 'orders'] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: () => adminApi.analytics.getDashboardStats(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUsers(filters: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: [...adminKeys.users(), filters],
    queryFn: () => adminApi.users.list(filters),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: adminKeys.user(id),
    queryFn: () => adminApi.users.get(id),
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdminUser> }) => adminApi.users.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
}

export function useSuspendUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.users.suspend(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
}

export function useActivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.users.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.users.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
}

export function useAuditLogs(filters: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: ['admin', 'audit-logs', filters],
    queryFn: () => adminApi.users.getAuditLogs(filters),
  });
}

export function useSkills(filters = {}) {
  return useQuery({
    queryKey: [...adminKeys.skills(), filters],
    queryFn: () => adminApi.skills.list(filters),
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<AdminSkill, 'id' | 'createdAt' | 'updatedAt'>) => adminApi.skills.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.skills() });
    },
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdminSkill> }) => adminApi.skills.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.skills() });
    },
  });
}

export function useOpportunities(filters = {}) {
  return useQuery({
    queryKey: [...adminKeys.opportunities(), filters],
    queryFn: () => adminApi.opportunities.list(filters),
  });
}

export function useCreateOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<AdminOpportunity, 'id' | 'createdAt' | 'updatedAt'>) => adminApi.opportunities.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.opportunities() });
    },
  });
}

export function useUpdateOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdminOpportunity> }) => adminApi.opportunities.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.opportunities() });
    },
  });
}

export function useLearningPaths(filters = {}) {
  return useQuery({
    queryKey: [...adminKeys.learningPaths(), filters],
    queryFn: () => adminApi.learning.listPaths(filters),
  });
}

export function useCreateLearningPath() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AdminLearningPath>) => adminApi.learning.createPath(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.learningPaths() });
    },
  });
}

export function useUpdateLearningPath() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdminLearningPath> }) => adminApi.learning.updatePath(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.learningPaths() });
    },
  });
}

export function useSchemes(filters = {}) {
  return useQuery({
    queryKey: [...adminKeys.schemes(), filters],
    queryFn: () => adminApi.schemes.list(filters),
  });
}

export function useVerifyScheme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.schemes.verify(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.schemes() });
    },
  });
}

export function useCreateScheme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<AdminScheme, 'id' | 'createdAt' | 'updatedAt'>) => adminApi.schemes.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.schemes() });
    },
  });
}

export function useUpdateScheme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdminScheme> }) => adminApi.schemes.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.schemes() });
    },
  });
}

export function useProducts(filters = {}) {
  return useQuery({
    queryKey: [...adminKeys.products(), filters],
    queryFn: () => adminApi.products.list(filters),
  });
}

export function useModerateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: string; note?: string }) =>
      adminApi.products.moderate(id, { moderationStatus: status, moderationNote: note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.products() });
    },
  });
}

export function useBuyers(filters = {}) {
  return useQuery({
    queryKey: [...adminKeys.buyers(), filters],
    queryFn: () => adminApi.market.listBuyers(filters),
  });
}

export function useOrders(filters = {}) {
  return useQuery({
    queryKey: [...adminKeys.orders(), filters],
    queryFn: () => adminApi.market.listOrders(filters),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => adminApi.market.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.orders() });
    },
  });
}

export function useFundingApplications(filters = {}) {
  return useQuery({
    queryKey: ['admin', 'funding', filters],
    queryFn: () => adminApi.market.getFundingApplications(filters),
  });
}
