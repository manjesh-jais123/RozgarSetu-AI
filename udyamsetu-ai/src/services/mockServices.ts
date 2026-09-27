import { mockUser, mockOpportunities, mockLearningPaths, mockSchemes, mockProducts, mockBuyers, mockBusinessPlan, mockRecommendations } from '../data/mockData';
import type { User, Opportunity, LearningPath, Scheme, Product, Buyer, BusinessPlan, AIRecommendation } from '../types';
import { sleep } from '../utils/helpers';

const DELAY = 500;

const FIRST_NAMES = [
  'Ramesh', 'Sita', 'Ram', 'Gita', 'Mohan', 'Priya', 'Ravi', 'Sunita',
  'Amit', 'Kavita', 'Sanjay', 'Meera', 'Rajesh', 'Pooja', 'Dinesh', 'Rekha',
  'Manoj', 'Sarita', 'Vikash', 'Neha', 'Anil', 'Tina', 'Ashok', 'Kiran',
  'Arun', 'Maya', 'Sunil', 'Nandini', 'Ravindra', 'Shanti', 'Yogesh', 'Madhu',
];
const LAST_NAMES = [
  'Sharma', 'Verma', 'Yadav', 'Singh', 'Kumar', 'Gupta', 'Mishra', 'Pandey',
  'Dubey', 'Thakur', 'Chauhan', 'Rajput', 'Tiwari', 'Shah', 'Patel', 'Rao',
  'Khan', 'Jaiswal', 'Maheshwari', 'Saxena', 'Yadav', 'Choudhary', 'Halder',
  'Bose', 'Desai', 'Jain', 'Mehta', 'Sood', 'Kapoor', 'Chatterjee',
];

function nameFromPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '').slice(-8);
  if (!digits) return mockUser.name;
  const seed = parseInt(digits, 10);
  const firstIdx = seed % FIRST_NAMES.length;
  const lastIdx = Math.floor(seed / FIRST_NAMES.length) % LAST_NAMES.length;
  return `${FIRST_NAMES[firstIdx]} ${LAST_NAMES[lastIdx]}`;
}

export const authService = {
  async login(phone: string): Promise<{ success: boolean; message: string }> {
    await sleep(DELAY);
    if (!phone || phone.length < 10) {
      throw new Error('Invalid phone number');
    }
    return { success: true, message: 'OTP sent to your phone' };
  },

  async verifyOtp(phone: string, otp: string): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    await sleep(DELAY);
    void otp;
    const storedName = localStorage.getItem(`phone_${phone}_name`) || localStorage.getItem('user_name');
    const displayName = storedName || nameFromPhone(phone);
    const user: User = {
      ...mockUser,
      id: `user-${Date.now()}`,
      name: displayName,
      phone,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
    };
    return {
      user,
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
    };
  },

  async register(data: { name: string; phone: string; language: string }): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    await sleep(DELAY);
    localStorage.setItem('user_name', data.name);
    localStorage.setItem('user_phone', data.phone);
    localStorage.setItem(`phone_${data.phone}_name`, data.name);
    const newUser: User = {
      ...mockUser,
      id: `user-${Date.now()}`,
      name: data.name,
      phone: data.phone,
      language: data.language as 'hi' | 'en',
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
    };
    return {
      user: newUser,
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
    };
  },

  async getMe(): Promise<User> {
    await sleep(DELAY);
    const storedName = localStorage.getItem('user_name');
    const storedPhone = localStorage.getItem('user_phone');
    if (storedName || storedPhone) {
      return { ...mockUser, name: storedName || mockUser.name, phone: storedPhone || mockUser.phone, onboardingCompleted: true };
    }
    return mockUser;
  },

  async logout(): Promise<void> {
    await sleep(200);
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_phone');
  },
};

export const profileService = {
  async getProfile(): Promise<User> {
    await sleep(DELAY);
    const storedName = localStorage.getItem('user_name');
    if (storedName) return { ...mockUser, name: storedName };
    return mockUser;
  },

  async updateBasicInfo(data: Partial<User['profile']>): Promise<User> {
    await sleep(DELAY);
    return { ...mockUser, profile: { ...mockUser.profile, ...data } };
  },

  async updateSkills(skills: User['profile']['skills']): Promise<User> {
    await sleep(DELAY);
    return { ...mockUser, profile: { ...mockUser.profile, skills } };
  },

  async updateInterests(interests: User['profile']['interests']): Promise<User> {
    await sleep(DELAY);
    return { ...mockUser, profile: { ...mockUser.profile, interests } };
  },

  async updateFinancialInfo(financialInfo: User['profile']['financialInfo']): Promise<User> {
    await sleep(DELAY);
    return { ...mockUser, profile: { ...mockUser.profile, financialInfo } };
  },

  async updateGoals(goals: User['profile']['goals']): Promise<User> {
    await sleep(DELAY);
    return { ...mockUser, profile: { ...mockUser.profile, goals } };
  },

  async completeOnboarding(): Promise<User> {
    await sleep(DELAY);
    return { ...mockUser, onboardingCompleted: true };
  },
};

