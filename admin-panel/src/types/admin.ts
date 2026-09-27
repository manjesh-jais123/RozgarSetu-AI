export interface AdminUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  isActive: boolean;
  onboardingCompleted: boolean;
  location: {
    state: string;
    district: string;
    village?: string;
    pincode?: string;
  };
  profile?: {
    age?: number;
    gender?: string;
    education?: string;
    workExperience?: string;
    skills?: Array<{ name: string; category: string; proficiency: string; yearsExperience: number }>;
    financialInfo?: {
      availableCapital: number;
      expectedIncome: number;
      currentIncome: number;
      investmentCapacity: number;
    };
  };
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface AdminSkill {
  id: string;
  name: string;
  category: string;
  description?: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced';
  yearsExperience: number;
  learningResourceUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOpportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  requiredInvestment: { min: number; max: number; currency: 'INR' };
  requiredSkills: string[];
  incomeScenarios: { conservative: number; expected: number; optimistic: number; currency: 'INR'; period: 'monthly' | 'yearly' };
  customerSegments: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: string;
  lessons: AdminLesson[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLesson {
  id: string;
  title: string;
  description: string;
  content: string;
  keyPoints: string[];
  order: number;
}

export interface AdminScheme {
  id: string;
  name: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  requiredDocuments: string[];
  applicationProcess: string[];
  category: string;
  officialWebsite?: string;
  stateAvailability?: string[];
  deadline?: string;
  isVerified: boolean;
  lastVerified?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  materials: string[];
  dimensions: string;
  price: number;
  minimumOrderQuantity: number;
  productionCapacity: number;
  images: string[];
  tags: string[];
  status: 'draft' | 'active' | 'inactive';
  moderationStatus: 'pending' | 'approved' | 'rejected';
  moderatorId?: string;
  moderationNote?: string;
  moderationAt?: string;
  seller: AdminUser;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminBuyer {
  id: string;
  name: string;
  type: 'individual' | 'business' | 'wholesaler' | 'retailer' | 'exporter';
  location: string;
  requiredProduct: string;
  quantity: number;
  budget: number;
  verified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface AdminOrder {
  id: string;
  productId: AdminProduct;
  buyerId: AdminBuyer;
  sellerId: AdminUser;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface AdminFundingApplication {
  id: string;
  userId: AdminUser;
  schemeId: AdminScheme;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  adminId: AdminUser;
  action: 'create' | 'read' | 'update' | 'delete' | 'suspend' | 'activate' | 'verify' | 'moderate';
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newRegistrations: number;
  learningUsers: number;
  businessesStarted: number;
  fundingMatches: number;
  productsListed: number;
  buyerMatches: number;
  orders: number;
  aiUsage: {
    totalConversations: number;
    totalRequests: number;
  };
  onboardingCompleted: number;
  onboardingRate: number;
  growthTrend: Array<{ date: string; count: number }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserFilters {
  role?: string;
  isActive?: boolean;
  onboardingCompleted?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface SkillFilters {
  category?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface OpportunityFilters {
  category?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface LearningPathFilters {
  category?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface SchemeFilters {
  category?: string;
  isVerified?: boolean;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ProductFilters {
  moderationStatus?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface BuyerFilters {
  type?: string;
  verified?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}
