import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiServices } from '../services/apiServices';
import { authService, profileService, opportunityService, learningService, schemeService, productService, marketService, businessService, aiService } from '../services/mockServices';
import { isMockApi } from '../services/apiClient';
import type { Product, BusinessPlan } from '../types';

const useMock = isMockApi();

const auth = useMock ? authService : apiServices.authService;
const profile = useMock ? profileService : apiServices.profileService;
const opportunities = useMock ? opportunityService : apiServices.opportunityService;
const learning = useMock ? learningService : apiServices.learningService;
const schemes = useMock ? schemeService : apiServices.schemeService;
const products = useMock ? productService : apiServices.productService;
const market = useMock ? marketService : apiServices.marketService;
const business = useMock ? businessService : apiServices.businessService;
const ai = useMock ? aiService : apiServices.aiService;

export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

export const profileKeys = {
  all: ['profile'] as const,
  detail: () => [...profileKeys.all, 'detail'] as const,
};

export const opportunityKeys = {
  all: ['opportunities'] as const,
  lists: () => [...opportunityKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...opportunityKeys.lists(), { filters }] as const,
  details: () => [...opportunityKeys.all, 'detail'] as const,
  detail: (id: string) => [...opportunityKeys.details(), id] as const,
  recommended: (userId: string) => [...opportunityKeys.all, 'recommended', userId] as const,
  categories: () => [...opportunityKeys.all, 'categories'] as const,
};

export const learningKeys = {
  all: ['learning'] as const,
  paths: () => [...learningKeys.all, 'paths'] as const,
  path: (id: string) => [...learningKeys.all, 'path', id] as const,
  lesson: (pathId: string, lessonId: string) => [...learningKeys.all, 'lesson', pathId, lessonId] as const,
  progress: (userId: string) => [...learningKeys.all, 'progress', userId] as const,
  recommended: (userId: string) => [...learningKeys.all, 'recommended', userId] as const,
};

export const schemeKeys = {
  all: ['schemes'] as const,
  lists: () => [...schemeKeys.all, 'list'] as const,
  detail: (id: string) => [...schemeKeys.all, 'detail', id] as const,
  recommended: (userId: string) => [...schemeKeys.all, 'recommended', userId] as const,
  eligibility: (schemeId: string, userId: string) => [...schemeKeys.all, 'eligibility', schemeId, userId] as const,
};

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
  myProducts: () => [...productKeys.all, 'my'] as const,
};

export const marketKeys = {
  all: ['market'] as const,
  buyers: (filters?: Record<string, unknown>) => [...marketKeys.all, 'buyers', filters] as const,
  buyer: (id: string) => [...marketKeys.all, 'buyer', id] as const,
  connections: () => [...marketKeys.all, 'connections'] as const,
};

export const businessKeys = {
  all: ['business'] as const,
  plan: (userId: string) => [...businessKeys.all, 'plan', userId] as const,
  dashboard: (userId: string) => [...businessKeys.all, 'dashboard', userId] as const,
};

export const aiKeys = {
  all: ['ai'] as const,
  recommendations: (userId: string) => [...aiKeys.all, 'recommendations', userId] as const,
  roadmap: (userId: string) => [...aiKeys.all, 'roadmap', userId] as const,
};

export function useAuth() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: auth.getMe,
    retry: false,
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: (phone: string) => auth.login(phone),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: ({ phone, otp }: { phone: string; otp: string }) => auth.verifyOtp(phone, otp),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: { name: string; phone: string; language: string }) => auth.register(data),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: auth.logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: profile.getProfile,
    enabled: false,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profile.updateBasicInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.detail() });
    },
  });
}

export function useOpportunities(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: opportunityKeys.list(filters || {}),
    queryFn: () => opportunities.getOpportunities(filters),
  });
}

export function useOpportunity(id: string) {
  return useQuery({
    queryKey: opportunityKeys.detail(id),
    queryFn: () => opportunities.getOpportunity(id),
    enabled: !!id,
  });
}

export function useRecommendedOpportunities(userId: string) {
  return useQuery({
    queryKey: opportunityKeys.recommended(userId),
    queryFn: () => opportunities.getRecommendedOpportunities(userId),
  });
}

export function useOpportunityCategories() {
  return useQuery({
    queryKey: opportunityKeys.categories(),
    queryFn: opportunities.getCategories,
  });
}

export function useLearningPaths() {
  return useQuery({
    queryKey: learningKeys.paths(),
    queryFn: learning.getLearningPaths,
  });
}

export function useLearningPath(id: string) {
  return useQuery({
    queryKey: learningKeys.path(id),
    queryFn: () => learning.getLearningPath(id),
    enabled: !!id,
  });
}

