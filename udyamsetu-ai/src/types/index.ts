export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  language: 'hi' | 'en';
  avatar?: string;
  location: {
    state: string;
    district: string;
    village?: string;
    pincode?: string;
  };
  profile: UserProfile;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface UserProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  education: string;
  workExperience: string;
  skills: Skill[];
  interests: Interest[];
  businessInterest: BusinessInterest[];
  financialInfo: FinancialInfo;
  goals: Goal[];
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced';
  yearsExperience: number;
}

export interface Interest {
  id: string;
  name: string;
  category: string;
}

export interface BusinessInterest {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface FinancialInfo {
  availableCapital: number;
  expectedIncome: number;
  currentIncome: number;
  investmentCapacity: number;
}

export interface Goal {
  id: string;
  name: string;
  description: string;
  category: 'learn' | 'start' | 'grow' | 'customers' | 'funding';
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  requiredInvestment: {
    min: number;
    max: number;
  };
  requiredSkills: string[];
  learningDuration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  incomeScenarios: IncomeScenarios;
  customerSegments: string[];
  location?: string;
  matchPercentage: number;
  tags: string[];
}

export interface IncomeScenarios {
  conservative: number;
  expected: number;
  optimistic: number;
  currency: 'INR';
  period: 'monthly' | 'yearly';
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: string;
  lessons: Lesson[];
  progress: number;
  thumbnail?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  order: number;
  completed: boolean;
  keyPoints: string[];
  quiz?: Quiz;
}

export interface Quiz {
  id: string;
  questions: QuizQuestion[];
  passingScore: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Scheme {
  id: string;
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
}

export interface Product {
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
}

export interface Buyer {
  id: string;
  name: string;
  type: 'individual' | 'business' | 'wholesaler' | 'retailer' | 'exporter';
  location: string;
  requiredProduct: string;
  quantity: number;
  budget: number;
  matchPercentage: number;
  contactInfo?: ContactInfo;
  verified: boolean;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  address?: string;
}

export interface BusinessPlan {
  id: string;
  idea: string;
  requiredInvestment: number;
  rawMaterials: string[];
  equipment: string[];
  operatingCost: number;
  pricingStrategy: PricingStrategy;
  customerSegments: string[];
  marketingPlan: string[];
  riskFactors: string[];
  nextActions: string[];
  status: 'draft' | 'in-progress' | 'completed';
}

export interface PricingStrategy {
  costPrice: number;
  sellingPrice: number;
  margin: number;
  wholesalePrice?: number;
}

export interface AIRecommendation {
  id: string;
  type: 'opportunity' | 'learning' | 'scheme' | 'buyer' | 'product';
  title: string;
  description: string;
  reason: string;
  confidence: number;
  actionLabel: string;
  actionRoute: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}