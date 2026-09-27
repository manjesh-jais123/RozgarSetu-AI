export interface AdminDashboardStats {
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

export interface AdminUser {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  isActive?: boolean;
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
    interests?: Array<{ name: string; category: string }>;
    businessInterest?: Array<{ name: string; category: string; description: string }>;
    financialInfo?: {
      availableCapital: number;
      expectedIncome: number;
      currentIncome: number;
      investmentCapacity: number;
    };
    goals?: Array<{ name: string; description: string; category: string }>;
  };
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface AdminSkill {
  _id: string;
  name: string;
  category: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOpportunity {
  _id: string;
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
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: string;
  lessons: AdminLesson[];
  progress: number;
  thumbnail?: string;
  tags: string[];
  matchPercentage: number;
  isActive: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLesson {
  _id?: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  order: number;
  keyPoints: string[];
  quiz?: AdminQuiz;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminQuizQuestion {
  _id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface AdminQuiz {
  questions: AdminQuizQuestion[];
  passingScore: number;
}

export interface AdminScheme {
  _id: string;
  name: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  requiredDocuments: string[];
  applicationProcess: string[];
  matchPercentage: number;
  category: string;
  deadline?: string;
  officialWebsite?: string;
  targetGroup?: string;
  stateAvailability?: string[];
  lastVerified?: string;
  isVerified: boolean;
  isActive: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProduct {
  _id: string;
  userId: AdminUser | string;
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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminBuyer {
  _id: string;
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
  _id: string;
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
  _id: string;
  userId: AdminUser;
  schemeId: AdminScheme;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  _id: string;
  adminId: AdminUser;
  action: 'create' | 'read' | 'update' | 'delete' | 'suspend' | 'activate' | 'verify' | 'moderate';
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
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
  state?: string;
  district?: string;
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
  difficulty?: string;
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
  category?: string;
  status?: string;
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

export interface AIGenerationStats {
  totalRequests: number;
  totalFailures: number;
  successRate: number;
  popularTopics: Array<{ topic: string; count: number }>;
  popularOpportunities: Array<Record<string, unknown>>;
  popularLearning: Array<Record<string, unknown>>;
}