export function useLesson(pathId: string, lessonId: string) {
  return useQuery({
    queryKey: learningKeys.lesson(pathId, lessonId),
    queryFn: () => learning.getLesson(pathId, lessonId),
    enabled: !!pathId && !!lessonId,
  });
}

export function useCompleteLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ pathId, lessonId }: { pathId: string; lessonId: string }) => learning.completeLesson(pathId, lessonId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: learningKeys.path(variables.pathId) });
    },
  });
}

export function useSubmitQuiz() {
  return useMutation({
    mutationFn: ({ pathId, lessonId, answers }: { pathId: string; lessonId: string; answers: number[] }) =>
      learning.submitQuiz(pathId, lessonId, answers),
  });
}

export function useLearningProgress(userId: string) {
  return useQuery({
    queryKey: learningKeys.progress(userId),
    queryFn: () => learning.getProgress(userId),
    enabled: !!userId,
  });
}

export function useRecommendedLearningPaths(userId: string) {
  return useQuery({
    queryKey: learningKeys.recommended(userId),
    queryFn: () => learning.getRecommendedPaths(userId),
    enabled: !!userId,
  });
}

export function useSchemes() {
  return useQuery({
    queryKey: schemeKeys.lists(),
    queryFn: schemes.getSchemes,
  });
}

export function useScheme(id: string) {
  return useQuery({
    queryKey: schemeKeys.detail(id),
    queryFn: () => schemes.getScheme(id),
    enabled: !!id,
  });
}

export function useRecommendedSchemes(userId: string) {
  return useQuery({
    queryKey: schemeKeys.recommended(userId),
    queryFn: () => schemes.getRecommendedSchemes(userId),
    enabled: !!userId,
  });
}

export function useCheckSchemeEligibility(schemeId: string, userId: string) {
  return useQuery({
    queryKey: schemeKeys.eligibility(schemeId, userId),
    queryFn: () => schemes.checkEligibility(schemeId, userId),
    enabled: !!schemeId && !!userId,
  });
}

export function useProducts() {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: products.getProducts,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => products.getProduct(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: products.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.myProducts() });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => products.updateProduct(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: products.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.myProducts() });
    },
  });
}

export function useBuyers(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: marketKeys.buyers(filters),
    queryFn: () => market.getBuyers(filters),
  });
}

export function useBuyer(id: string) {
  return useQuery({
    queryKey: marketKeys.buyer(id),
    queryFn: () => market.getBuyer(id),
    enabled: !!id,
  });
}

export function useConnectWithBuyer() {
  return useMutation({
    mutationFn: ({ buyerId, userId, message }: { buyerId: string; userId: string; message: string }) =>
      market.connectWithBuyer(buyerId, userId, message),
  });
}

export function useSubmitRfq() {
  return useMutation({
    mutationFn: market.submitRfq,
  });
}

export function useBusinessPlan(userId: string) {
  return useQuery({
    queryKey: businessKeys.plan(userId),
    queryFn: () => business.getBusinessPlan(userId),
    enabled: !!userId,
  });
}

export function useCreateBusinessPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: business.createBusinessPlan,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: businessKeys.plan('') });
      queryClient.setQueryData(businessKeys.plan(''), data);
    },
  });
}

export function useUpdateBusinessPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BusinessPlan> }) => business.updateBusinessPlan(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: businessKeys.plan('') });
      queryClient.setQueryData(businessKeys.plan(''), data);
    },
  });
}

export function useBusinessDashboard(userId: string) {
  return useQuery({
    queryKey: businessKeys.dashboard(userId),
    queryFn: () => business.getDashboard(userId),
    enabled: !!userId,
  });
}

export function useAIRecommendations(userId: string) {
  return useQuery({
    queryKey: aiKeys.recommendations(userId),
    queryFn: () => ai.getRecommendations(userId),
    enabled: !!userId,
  });
}

export function useAIChat() {
  return useMutation({
    mutationFn: ({ message, context }: { message: string; context?: Record<string, unknown> }) =>
      ai.chat(message, context),
  });
}

export function useAIExplain() {
  return useMutation({
    mutationFn: ({ topic, language, style }: { topic: string; language: 'hi' | 'en'; style: 'simple' | 'example' | 'village' }) =>
      ai.explain(topic, language, style),
  });
}

export function useAIRoadmap(userId: string) {
  return useQuery({
    queryKey: aiKeys.roadmap(userId),
    queryFn: () => ai.getRoadmap(userId),
    enabled: !!userId,
  });
}