export const opportunityService = {
  async getOpportunities(filters?: Record<string, unknown>): Promise<Opportunity[]> {
    await sleep(DELAY);
    let results = [...mockOpportunities];

    if (filters) {
      if (filters.budget) {
        const budget = Number(filters.budget);
        results = results.filter(o => o.requiredInvestment.min <= budget && o.requiredInvestment.max >= budget);
      }
      if (filters.difficulty) {
        results = results.filter(o => o.difficulty === filters.difficulty);
      }
      if (filters.category) {
        results = results.filter(o => o.category === filters.category);
      }
      if (filters.skill) {
        results = results.filter(o => o.requiredSkills.some(s => s.toLowerCase().includes(String(filters.skill).toLowerCase())));
      }
    }

    return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
  },

  async getOpportunity(id: string): Promise<Opportunity | null> {
    await sleep(DELAY);
    return mockOpportunities.find(o => o.id === id) || null;
  },

  async getRecommendedOpportunities(_userId: string): Promise<Opportunity[]> {
    await sleep(DELAY);
    return mockOpportunities
      .filter(o => o.matchPercentage > 70)
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 5);
  },

  async getCategories(): Promise<string[]> {
    await sleep(200);
    return [...new Set(mockOpportunities.map(o => o.category))];
  },
};

export const learningService = {
  async getLearningPaths(): Promise<LearningPath[]> {
    await sleep(DELAY);
    return mockLearningPaths;
  },

  async getLearningPath(id: string): Promise<LearningPath | null> {
    await sleep(DELAY);
    return mockLearningPaths.find(lp => lp.id === id) || null;
  },

  async getLesson(pathId: string, lessonId: string): Promise<LearningPath['lessons'][0] | null> {
    await sleep(DELAY);
    const path = mockLearningPaths.find(lp => lp.id === pathId);
    return path?.lessons.find(l => l.id === lessonId) || null;
  },

  async completeLesson(pathId: string, lessonId: string): Promise<{ success: boolean; nextLessonId?: string }> {
    await sleep(DELAY);
    const path = mockLearningPaths.find(lp => lp.id === pathId);
    const lessonIndex = path?.lessons.findIndex(l => l.id === lessonId) ?? -1;
    const nextLesson = path?.lessons[lessonIndex + 1];
    return { success: true, nextLessonId: nextLesson?.id };
  },

  async submitQuiz(pathId: string, lessonId: string, answers: number[]): Promise<{ score: number; passed: boolean; correctAnswers: number[] }> {
    await sleep(DELAY);
    const path = mockLearningPaths.find(lp => lp.id === pathId);
    const lesson = path?.lessons.find(l => l.id === lessonId);
    const quiz = lesson?.quiz;

    if (!quiz) throw new Error('No quiz for this lesson');

    let correct = 0;
    const correctAnswers = quiz.questions.map(q => q.correctAnswer);

    answers.forEach((answer, index) => {
      if (answer === correctAnswers[index]) correct++;
    });

    const score = Math.round((correct / quiz.questions.length) * 100);
    return { score, passed: score >= quiz.passingScore, correctAnswers };
  },

  async getProgress(_userId: string): Promise<Record<string, number>> {
    await sleep(DELAY);
    const progress: Record<string, number> = {};
    mockLearningPaths.forEach(lp => {
      progress[lp.id] = lp.progress;
    });
    return progress;
  },

  async getRecommendedPaths(_userId: string): Promise<LearningPath[]> {
    await sleep(DELAY);
    return mockLearningPaths.slice(0, 3);
  },
};

export const schemeService = {
  async getSchemes(): Promise<Scheme[]> {
    await sleep(DELAY);
    return mockSchemes;
  },

  async getScheme(id: string): Promise<Scheme | null> {
    await sleep(DELAY);
    return mockSchemes.find(s => s.id === id) || null;
  },

  async getRecommendedSchemes(_userId: string): Promise<Scheme[]> {
    await sleep(DELAY);
    return mockSchemes.sort((a, b) => b.matchPercentage - a.matchPercentage);
  },

  async checkEligibility(_schemeId: string, _userId: string): Promise<{ eligible: boolean; reasons: string[] }> {
    await sleep(DELAY);
    return { eligible: true, reasons: ['Matches your profile', 'Location eligible', 'Business category matches'] };
  },
};

export const productService = {
  async getProducts(): Promise<Product[]> {
    await sleep(DELAY);
    return mockProducts;
  },

  async getProduct(id: string): Promise<Product | null> {
    await sleep(DELAY);
    return mockProducts.find(p => p.id === id) || null;
  },

  async createProduct(data: Omit<Product, 'id'>): Promise<Product> {
    await sleep(DELAY);
    return { ...data, id: `prod-${Date.now()}` };
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    await sleep(DELAY);
    const product = mockProducts.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    return { ...product, ...data };
  },

  async deleteProduct(_id: string): Promise<void> {
    await sleep(DELAY);
  },
};

