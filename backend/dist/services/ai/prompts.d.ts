export interface UserProfile {
    name: string;
    phone?: string;
    age?: number;
    gender?: string;
    location?: {
        state: string;
        district: string;
        village?: string;
        pincode?: string;
    };
    education?: string;
    skills?: Array<{
        name: string;
        category: string;
        proficiency: string;
        yearsExperience: number;
    }>;
    interests?: Array<{
        name: string;
        category: string;
    }>;
    businessInterest?: Array<{
        name: string;
        category: string;
        description: string;
    }>;
    financialInfo?: {
        availableCapital: number;
        expectedIncome: number;
        currentIncome: number;
        investmentCapacity: number;
    };
    goals?: Array<{
        id?: string;
        name: string;
        description: string;
        category: 'learn' | 'start' | 'grow' | 'customers' | 'funding';
    }>;
    language?: 'hi' | 'en';
}
export interface LivelihoodFingerprint {
    skillStrengths: string[];
    skillGaps: string[];
    businessReadiness: 'not_ready' | 'basic' | 'ready' | 'advanced';
    learningReadiness: 'not_ready' | 'basic' | 'ready' | 'advanced';
    opportunityCategories: string[];
    recommendedNextSteps: string[];
}
export interface Opportunity {
    title: string;
    description: string;
    whySuitable: string;
    requiredSkills: string[];
    estimatedInvestment: {
        min: number;
        max: number;
        currency: 'INR';
    };
    learningRequirements: string[];
    customerSegments: string[];
    incomeScenarios: {
        conservative: number;
        expected: number;
        optimistic: number;
        currency: 'INR';
        period: 'monthly' | 'yearly';
    };
    risks: string[];
    nextSteps: string[];
}
export interface LearningPath {
    title: string;
    description: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedDuration: string;
    lessons: Array<{
        title: string;
        description: string;
        content: string;
        keyPoints: string[];
        quiz?: {
            questions: Array<{
                question: string;
                options: string[];
                correctAnswer: number;
                explanation?: string;
            }>;
            passingScore: number;
        };
    }>;
}
export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
}
export interface AssessmentResult {
    score: number;
    passed: boolean;
    correctAnswers: number;
    totalQuestions: number;
    weakAreas: string[];
    recommendations: string[];
}
export interface BusinessPlan {
    idea: string;
    targetCustomer: string;
    investment: {
        required: number;
        breakdown: Record<string, number>;
    };
    rawMaterials: string[];
    equipment: string[];
    operatingCost: number;
    pricingStrategy: {
        costPrice: number;
        sellingPrice: number;
        margin: number;
        wholesalePrice?: number;
    };
    marketingPlan: string[];
    salesChannels: string[];
    risks: Array<{
        risk: string;
        mitigation: string;
    }>;
    milestones: Array<{
        milestone: string;
        timeline: string;
        successMetric: string;
    }>;
    nextActions: string[];
}
export interface ProductAnalysis {
    name: string;
    description: string;
    category: string;
    tags: string[];
    materials: string[];
    dimensions: string;
    priceSuggestion: number;
    moq: number;
    capacity: number;
    productStory: string;
    hindiDescription: string;
    englishDescription: string;
}
export interface ProductPassport {
    productName: string;
    maker: string;
    materials: string[];
    productionMethod: string;
    location: string;
    craftStory: string;
    dimensions: string;
    price: number;
    productionCapacity: number;
}
export interface BuyerMatch {
    buyerId: string;
    score: number;
    whyMatched: string[];
    matchFactors: Record<string, number>;
}
export interface DailyMission {
    primary: {
        task: string;
        reason: string;
        estimatedTime: string;
    };
    secondary: string[];
}
export interface ExplanationOptions {
    topic: string;
    language: 'hi' | 'en';
    style: 'simple' | 'example' | 'village';
    learningLevel: 'beginner' | 'intermediate' | 'advanced';
}
export interface ExplainContext {
    topic: string;
    language: 'hi' | 'en';
    style: 'simple' | 'example' | 'village';
    learningLevel: 'beginner' | 'intermediate' | 'advanced';
}
export interface AIResponse {
    success: boolean;
    data: unknown;
    error?: {
        code: string;
        message: string;
    };
}
export interface AIResponseType {
    response: string;
    suggestions?: string[];
}
export interface GrowthRecommendation {
    primaryAction: string;
    reason: string;
    estimatedTime: string;
    potentialImpact: 'low' | 'medium' | 'high';
    secondaryActions: string[];
}
export interface SchemeMatch {
    schemeId: string;
    schemeName?: string;
    matchScore: number;
    eligibilityFactors: string[];
    whyMatched: string;
    missingRequirements: string[];
    officialSource: string;
    lastVerified: string;
}
export interface IncomeSimulation {
    opportunity: string;
    initialInvestment: number;
    breakEvenMonths: number;
    scenarios: {
        conservative: {
            monthly: number;
            yearly: number;
            summary: string;
        };
        expected: {
            monthly: number;
            yearly: number;
            summary: string;
        };
        optimistic: {
            monthly: number;
            yearly: number;
            summary: string;
        };
    };
    monthlyProjections: {
        year1: Array<{
            month: number;
            conservative: number;
            expected: number;
            optimistic: number;
        }>;
        year2: Array<{
            month: number;
            conservative: number;
            expected: number;
            optimistic: number;
        }>;
        year3: Array<{
            month: number;
            conservative: number;
            expected: number;
            optimistic: number;
        }>;
    };
    milestones: Array<{
        month: number;
        milestone: string;
        amount: number;
    }>;
    disclaimer: string;
}
export interface VoiceTranscription {
    text: string;
    language: string;
    confidence: number;
    segments: Array<{
        start: number;
        end: number;
        text: string;
    }>;
    isMock?: boolean;
}
export interface VoiceSynthesis {
    audioData: Buffer;
    mimeType: string;
    language: string;
    voice: string;
    isMock?: boolean;
}
export interface SchemeRecord {
    _id: string;
    name: string;
    description: string;
    eligibility: string[];
    benefits: string[];
    requiredDocuments: string[];
    applicationProcess: string[];
    matchPercentage: number;
    category: string;
    deadline?: Date;
    officialWebsite?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastVerified?: string;
    source?: string;
}
export declare const PROMPTS: {
    LIVELIHOOD_FINGERPRINT: (profile: UserProfile) => string;
    OPPORTUNITY_RECOMMENDATION: (query: string, profile: UserProfile) => string;
    LEARNING_PLAN: (topic: string, profile: UserProfile, level: "beginner" | "intermediate" | "advanced") => string;
    LESSON_EXPLANATION: (topic: string, profile: UserProfile, options: ExplanationOptions) => string;
    BUSINESS_PLAN: (idea: string, profile: UserProfile) => string;
    BUYER_MATCHING: (profile: UserProfile, productInfo?: string) => string;
    GROWTH_RECOMMENDATION: (profile: UserProfile, context: Record<string, unknown>) => string;
    DAILY_MISSION: (profile: UserProfile, context: Record<string, unknown>) => string;
    PRODUCT_ANALYSIS: (description: string, profile: UserProfile) => string;
    PRODUCT_PASSPORT: (product: Record<string, unknown>, profile: UserProfile) => string;
    QUIZ_GENERATION: (topic: string, count: number, level: "beginner" | "intermediate" | "advanced") => string;
    ASSESSMENT_ANALYSIS: (answers: number[], questions: QuizQuestion[]) => string;
    SCHEME_MATCHING: (profile: UserProfile, schemes: string[]) => string;
    CHAT_RESPONSE: (profile: UserProfile, message: string, context?: Record<string, unknown>) => string;
    RECOMMEND_SKILLS: (profile: UserProfile) => string;
    INCOME_SIMULATION: (opportunity: string, investment: number) => string;
    VOICE_TRANSCRIPTION_PROMPT: string;
};
//# sourceMappingURL=prompts.d.ts.map