import { LLMProvider } from './ai/llmProviders';
import { UserProfile, LivelihoodFingerprint, Opportunity, LearningPath, QuizQuestion, AssessmentResult, BusinessPlan, ProductAnalysis, ProductPassport, BuyerMatch, DailyMission, GrowthRecommendation, SchemeMatch, IncomeSimulation, VoiceTranscription, VoiceSynthesis, AIResponseType, ExplainContext } from './ai/prompts';
declare class AIService {
    private provider;
    private useMock;
    constructor();
    getProvider(): LLMProvider;
    toUserProfile(user: Record<string, unknown>, profile?: Record<string, unknown>, location?: Record<string, unknown>): UserProfile;
    generateLivelihoodAssessment(profile: UserProfile): Promise<LivelihoodFingerprint>;
    generateLivelihoodFingerprint(profile: UserProfile): Promise<LivelihoodFingerprint>;
    recommendSkills(profile: UserProfile): Promise<string[]>;
    discoverBusinessOpportunities(query: string, profile: UserProfile): Promise<Opportunity[]>;
    simulateIncomePaths(opportunity: string, investment: number): Promise<IncomeSimulation>;
    generateLearningPlan(topic: string, profile: UserProfile, level?: 'beginner' | 'intermediate' | 'advanced'): Promise<LearningPath>;
    generateLessonExplanation(topic: string, profile: UserProfile, options: ExplainContext): Promise<string>;
    generateQuiz(topic: string, count: number, level?: 'beginner' | 'intermediate' | 'advanced'): Promise<QuizQuestion[]>;
    analyzeAssessment(answers: number[], questions: QuizQuestion[]): Promise<AssessmentResult>;
    generateBusinessPlan(idea: string, profile: UserProfile): Promise<BusinessPlan>;
    matchGovernmentSchemes(profile: UserProfile, schemes: Array<{
        _id: string;
        name: string;
        description: string;
        eligibility: string[];
        category: string;
        officialWebsite?: string;
        lastVerified?: string;
    }>): Promise<SchemeMatch[]>;
    analyzeProduct(description: string, profile: UserProfile): Promise<ProductAnalysis>;
    generateProductCatalog(productIdeas: string[], profile: UserProfile): Promise<ProductAnalysis[]>;
    generateProductPassport(product: Record<string, unknown>, profile: UserProfile): Promise<ProductPassport>;
    matchBuyers(profile: UserProfile, productInfo?: string): Promise<BuyerMatch[]>;
    generateGrowthRecommendation(profile: UserProfile, context: Record<string, unknown>): Promise<GrowthRecommendation>;
    generateDailyMission(profile: UserProfile, context: Record<string, unknown>): Promise<DailyMission>;
    chat(profile: UserProfile, message: string, context?: Record<string, unknown>): Promise<AIResponseType>;
    transcribeVoice(audioBuffer: Buffer, options?: {
        language?: string;
        model?: string;
    }): Promise<VoiceTranscription>;
    synthesizeVoice(text: string, options?: {
        language?: string;
        voice?: string;
        speed?: number;
    }): Promise<VoiceSynthesis>;
    private getMock;
    private buildMockFingerprint;
    private buildMockOpportunities;
    private buildMockIncomeSimulation;
    private buildMockLearningPath;
    private buildMockExplanation;
    private buildMockQuiz;
    private buildMockAssessment;
    private buildMockBusinessPlan;
    private buildMockSchemeMatches;
    private buildMockProductAnalysis;
    private buildMockProductPassport;
    private buildMockBuyerMatches;
    private buildMockGrowthRecommendation;
    private buildMockDailyMission;
    private buildMockChat;
}
export declare const aiService: AIService;
export {};
//# sourceMappingURL=ai.service.d.ts.map