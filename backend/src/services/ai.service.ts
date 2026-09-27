import { config } from '../config';
import { logger } from '../utils/logger';
import { Scheme } from '../models';
import { LLMProvider, LLMProviderFactory, LLMOptions, LLMResponse } from './ai/llmProviders';
import { PROMPTS } from './ai/prompts';
import { voiceService } from './voice/types';
import {
  UserProfile,
  LivelihoodFingerprint,
  Opportunity,
  LearningPath,
  QuizQuestion,
  AssessmentResult,
  BusinessPlan,
  ProductAnalysis,
  ProductPassport,
  BuyerMatch,
  DailyMission,
  GrowthRecommendation,
  SchemeMatch,
  IncomeSimulation,
  VoiceTranscription,
  VoiceSynthesis,
  AIResponseType,
  ExplainContext,
} from './ai/prompts';

// ---------------------------------------------------------------------------
// JSON-safe fallback helpers
// ---------------------------------------------------------------------------
function safeJSONParse<T>(content: string): T | null {
  const cleaned = content
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}

function logAIUsage(method: string, result: LLMResponse) {
  if (result.usage) {
    logger.info(
      {
        method,
        promptTokens: result.usage.promptTokens,
        completionTokens: result.usage.completionTokens,
      },
      'AI usage logged'
    );
  }
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------
class AIService {
  private provider: LLMProvider;
  private useMock: boolean;

  constructor() {
    this.useMock = config.llm.useMock;
    this.provider = LLMProviderFactory.create();
    logger.info(`AIService initialized — mock=${this.useMock}`);
  }

  getProvider(): LLMProvider {
    return this.provider;
  }

  // ── Helper: build a UserProfile from raw fields ──────────────────────
  toUserProfile(
    user: Record<string, unknown>,
    profile?: Record<string, unknown>,
    location?: Record<string, unknown>
  ): UserProfile {
    return {
      name: (user.name as string) || 'Unknown',
      phone: (user.phone as string) || '',
      age: (profile?.age as number | undefined),
      gender: (profile?.gender as 'male' | 'female' | 'other' | undefined),
      location: location as UserProfile['location'],
      education: (profile?.education as string | undefined),
      skills: (profile?.skills as UserProfile['skills']) || [],
      interests: (profile?.interests as UserProfile['interests']) || [],
      businessInterest: (profile?.businessInterest as UserProfile['businessInterest']) || [],
      financialInfo: profile?.financialInfo as UserProfile['financialInfo'] | undefined,
      goals: (profile?.goals as UserProfile['goals']) || [],
      language: (user.language as 'hi' | 'en') || 'hi',
    };
  }

  // ── 1. generateLivelihoodAssessment ─────────────────────────────────
  async generateLivelihoodAssessment(profile: UserProfile): Promise<LivelihoodFingerprint> {
    const key = 'livelihoodAssessment';
    if (this.useMock) {
      return this.getMock(key, this.buildMockFingerprint(profile));
    }

    const prompt = PROMPTS.LIVELIHOOD_FINGERPRINT(profile);
    try {
      const result = await this.provider.generateJSON<LivelihoodFingerprint>(prompt, { temperature: 0.3 });
      return result;
    } catch (error) {
      logger.warn({ error }, 'generateLivelihoodAssessment failed, returning mock');
      return this.buildMockFingerprint(profile);
    }
  }

  // ── 2. generateLivelihoodFingerprint (alias) ──────────────────────────
  async generateLivelihoodFingerprint(profile: UserProfile): Promise<LivelihoodFingerprint> {
    return this.generateLivelihoodAssessment(profile);
  }

  // ── 3. recommendSkills ────────────────────────────────────────────────
  async recommendSkills(profile: UserProfile): Promise<string[]> {
    if (this.useMock) {
      return [
        'Basic digital payments',
        'Accounting basics',
        'Customer service',
        'Product photography',
        'Social media marketing',
      ];
    }

    const prompt = PROMPTS.RECOMMEND_SKILLS(profile);
    try {
      const result = await this.provider.generateText(prompt, { temperature: 0.5 });
      logAIUsage('recommendSkills', result);
      const parsed = safeJSONParse<string[]>(result.content);
      return parsed ?? [
        'Basic digital payments',
        'Accounting basics',
        'Customer service',
      ];
    } catch {
      return ['Basic digital payments', 'Accounting basics', 'Customer service'];
    }
  }

  // ── 4. discoverBusinessOpportunities ────────────────────────────────
  async discoverBusinessOpportunities(query: string, profile: UserProfile): Promise<Opportunity[]> {
    if (this.useMock) {
      return this.buildMockOpportunities(profile);
    }

    const prompt = PROMPTS.OPPORTUNITY_RECOMMENDATION(query, profile);
    try {
      const result = await this.provider.generateJSON<Opportunity[]>(prompt, {
        temperature: 0.5,
        maxTokens: 4000,
      });
      return result;
    } catch (error) {
      logger.warn({ error }, 'discoverBusinessOpportunities failed, returning mock');
      return this.buildMockOpportunities(profile);
    }
  }

  // --- 5. simulateIncomePaths ----------------------------------
  async simulateIncomePaths(opportunity: string, investment: number): Promise<IncomeSimulation> {
    if (this.useMock) {
      return this.buildMockIncomeSimulation(opportunity, investment);
    }

    const prompt = PROMPTS.INCOME_SIMULATION(opportunity, investment);
    try {
      const result = await this.provider.generateJSON<IncomeSimulation>(prompt, {
        temperature: 0.3,
        maxTokens: 3000,
      });
      return result;
    } catch (error) {
      logger.warn({ error }, 'simulateIncomePaths failed, returning mock');
      return this.buildMockIncomeSimulation(opportunity, investment);
    }
  }

  // ── 6. generateLearningPlan ─────────────────────────────────────────
  async generateLearningPlan(
    topic: string,
    profile: UserProfile,
    level: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
  ): Promise<LearningPath> {
    if (this.useMock) {
      return this.buildMockLearningPath(topic, profile, level);
    }

    const prompt = PROMPTS.LEARNING_PLAN(topic, profile, level);
    try {
      const result = await this.provider.generateJSON<LearningPath>(prompt, {
        temperature: 0.5,
        maxTokens: 4000,
      });
      return result;
    } catch (error) {
      logger.warn({ error }, 'generateLearningPlan failed, returning mock');
      return this.buildMockLearningPath(topic, profile, level);
    }
  }

  // ── 7. generateLessonExplanation ────────────────────────────────────
  async generateLessonExplanation(
    topic: string,
    profile: UserProfile,
    options: ExplainContext
  ): Promise<string> {
    if (this.useMock) {
      return this.buildMockExplanation(topic, profile, options);
    }

    const prompt = PROMPTS.LESSON_EXPLANATION(topic, profile, {
      topic,
      language: profile.language || 'hi',
      style: options.style,
      learningLevel: options.learningLevel,
    });
    try {
      const result = await this.provider.generateText(prompt, { temperature: 0.4 });
      logAIUsage('generateLessonExplanation', result);
      return result.content;
    } catch (error) {
      logger.warn({ error }, 'generateLessonExplanation failed, returning mock');
      return this.buildMockExplanation(topic, profile, options);
    }
  }

  // ── 8. generateQuiz ─────────────────────────────────────────────────
  async generateQuiz(
    topic: string,
    count: number,
    level: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
  ): Promise<QuizQuestion[]> {
    if (this.useMock) {
      return this.buildMockQuiz(topic, count, level);
    }

    const prompt = PROMPTS.QUIZ_GENERATION(topic, count, level);
    try {
      const result = await this.provider.generateText(prompt, { temperature: 0.3 });
      logAIUsage('generateQuiz', result);
      const parsed = safeJSONParse<QuizQuestion[]>(result.content);
      return parsed ?? this.buildMockQuiz(topic, count, level);
    } catch {
      return this.buildMockQuiz(topic, count, level);
    }
  }

  // ── 9. analyzeAssessment ────────────────────────────────────────────
  async analyzeAssessment(answers: number[], questions: QuizQuestion[]): Promise<AssessmentResult> {
    if (this.useMock) {
      return this.buildMockAssessment(answers, questions);
    }

    const prompt = PROMPTS.ASSESSMENT_ANALYSIS(answers, questions);
    try {
      const result = await this.provider.generateJSON<AssessmentResult>(prompt, { temperature: 0.3 });
      return result;
    } catch (error) {
      logger.warn({ error }, 'analyzeAssessment failed, returning mock');
      return this.buildMockAssessment(answers, questions);
    }
  }

  // ── 10. generateBusinessPlan ────────────────────────────────────────
  async generateBusinessPlan(idea: string, profile: UserProfile): Promise<BusinessPlan> {
    if (this.useMock) {
      return this.buildMockBusinessPlan(idea, profile);
    }

    const prompt = PROMPTS.BUSINESS_PLAN(idea, profile);
    try {
      const result = await this.provider.generateJSON<BusinessPlan>(prompt, {
        temperature: 0.3,
        maxTokens: 4000,
      });
      return result;
    } catch (error) {
      logger.warn({ error }, 'generateBusinessPlan failed, returning mock');
      return this.buildMockBusinessPlan(idea, profile);
    }
  }

  // ── 11. matchGovernmentSchemes ──────────────────────────────────────
  async matchGovernmentSchemes(
    profile: UserProfile,
    schemes: Array<{
      _id: string;
      name: string;
      description: string;
      eligibility: string[];
      category: string;
      officialWebsite?: string;
      lastVerified?: string;
    }>
  ): Promise<SchemeMatch[]> {
    const useMock = this.useMock || schemes.length === 0;
    if (useMock) {
      return this.buildMockSchemeMatches(profile, schemes);
    }

    const schemeList = schemes.map((s) => s.name);
    const prompt = PROMPTS.SCHEME_MATCHING(profile, schemeList);
    try {
      const rawMatches = await this.provider.generateJSON<SchemeMatch[]>(prompt, { temperature: 0.3 });
      return rawMatches.map((m, idx) => ({
        ...m,
        schemeId: schemes[idx]?._id || m.schemeId,
        schemeName: schemes[idx]?.name || '',
        officialSource: schemes[idx]?.officialWebsite || m.officialSource || '',
        lastVerified: schemes[idx]?.lastVerified || m.lastVerified || new Date().toISOString().split('T')[0],
      }));
    } catch (error) {
      logger.warn({ error }, 'matchGovernmentSchemes failed, returning mock');
      return this.buildMockSchemeMatches(profile, schemes);
    }
  }

  // ── 12. analyzeProduct ──────────────────────────────────────────────
  async analyzeProduct(description: string, profile: UserProfile): Promise<ProductAnalysis> {
    if (this.useMock) {
      return this.buildMockProductAnalysis(description, profile);
    }

    const prompt = PROMPTS.PRODUCT_ANALYSIS(description, profile);
    try {
      const result = await this.provider.generateJSON<ProductAnalysis>(prompt, {
        temperature: 0.5,
        maxTokens: 3000,
      });
      return result;
    } catch (error) {
      logger.warn({ error }, 'analyzeProduct failed, returning mock');
      return this.buildMockProductAnalysis(description, profile);
    }
  }

  // ── 13. generateProductCatalog ──────────────────────────────────────
  async generateProductCatalog(productIdeas: string[], profile: UserProfile): Promise<ProductAnalysis[]> {
    const results: ProductAnalysis[] = [];
    for (const idea of productIdeas) {
      const analysis = await this.analyzeProduct(idea, profile);
      results.push(analysis);
    }
    return results;
  }

  // ── 14. generateProductPassport ─────────────────────────────────────
  async generateProductPassport(product: Record<string, unknown>, profile: UserProfile): Promise<ProductPassport> {
    if (this.useMock) {
      return this.buildMockProductPassport(product, profile);
    }

    const prompt = PROMPTS.PRODUCT_PASSPORT(product, profile);
    try {
      const result = await this.provider.generateJSON<ProductPassport>(prompt, { temperature: 0.4 });
      return result;
    } catch (error) {
      logger.warn({ error }, 'generateProductPassport failed, returning mock');
      return this.buildMockProductPassport(product, profile);
    }
  }

  // ── 15. matchBuyers ─────────────────────────────────────────────────
  async matchBuyers(profile: UserProfile, productInfo?: string): Promise<BuyerMatch[]> {
    if (this.useMock) {
      return this.buildMockBuyerMatches(profile, productInfo);
    }

    const prompt = PROMPTS.BUYER_MATCHING(profile, productInfo);
    try {
      const result = await this.provider.generateJSON<BuyerMatch[]>(prompt, { temperature: 0.5 });
      return result;
    } catch (error) {
      logger.warn({ error }, 'matchBuyers failed, returning mock');
      return this.buildMockBuyerMatches(profile, productInfo);
    }
  }

  // ── 16. generateGrowthRecommendation ────────────────────────────────
  async generateGrowthRecommendation(
    profile: UserProfile,
    context: Record<string, unknown>
  ): Promise<GrowthRecommendation> {
    if (this.useMock) {
      return this.buildMockGrowthRecommendation(profile, context);
    }

    const prompt = PROMPTS.GROWTH_RECOMMENDATION(profile, context);
    try {
      const result = await this.provider.generateJSON<GrowthRecommendation>(prompt, { temperature: 0.4 });
      return result;
    } catch (error) {
      logger.warn({ error }, 'generateGrowthRecommendation failed, returning mock');
      return this.buildMockGrowthRecommendation(profile, context);
    }
  }

  // ── 17. generateDailyMission ─────────────────────────────────────────
  async generateDailyMission(
    profile: UserProfile,
    context: Record<string, unknown>
  ): Promise<DailyMission> {
    if (this.useMock) {
      return this.buildMockDailyMission(profile, context);
    }

    const prompt = PROMPTS.DAILY_MISSION(profile, context);
    try {
      const result = await this.provider.generateJSON<DailyMission>(prompt, { temperature: 0.6 });
      return result;
    } catch (error) {
      logger.warn({ error }, 'generateDailyMission failed, returning mock');
      return this.buildMockDailyMission(profile, context);
    }
  }

  // ── 18. chat ────────────────────────────────────────────────────────
  async chat(
    profile: UserProfile,
    message: string,
    context?: Record<string, unknown>
  ): Promise<AIResponseType> {
    if (this.useMock) {
      return this.buildMockChat(profile, message);
    }

    const prompt = PROMPTS.CHAT_RESPONSE(profile, message, context);
    try {
      const result = await this.provider.generateText(prompt, { temperature: 0.7 });
      logAIUsage('chat', result);
      return { response: result.content, suggestions: ['View opportunity', 'Check funding', 'Continue learning', 'Connect with buyer'] };
    } catch (error) {
      logger.warn({ error }, 'chat failed, returning mock');
      return this.buildMockChat(profile, message);
    }
  }

  // ── 19. Voice: Speech-to-Text ───────────────────────────────────────
  async transcribeVoice(
    audioBuffer: Buffer,
    options: { language?: string; model?: string } = {}
  ): Promise<VoiceTranscription> {
    const language = options.language || 'en';

    if (this.useMock) {
      return {
        text: 'This is a mock transcription of your voice. The audio was received but no real speech-to-text service is configured.',
        language,
        confidence: 1.0,
        segments: [],
        isMock: true,
      };
    }

    try {
      const text = await voiceService.transcribe(audioBuffer, {
        language,
        model: (options.model as any) || 'latest_short',
      });

      return {
        text,
        language,
        confidence: 0.95,
        segments: [{ start: 0, end: audioBuffer.length / 16000, text }],
        isMock: false,
      };
    } catch (error: any) {
      logger.error({ error }, 'Voice transcription failed');
      throw error;
    }
  }

  // ── 20. Voice: Text-to-Speech ───────────────────────────────────────
  async synthesizeVoice(
    text: string,
    options: { language?: string; voice?: string; speed?: number } = {}
  ): Promise<VoiceSynthesis> {
    const language = options.language || 'en';

    if (this.useMock) {
      return {
        audioData: Buffer.from('mock-audio-data'),
        mimeType: 'audio/mp3',
        language,
        voice: options.voice || (language === 'hi' ? 'hi-IN' : 'en-IN'),
        isMock: true,
      };
    }

    try {
      const audioData = await voiceService.synthesize(text, {
        language,
        voice: options.voice,
        speed: options.speed,
      });

      return {
        audioData,
        mimeType: 'audio/mp3',
        language,
        voice: options.voice || 'default',
        isMock: false,
      };
    } catch (error: any) {
      logger.error({ error }, 'Voice synthesis failed');
      throw error;
    }
  }

  // ===================================================================
  // MOCK DATA BUILDERS
  // ===================================================================

  private getMock<T>(key: string, fallback: T): T {
    void key;
    return fallback;
  }

  private buildMockFingerprint(profile: UserProfile): LivelihoodFingerprint {
    const skills = profile.skills || [];
    const interests = profile.interests || [];
    const businessInterest = profile.businessInterest || [];
    const capital = profile.financialInfo?.availableCapital || 0;

    const skillStrengths = skills
      .filter((s) => s.proficiency === 'intermediate' || s.proficiency === 'advanced')
      .map((s) => s.name);

    const skillGaps = [
      'Digital payments & mobile banking',
      'Basic accounting',
      'Customer service & communication',
      'Product photography & content',
    ].slice(0, Math.max(1, 4 - skillStrengths.length));

    const opportunityCategories = interests.length > 0
      ? [...new Set([...interests.map((i) => i.category), ...businessInterest.map((b) => b.category)])]
      : ['Handicrafts', 'Food processing', 'Agriculture'];

    const recommendedNextSteps = [];
    if (skillGaps.length > 0) {
      recommendedNextSteps.push(`Learn: ${skillGaps[0]}`);
    }
    if (capital > 0 && capital < 5000) {
      recommendedNextSteps.push('Explore low-investment business ideas with ₹5000 or less');
    } else if (capital >= 5000) {
      recommendedNextSteps.push('Start a small business with your available capital');
    }
    recommendedNextSteps.push('Complete your profile to get personalized recommendations');

    return {
      skillStrengths,
      skillGaps,
      businessReadiness: capital >= 10000 ? 'basic' : 'not_ready',
      learningReadiness: skills.length > 0 ? 'basic' : 'not_ready',
      opportunityCategories,
      recommendedNextSteps,
    };
  }

  private buildMockOpportunities(profile: UserProfile): Opportunity[] {
    const capital = profile.financialInfo?.availableCapital || 0;
    const location = profile.location;

    const opportunities: Opportunity[] = [
      {
        title: 'Handmade Candle Business',
        description: 'Create and sell scented candles using natural wax and essential oils. Low startup cost with high potential in local markets and online.',
        whySuitable: `You have ₹${capital} capital available. Candle making requires minimal equipment and can be started from home.`,
        requiredSkills: ['Wax melting', 'Fragrance blending', 'Mold handling', 'Basic packaging'],
        estimatedInvestment: {
          min: Math.min(capital, 3000) || 2000,
          max: (capital || 5000) + 2000,
          currency: 'INR',
        },
        learningRequirements: ['Complete candle making course', 'Learn fragrance safety', 'Practice 5 candle batches'],
        customerSegments: ['Local gift shops', 'Online marketplaces', 'Wedding planners', 'Temple supplies'],
        incomeScenarios: {
          conservative: 5000,
          expected: 15000,
          optimistic: 30000,
          currency: 'INR',
          period: 'monthly',
        },
        risks: ['Seasonal demand fluctuations', 'Competition from established brands', 'Wax price volatility'],
        nextSteps: ['Take candle making course', 'Start with 10 candles to test market', 'Register on local online selling platform'],
      },
    ];

    if (capital >= 10000) {
      opportunities.push({
        title: 'Agarbatti (Incense Stick) Manufacturing',
        description: 'Manufacture natural incense sticks using traditional recipes and modern packaging. High demand in religious and wellness markets.',
        whySuitable: `With ₹${capital} capital, you can set up a small-scale incense stick manufacturing unit. This aligns with traditional crafts and has steady demand.`,
        requiredSkills: ['Incense mixing', 'Stick rolling', 'Drying techniques', 'Packaging'],
        estimatedInvestment: {
          min: 8000,
          max: Math.max(capital, 15000),
          currency: 'INR',
        },
        learningRequirements: ['Learn traditional incense recipes', 'Quality control training', 'Packaging design basics'],
        customerSegments: ['Religious shops', 'Temples', 'Wellness stores', 'Online spiritual retailers'],
        incomeScenarios: {
          conservative: 8000,
          expected: 20000,
          optimistic: 40000,
          currency: 'INR',
          period: 'monthly',
        },
        risks: ['Raw material quality variations', 'Competition from mass-produced brands', 'Storage requirements'],
        nextSteps: ['Source raw materials', 'Create sample products', 'Register with local religious suppliers'],
      });
    }

    if (location?.state) {
      opportunities.push({
        title: `Local ${location.district || ''} Artisan Products`,
        description: `${location.district || 'your district'} has rich artisanal traditions. Create and market local handcrafted products to tourists and online customers.`,
        whySuitable: `Your location in ${location.state} has strong artisan traditions. This builds on local skills and culture.`,
        requiredSkills: ['Craft skill development', 'Quality finishing', 'Product photography', 'Online marketing'],
        estimatedInvestment: {
          min: 3000,
          max: Math.max(capital, 8000),
          currency: 'INR',
        },
        learningRequirements: ['Improve craft finishing techniques', 'Learn basic product photography', 'Understand pricing'],
        customerSegments: ['Local tourists', 'Online shoppers', 'Gift shops', 'Cooperative societies'],
        incomeScenarios: {
          conservative: 6000,
          expected: 15000,
          optimistic: 28000,
          currency: 'INR',
          period: 'monthly',
        },
        risks: ['Seasonal tourism dependency', 'Skill acquisition time', 'Market access challenges'],
        nextSteps: ['Research local artisan products', 'Create samples', 'Visit local handicraft cooperatives'],
      });
    }

    return opportunities;
  }

  private buildMockIncomeSimulation(opportunity: string, investment: number): IncomeSimulation {
    const conservativeMonthly = Math.max(0, Math.floor(investment * 0.15));
    const expectedMonthly = Math.max(0, Math.floor(investment * 0.3));
    const optimisticMonthly = Math.max(0, Math.floor(investment * 0.5));

    return {
      opportunity,
      initialInvestment: investment,
      breakEvenMonths: Math.max(3, Math.ceil(investment / expectedMonthly)) || 6,
      scenarios: {
        conservative: {
          monthly: conservativeMonthly,
          yearly: conservativeMonthly * 12,
          summary: `Conservative estimate: ₹${conservativeMonthly}/month. Income may start low and grow over time.`,
        },
        expected: {
          monthly: expectedMonthly,
          yearly: expectedMonthly * 12,
          summary: `Expected estimate: ₹${expectedMonthly}/month after 3-6 months of operation.`,
        },
        optimistic: {
          monthly: optimisticMonthly,
          yearly: optimisticMonthly * 12,
          summary: `Optimistic estimate: ₹${optimisticMonthly}/month with strong market demand and effective marketing.`,
        },
      },
      monthlyProjections: {
        year1: Array.from({ length: 12 }, (_, i) => ({
          month: i + 1,
          conservative: Math.round(conservativeMonthly * (1 + i * 0.05)),
          expected: Math.round(expectedMonthly * (1 + i * 0.08)),
          optimistic: Math.round(optimisticMonthly * (1 + i * 0.1)),
        })),
        year2: Array.from({ length: 12 }, (_, i) => ({
          month: i + 1,
          conservative: Math.round(conservativeMonthly * 1.6 * (1 + i * 0.03)),
          expected: Math.round(expectedMonthly * 1.6 * (1 + i * 0.05)),
          optimistic: Math.round(optimisticMonthly * 1.6 * (1 + i * 0.07)),
        })),
        year3: Array.from({ length: 12 }, (_, i) => ({
          month: i + 1,
          conservative: Math.round(conservativeMonthly * 2 * (1 + i * 0.02)),
          expected: Math.round(expectedMonthly * 2 * (1 + i * 0.04)),
          optimistic: Math.round(optimisticMonthly * 2 * (1 + i * 0.05)),
        })),
      },
      milestones: [
        { month: 1, milestone: 'Set up workspace and source initial materials', amount: 0 },
        { month: 2, milestone: 'Create first products and find 5 initial customers', amount: Math.round(expectedMonthly * 0.3) },
        { month: 3, milestone: 'Break even point reached', amount: Math.round(expectedMonthly * 0.7) },
        { month: 6, milestone: 'Stable customer base established', amount: expectedMonthly },
        { month: 12, milestone: 'Business generating consistent profit', amount: Math.round(expectedMonthly * 1.5) },
      ],
      disclaimer: 'Income projections are estimates only and not guaranteed. Actual results depend on market conditions, effort, and execution.',
    };
  }

  private buildMockLearningPath(
    topic: string,
    profile: UserProfile,
    level: 'beginner' | 'intermediate' | 'advanced'
  ): LearningPath {
    const lang = profile.language || 'en';
    const isHindi = lang === 'hi';

    const modules = [
      {
        title: isHindi ? 'व्यवसाय के मूलभूत सिद्धांत' : 'Business Basics',
        description: isHindi
          ? `शुरुआती व्यवसाय के बुनियादी सिद्धांत सीखें. ${topic} के बारे में मूलभूत जानकारी.`
          : `Learn the fundamentals of starting a business. Introduction to ${topic}.`,
        content: isHindi
          ? `${topic} एक सफल व्यवसाय की दुनिया में आपका स्वागत है. एक व्यवसाय शुरू करने के लिए आपको समझना चाहिए कि ग्राहक क्या चाहिए.`
          : `Welcome to the world of ${topic} business. To start a business you need to understand what customers want.`,
        keyPoints: isHindi
          ? ['ग्राहक की जरूरत समझें', 'स्थानीय बाजार का अध्ययन करें', 'मूलभूत लागत गणना']
          : ['Understand customer needs', 'Study local market', 'Basic cost calculation'],
      },
      {
        title: isHindi ? 'कच्चे माल' : 'Raw Materials',
        description: isHindi
          ? `उपयोगी और सस्ते कच्चे माल की पहचान. ${topic} में कौन से कच्चे माल चाहिए.`
          : `Identify useful and affordable raw materials for ${topic}.`,
        content: isHindi
          ? `कच्चा माल आपके उत्पाद की गुणवत्ता तय करता है. स्थानीय सप्लायर से सहेज़ी लेना बेहतरीन रीती है.`
          : `Raw material determines product quality. Buying from local suppliers in bulk is a smart approach.`,
        keyPoints: isHindi
          ? ['स्थानीय सप्लायर ढूंढें', 'मूल्य-गुणवत्ता समझें', 'सट्टण में बचत']
          : ['Find local suppliers', 'Understand price-quality balance', 'Bulk purchasing savings'],
      },
      {
        title: isHindi ? 'उपकरण और उपक्रम' : 'Equipment',
        description: isHindi
          ? `${topic} के लिए आवश्यक सामान और उपकरण.`
          : `Tools and equipment needed for ${topic}.`,
        content: isHindi
          ? `शुरिशात में कम उपकरण से शुरू करें. जैसे-जैसे व्यवसाय बढ़ेगा, आप उन्नत उपकरण अपग्रेड कर सकते हैं.`
          : `Start with minimal equipment. As business grows, upgrade to advanced tools.`,
        keyPoints: isHindi
          ? ['कम से शुरुआत करें', 'गुणवत्व पर ध्यान दें', 'रखरखाव का ध्यान रखें']
          : ['Start small', 'Focus on quality', 'Regular maintenance'],
        },
      {
        title: isHindi ? 'निर्माण / उत्पादन' : 'Manufacturing',
        description: isHindi
          ? `व्यावसायिक रूप से ${topic} बनाने की प्रक्रिया.`
          : `The process of making ${topic} at scale.`,
        content: isHindi
          ? `हर चरण में समान विधि अपनाएं. एक ही समय में धीरे और स्थिर गति बनाए रखें.`
          : `Follow consistent methods at each step. Maintain steady pace and quality throughout.`,
        keyPoints: isHindi
          ? ['प्रक्रिया मानकीकरण', 'गुणवत्व नियंत्रण', 'कार्यक्षमता']
          : ['Standardize process', 'Quality control checks', 'Improve efficiency'],
      },
      {
        title: isHindi ? 'पैकेजिंग' : 'Packaging',
        description: isHindi
          ? `अपने ${topic} को आकर्षक और सुरक्षित पैकेज में बंद करें.`
          : `Package your ${topic} attractively and safely.`,
        content: isHindi
          ? `पैकेजिंग आपके ग्राहक के पहला नोटिस पाती है. इसे पेशेवर बनाने के लिए ध्यान दें.`
          : `Packaging is what customers notice first. Invest in professional-looking presentation.`,
        keyPoints: isHindi
          ? ['पेशेवर प्रस्तुति', 'सुरक्षा सुनिश्चित करें', 'लागत प्रबंधित करें']
          : ['Professional appearance', 'Ensure safety', 'Manage costs'],
      },
      {
        title: isHindi ? 'मूल्य निर्धारण' : 'Pricing',
        description: isHindi
          ? `अपने ${topic} की सही कीमत कैसे तय करें.`
          : `How to price your ${topic} correctly.`,
        content: isHindi
          ? `कीमत = कच्चा माल + श्रम + मुनाफा. अपने स्थानीय प्रतिद्वंद्वियों की तुलना करें.`
          : `Price = Raw material + Labor + Profit. Compare with local competitors.`,
        keyPoints: isHindi
          ? ['मुकाबलता करें', 'मार्जिन निर्धारित करें', 'बंधुभावनाओं के साथ मूल्य', 'लचीला रहें']
          : ['Competitive pricing', 'Set margins', 'Price with flexibility'],
      },
      {
        title: isHindi ? 'विपणन' : 'Marketing',
        description: isHindi
          ? `अपने ${topic} को ग्राहक तक पहुँचाएं.`
          : `Reach customers for your ${topic}.`,
        content: isHindi
          ? `सोशल मीडिया, शब्द-बदले और स्थानीय बाजार दुकानों से शुरुआत करें.`
          : `Start with social media, word-of-mouth, and local market shops.`,
        keyPoints: isHindi
          ? ['सामाजिक साइट पर उपस्थिति', 'स्थानीय ग्राहकों से जुड़ें', 'डेमो सैंपल दें']
          : ['Social media presence', 'Connect with local customers', 'Offer demos'],
      },
      {
        title: isHindi ? 'ग्राहक और बी2बी' : 'Customers & B2B',
        description: isHindi
          ? `अपने ${topic} के लिए ग्राहक ढूंढें.`
          : `Find customers for your ${topic}.`,
        content: isHindi
          ? `बीजी मानसून के समय ग्राहक बढ़ते हैं. गर्मियों में तैयार रहें.`
          : `Customer demand increases during festivals. Stock up before peak seasons.`,
        keyPoints: isHindi
          ? ['मौसमी माँग का अनुसरण करें', 'दोहराव वाले ग्राहक बनाएं', 'कस्टमर सेवा']
          : ['Follow seasonal demand', 'Build repeat customers', 'Customer service'],
      },
      {
        title: isHindi ? 'स्केलिंग' : 'Scaling',
        description: isHindi
          ? `अपने ${topic} व्यवसाय को बढ़ाएं.`
          : `Scale your ${topic} business.`,
        content: isHindi
          ? `कठिनाइयों पर निर्भर करकर धीरे या तेज़ी से बढ़ें. स्थिरता प्राप्त करने पर सोचें.`
          : `Scale slowly or quickly depending on challenges. Think about stability after initial growth.`,
        keyPoints: isHindi
          ? ['स्थिर विकास', 'नयी पीढ़ी को प्रशिक्षित करें', 'नए बाजार']
          : ['Stable growth', 'Train next generation', 'Explore new markets'],
      },
    ];

    return {
      title: topic,
      description: isHindi
        ? `${topic} सीखें और एक सफल व्यावसायिक शुरुआत करें.`
        : `Learn ${topic} and start a successful business.`,
      category: isHindi ? 'व्यवसाय' : 'business',
      difficulty: level,
      estimatedDuration: '4-6 weeks',
      lessons: modules.map((mod) => ({
        title: mod.title,
        description: mod.description,
        content: mod.content,
        keyPoints: mod.keyPoints,
        quiz: {
          questions: [
            {
              question: isHindi ? `${mod.title} के बारे में क्या सीखा?` : `What did you learn about ${mod.title}?`,
              options: isHindi
                ? ['मूल्य', 'गुणवत्ता', 'दोनों', 'कोई नहीं']
                : ['Price', 'Quality', 'Both', 'None'],
              correctAnswer: 2,
              explanation: isHindi
                ? 'कीमत और गुणवत्ता दोनों महत्वपूर्ण हैं.'
                : 'Both price and quality matter.',
            },
            {
              question: isHindi
                ? `अपने ${topic} के लिए सबसे बेहतरीन ग्राहक कौन है?`
                : `Who is the ideal customer for ${topic}?`,
              options: isHindi
                ? ['बड़े शहर', 'छोटा स्थानीय', 'दोनों', 'कोई नहीं']
                : ['Big city', 'Small local', 'Both', 'None'],
              correctAnswer: 2,
              explanation: isHindi
                ? 'शुरुआत में स्थानीय ग्राहक बेहतरीन रहते हैं.'
                : 'Local customers are best for beginners.',
            },
          ],
          passingScore: 50,
        },
      })),
    };
  }

  private buildMockExplanation(
    topic: string,
    profile: UserProfile,
    options: ExplainContext
  ): string {
    const lang = options.language || profile.language || 'hi';
    const isHindi = lang === 'hi';
    const style = options.style;

    if (isHindi) {
      if (style === 'village') {
        return `${topic} समझिए ऐसे ही जैसे हम गाँव में बेचते हैं - सरल और सीधा. जैसे कोई ग्राहक आए और आप उसको दिखाएँ तो उसे समझ आए.`;
      }
      if (style === 'simple') {
        return `${topic} को सबसे सरल ढंग से समझिए - एक चीज़ बनाना है, उसे बेचना है. सरल!`;
      }
      return `${topic} के बारे में विस्तृत जानकारी. आप इसे ${profile.location?.district || 'अपने गाँव'} के संदर्भ में सोच सकते हैं.`;
    }

    if (style === 'village') {
      return `Think of ${topic} like how we sell things in a village market - simple and direct. When a customer comes, you show them and they understand.`;
    }
    if (style === 'simple') {
      return `${topic} in the simplest form - you make something and sell it. That's the core idea!`;
    }
    if (style === 'example') {
      return `Example: If ${topic} is candle making, you melt wax, add scent, pour into mold, let it set, then sell. Step by step.`;
    }
    return `${topic} explained for your level. Based on your profile in ${profile.location?.state || 'India'}, here's how to approach it.`;
  }

  private buildMockQuiz(topic: string, count: number, level: string): QuizQuestion[] {
    const questions: QuizQuestion[] = [];
    const topics = [
      {
        q: `What is the first step when starting a ${topic} business?`,
        o: ['Buy all equipment', 'Start selling', 'Plan and research', 'Hire staff'],
        a: 2,
        e: 'Always plan and research before starting.',
      },
      {
        q: `How much initial capital is typically needed for ${topic}?`,
        o: ['₹500', '₹5000-10000', '₹50,000', '₹5,00,000'],
        a: 1,
        e: 'Most home-based businesses can start with ₹5000-10000.',
      },
      {
        q: `What is the most important factor for ${topic} success?`,
        o: ['Marketing', 'Quality', 'Location', 'All of the above'],
        a: 3,
        e: 'Success requires attention to all factors.',
      },
      {
        q: `After how long should you expect to break even in ${topic}?`,
        o: ['1-2 months', '3-6 months', '1 year', 'Never'],
        a: 1,
        e: 'Most businesses take 3-6 months to break even.',
      },
      {
        q: `Where is the best place to sell ${topic} initially?`,
        o: ['Online only', 'Local market/street', 'Wholesale to shops', 'Export'],
        a: 1,
        e: 'Local markets give immediate customer feedback.',
      },
    ];

    for (let i = 0; i < Math.min(count, topics.length); i++) {
      const t = topics[i] || topics[i % topics.length];
      questions.push({
        question: t.q.replace('${topic}', topic),
        options: t.o,
        correctAnswer: t.a,
        explanation: t.e.replace('${topic}', topic),
      });
    }

    if (questions.length === 0) {
      questions.push({
        question: `Basic question about ${topic}`,
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 0,
        explanation: 'Keep learning!',
      });
    }

    return questions;
  }

  private buildMockAssessment(answers: number[], questions: QuizQuestion[]): AssessmentResult {
    const totalQuestions = questions.length;
    let correctAnswers = 0;
    const weakAreas: string[] = [];

    answers.forEach((answer, index) => {
      const q = questions[index];
      if (q && answer === q.correctAnswer) {
        correctAnswers++;
      } else if (q) {
        weakAreas.push(q.question.split('?')[0] || 'This topic');
      }
    });

    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    return {
      score,
      passed: score >= 70,
      correctAnswers,
      totalQuestions,
      weakAreas: [...new Set(weakAreas)].slice(0, 3),
      recommendations: score >= 70
        ? ['Great job! Continue with advanced topics.']
        : ['Review the basics and retake the quiz.'],
    };
  }

  private buildMockBusinessPlan(idea: string, profile: UserProfile): BusinessPlan {
    const capital = profile.financialInfo?.availableCapital || 0;
    const location = profile.location;

    return {
      idea,
      targetCustomer: location
        ? `Local customers in ${location.district}, ${location.state} and nearby areas`
        : 'Local customers in your area',
      investment: {
        required: Math.max(capital, 10000),
        breakdown: {
          rawMaterials: 4000,
          equipment: 3500,
          packaging: 1500,
          initialMarketing: 1000,
        },
      },
      rawMaterials: ['Primary material for ' + idea, 'Secondary supplies', 'Packaging materials'],
      equipment: ['Basic toolkit', 'Work surface', 'Measuring tools', 'Safety equipment'],
      operatingCost: 2000,
      pricingStrategy: {
        costPrice: 50,
        sellingPrice: 100,
        margin: 100,
        wholesalePrice: 70,
      },
      marketingPlan: [
        'Create samples and photos',
        'Sell at local markets',
        'Use WhatsApp to reach customers',
        'Ask friends and family for referrals',
      ],
      salesChannels: ['Local market stalls', 'WhatsApp groups', 'Friends and family', 'Word of mouth'],
      risks: [
        { risk: 'Initial demand uncertainty', mitigation: 'Start small with 5-10 products' },
        { risk: 'Seasonal fluctuations', mitigation: 'Diversify product offerings' },
        { risk: 'Price competition', mitigation: 'Focus on quality and unique features' },
      ],
      milestones: [
        { milestone: 'Set up workspace', timeline: 'Week 1', successMetric: 'Workspace ready' },
        { milestone: 'Create first 10 products', timeline: 'Week 2-3', successMetric: '10 products completed' },
        { milestone: 'Find first 5 customers', timeline: 'Week 4-5', successMetric: '5 sales' },
        { milestone: 'Break even', timeline: 'Month 3-4', successMetric: 'Revenue covers costs' },
        { milestone: 'Positive monthly profit', timeline: 'Month 6', successMetric: 'Consistent profit' },
      ],
      nextActions: [
        'Create a budget and timeline',
        'Source initial raw materials',
        'Create sample products',
        'Identify your first sales channel',
      ],
    };
  }

  private buildMockSchemeMatches(
    profile: UserProfile,
    schemes: Array<{
      _id: string;
      name: string;
      description: string;
      eligibility: string[];
      category: string;
      officialWebsite?: string;
    }>
  ): SchemeMatch[] {
    const matches: SchemeMatch[] = [];

    if (schemes.length === 0) {
      return matches;
    }

    schemes.forEach((scheme, idx) => {
      const matchScore = Math.max(60, 90 - idx * 10);
      matches.push({
        schemeId: scheme._id,
        schemeName: scheme.name,
        matchScore,
        eligibilityFactors: scheme.eligibility.slice(0, 3),
        whyMatched: `Your profile aligns with ${scheme.name} eligibility for ${scheme.category}.`,
        missingRequirements: [],
        officialSource: scheme.officialWebsite || 'https://www.india.gov.in',
        lastVerified: new Date().toISOString().split('T')[0],
      });
    });

    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  private buildMockProductAnalysis(description: string, profile: UserProfile): ProductAnalysis {
    const loc = profile.location;

    return {
      name: `${description.split(' ').slice(0, 3).join(' ')} Product`,
      description: `A handcrafted product made with care using traditional techniques. Made in ${loc?.district || 'India'}.`,
      category: 'handicraft',
      tags: ['handmade', 'traditional', 'local', 'eco-friendly'],
      materials: ['natural material', 'traditional supplies'],
      dimensions: '10cm x 10cm x 5cm',
      priceSuggestion: 150,
      moq: 10,
      capacity: 50,
      productStory: `Crafted by skilled artisans in ${loc?.village || loc?.district || 'rural India'}, this product follows traditional methods passed down through generations.`,
      hindiDescription: `एक हाथ में बनाया गया उत्पाद जो मृदु स्पर्श और पारंपरिक तकनीकों का उपयोग करके बनाया गया है. यह ${loc?.district || 'भारत'} में बनाया गया है.`,
      englishDescription: `A handcrafted product with a soft touch and traditional techniques. Made in ${loc?.district || 'India'}.`,
    };
  }

  private buildMockProductPassport(product: Record<string, unknown>, profile: UserProfile): ProductPassport {
    const loc = profile.location;

    return {
      productName: (product.name as string) || 'Handcrafted Product',
      maker: profile.name || 'Unknown Artisan',
      materials: (product.materials as string[]) || ['natural material'],
      productionMethod: 'Traditional handcrafting using time-tested techniques',
      location: `${loc?.village || loc?.district || 'India'}, ${loc?.state || ''}`.trim(),
      craftStory: `This craft is part of a tradition that has been passed down through generations in ${loc?.district || 'this region'}. Each piece is made by hand with care and attention to detail.`,
      dimensions: (product.dimensions as string) || '10cm x 10cm x 5cm',
      price: Number((product.price as string)) || 150,
      productionCapacity: 50,
    };
  }

  private buildMockBuyerMatches(profile: UserProfile, productInfo?: string): BuyerMatch[] {
    return [
      {
        buyerId: 'mock-buyer-1',
        score: 85,
        whyMatched: [
          'Product category matches buyer requirements',
          'Geographic proximity',
          'Price range compatible',
        ],
        matchFactors: {
          category: 30,
          location: 25,
          price: 20,
          quantity: 10,
        },
      },
      {
        buyerId: 'mock-buyer-2',
        score: 72,
        whyMatched: [
          'Some product category overlap',
          'Same state/region',
          'Quantity requirements align',
        ],
        matchFactors: {
          category: 25,
          location: 20,
          price: 15,
          quantity: 12,
        },
      },
    ];
  }

  private buildMockGrowthRecommendation(
    profile: UserProfile,
    context: Record<string, unknown>
  ): GrowthRecommendation {
    const hasPlan = context.hasBusinessPlan === true;
    const learnProgress = (context.learningProgress as number) || 0;
    const orders = (context.orders as number) || 0;

    let primaryAction = '';
    let reason = '';

    if (!hasPlan) {
      primaryAction = 'Create your business plan';
      reason = 'You have not yet created a business plan. This is essential before starting.';
    } else if (learnProgress < 3) {
      primaryAction = 'Complete more learning lessons';
      reason = `You have completed ${learnProgress} lessons. Continue learning to build your skills.`;
    } else if (orders === 0) {
      primaryAction = 'Find your first customer';
      reason = 'Your business plan is ready, but you need to find your first buyer.';
    } else {
      primaryAction = 'Scale your business';
      reason = `You have ${orders} orders and completed ${learnProgress} lessons. Time to grow.`;
    }

    return {
      primaryAction,
      reason,
      estimatedTime: '30 minutes',
      potentialImpact: 'medium',
      secondaryActions: [
        'Check available funding schemes',
        'Review your business plan',
        'Connect with potential buyers',
      ],
    };
  }

  private buildMockDailyMission(profile: UserProfile, context: Record<string, unknown>): DailyMission {
    const learnProgress = (context.learningProgress as number) || 0;
    const hasPlan = context.hasBusinessPlan === true;
    const streak = (context.currentStreak as number) || 0;

    let task = '';
    let reason = '';

    if (learnProgress < 3) {
      task = `Complete Lesson ${learnProgress + 1} of your learning path`;
      reason = `You have completed ${learnProgress} lessons. Continue your learning streak!`;
    } else if (!hasPlan) {
      task = 'Write your first business plan idea';
      reason = 'You have learned enough to plan your business.';
    } else {
      task = 'Add a product price to your catalog';
      reason = 'Pricing is essential for turning your product into sales.';
    }

    const secondaryTasks = streak > 0
      ? [`Maintain your streak (${streak} days)`, 'Check one government scheme for your business']
      : ['Review yesterday\'s lesson', 'Set a learning goal for today'];

    return {
      primary: {
        task,
        reason,
        estimatedTime: '15-30 minutes',
      },
      secondary: secondaryTasks,
    };
  }

  private buildMockChat(profile: UserProfile, message: string): AIResponseType {
    const msgLower = message.toLowerCase();
    let response = '';

    const greetings = ['नमस्ते', 'hello', 'हैलो', 'हाय'];

    if (greetings.some((g) => msgLower.includes(g))) {
      response = `नमस्ते${profile.name ? `, ${profile.name}` : ''}! मैं आपका RozgarSetu AI सहायक हूँ. मैं आपकी मदद कर सकता हूँ काऱीगरों, सीखने, फंडिंग, उत्पादों या खरीददारियों के बारे में.`;
    } else if (msgLower.includes('business') || msgLower.includes('काऱीगर') || msgLower.includes('व्यवसाय')) {
      const capital = profile.financialInfo?.availableCapital || 0;
      response = `आपके पास ₹${capital} पूंजी है. मुझे सुझाव देने के लिए कुछ जानकारी चाहिए - आप किस वस्त्र/सेवा में रुचि रखते हैं?`;
    } else if (msgLower.includes('fund') || msgLower.includes('पैसा') || msgLower.includes('फंड')) {
      response = 'मुझे आपकी ज़रूरतों के अनुसार सरकारी योजनाओं की जाँच करने में मदद कर सकता हूँ. आपने अपना प्रोफ़ाइल पूरा किया है क्या?';
    } else if (msgLower.includes('learn') || msgLower.includes('सीख') || msgLower.includes('सीखें')) {
      response = 'मैं आपके लिए एक व्यक्तिगत सीखने की योजना बना सकता हूँ. क्या आप किसी विशिष्ट विषय पर ध्यान केंद्रित करना चाहेंगे?';
    } else if (msgLower.includes('buyer') || msgLower.includes('खरीद') || msgLower.includes('ग्राहक')) {
      response = 'मैं आपके उत्पाद के साथ संभावित खरीददारों को मिलाने में मदद कर सकता हूँ. कृपया अपने उत्पाद के बारे में बताएं.';
    } else {
      response = 'मैं RozgarSetu AI हूँ और मैं आपकी रोज़गार यात्रा में मदद करने के लिए हूँ. आप मुझसे व्यवसाय, सीखना, फंडिंग, उत्पाद या खरीददारों के बारे में पूछ सकते हैं.';
    }

    return {
      response,
      suggestions: ['क्या व्यवसाय शुरू करना चाहिए?', 'मुझे फंडिंग के बारे में बताएं', 'अगला सबक्यूलर क्या है?', 'मेरे उत्पाद के लिए खरीददार ढूंढें'],
    };
  }
}

export const aiService = new AIService();