export const marketService = {
  async getBuyers(filters?: Record<string, unknown>): Promise<Buyer[]> {
    await sleep(DELAY);
    let results = [...mockBuyers];

    if (filters) {
      if (filters.type) {
        results = results.filter(b => b.type === filters.type);
      }
      if (filters.product) {
        const product = String(filters.product).toLowerCase();
        results = results.filter(b => b.requiredProduct.toLowerCase().includes(product));
      }
    }

    return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
  },

  async getBuyer(id: string): Promise<Buyer | null> {
    await sleep(DELAY);
    return mockBuyers.find(b => b.id === id) || null;
  },

  async connectWithBuyer(_buyerId: string, _userId: string, _message: string): Promise<{ success: boolean; connectionId: string }> {
    await sleep(DELAY);
    return { success: true, connectionId: `conn-${Date.now()}` };
  },

  async submitRfq(_data: { productId: string; quantity: number; message: string }): Promise<{ success: boolean; rfqId: string }> {
    await sleep(DELAY);
    return { success: true, rfqId: `rfq-${Date.now()}` };
  },
};

export const businessService = {
  async getBusinessPlan(_userId: string): Promise<BusinessPlan | null> {
    await sleep(DELAY);
    return mockBusinessPlan;
  },

  async createBusinessPlan(data: Omit<BusinessPlan, 'id' | 'status'>): Promise<BusinessPlan> {
    await sleep(DELAY);
    return { ...data, id: `bp-${Date.now()}`, status: 'draft' };
  },

  async updateBusinessPlan(id: string, data: Partial<BusinessPlan>): Promise<BusinessPlan> {
    await sleep(DELAY);
    return { ...mockBusinessPlan, ...data };
  },

  async getDashboard(_userId: string): Promise<Record<string, unknown>> {
    await sleep(DELAY);
    return {
      readinessScore: 72,
      opportunitiesExplored: 5,
      learningProgress: 35,
      fundingMatched: 3,
      productsListed: 2,
      buyersConnected: 1,
    };
  },
};

export const aiService = {
  async getRecommendations(_userId: string): Promise<AIRecommendation[]> {
    await sleep(DELAY);
    return mockRecommendations;
  },

  async chat(_message: string, _context?: Record<string, unknown>): Promise<{ response: string; suggestions?: string[] }> {
    await sleep(1000);
    const responses = [
      'Based on your profile, I recommend starting with custom tailoring as you have 3 years experience.',
      'For funding, PM Mudra Yojana is perfect for your investment needs.',
      'Your next learning step should be Lesson 3: Equipment Setup for candle making.',
      'I found a buyer in Lucknow looking for embroidered cushion covers - matches your products!',
    ];
    return {
      response: responses[Math.floor(Math.random() * responses.length)],
      suggestions: ['View opportunity', 'Check funding', 'Continue learning', 'Connect with buyer'],
    };
  },

  async explain(topic: string, language: 'hi' | 'en', style: 'simple' | 'example' | 'village'): Promise<string> {
    await sleep(800);
    const explanations: Record<string, Record<string, string>> = {
      'candle making': {
        hi: 'मोमबत्ती बनाना बहुत आसान है। आप मोम पिघलाते हैं, खुशबू डालते हैं, और साँचे में ढाल देते हैं।',
        en: 'Candle making is simple. You melt wax, add fragrance, and pour into molds.',
        simple: 'Think of it like making jelly - melt, mix, pour, set.',
        example: 'Like making ghee - heat butter, strain, cool in jar.',
        village: 'गाँव में जैसे दीया बनाते हैं वैसे - मोम गरम करो, बाती डालो, साँचे में डालो।',
      },
      'pricing': {
        hi: 'कीमत तय करने के लिए - खर्च जोड़ो, मुनाफा जोड़ो, बाजार देखो।',
        en: 'For pricing - add costs, add profit, check market rates.',
        simple: 'Cost + Profit = Price. Then check what others charge.',
        example: 'If candle costs ₹50 to make, sell at ₹100 for 100% profit.',
        village: 'जैसे सब्जी बेचते हैं - लागत ₹20, बेचते हैं ₹40। वही हिसाब।',
      },
    };

    const topicLower = topic.toLowerCase();
    const matchedTopic = Object.keys(explanations).find(t => topicLower.includes(t)) || 'candle making';
    const explanation = explanations[matchedTopic];

    if (language === 'hi') return explanation.hi;
    if (style === 'simple') return explanation.simple;
    if (style === 'example') return explanation.example;
    if (style === 'village') return explanation.village;
    return explanation.en;
  },

  async getRoadmap(_userId: string): Promise<{ currentStep: string; nextAction: string; steps: Array<{ id: string; label: string; completed: boolean }> }> {
    await sleep(DELAY);
    return {
      currentStep: 'learn',
      nextAction: 'Complete Lesson 3 and score at least 70% in the assessment.',
      steps: [
        { id: 'interest', label: 'Interest', completed: true },
        { id: 'learn', label: 'Learn', completed: false },
        { id: 'practice', label: 'Practice', completed: false },
        { id: 'assess', label: 'Assess', completed: false },
        { id: 'plan', label: 'Plan', completed: false },
        { id: 'fund', label: 'Fund', completed: false },
        { id: 'sell', label: 'Sell', completed: false },
        { id: 'grow', label: 'Grow', completed: false },
      ],
    };
  },
};