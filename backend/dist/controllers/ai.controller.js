"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiController = void 0;
const models_1 = require("../models");
const errorHandler_1 = require("../middleware/errorHandler");
const types_1 = require("../utils/types");
const ai_service_1 = require("../services/ai.service");
const logger_1 = require("../utils/logger");
const mongoose_1 = __importDefault(require("mongoose"));
exports.aiController = {
    chat: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const userId = authReq.user._id.toString();
        const { message, context } = req.body;
        const profile = {
            name: authReq.user.name,
            phone: authReq.user.phone,
            age: authReq.user.profile?.age,
            gender: authReq.user.profile?.gender,
            location: authReq.user.location,
            education: authReq.user.profile?.education,
            skills: authReq.user.profile?.skills || [],
            interests: authReq.user.profile?.interests || [],
            businessInterest: authReq.user.profile?.businessInterest || [],
            financialInfo: authReq.user.profile?.financialInfo,
            goals: authReq.user.profile?.goals || [],
            language: authReq.user.language,
        };
        let response;
        const suggestions = ['View opportunity', 'Check funding', 'Continue learning', 'Connect with buyer'];
        try {
            const result = await ai_service_1.aiService.getProvider().generateText(`You are RozgarSetu AI, a helpful assistant for rural Indian entrepreneurs. 
User profile: ${JSON.stringify(profile)}
User message: "${message}"
Context: ${JSON.stringify(context || {})}

Respond in ${profile.language === 'hi' ? 'Hindi' : 'English'}, keeping it conversational and helpful.
Keep responses concise (max 2-3 paragraphs).`, { temperature: 0.7 });
            response = result.content;
        }
        catch (error) {
            logger_1.logger.error({ error }, 'AI chat failed');
            response = 'मैं एक ग्लिच के कारण जवाब नहीं दे सका। कृपया फिर से कोशिश करें।';
        }
        const conversation = new models_1.AIConversation({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            sessionId: `session-${Date.now()}`,
            messages: [
                { role: 'user', content: message, timestamp: new Date() },
                { role: 'assistant', content: response, timestamp: new Date() },
            ],
            context: { ...context, profile },
        });
        await conversation.save();
        res.json((0, types_1.successResponse)('AI response', { response, suggestions }));
    }),
    explain: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const { topic, language, style } = req.body;
        const profile = {
            name: authReq.user.name,
            phone: authReq.user.phone,
            skills: authReq.user.profile?.skills || [],
            interests: authReq.user.profile?.interests || [],
            language: authReq.user.language,
        };
        const explanation = await ai_service_1.aiService.generateLessonExplanation(topic, { ...profile, language: language || authReq.user.language || 'hi' }, style || 'simple');
        res.json((0, types_1.successResponse)('Explanation generated', { explanation }));
    }),
    getRecommendations: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const userId = authReq.user._id.toString();
        const profile = {
            name: authReq.user.name,
            phone: authReq.user.phone,
            location: authReq.user.location,
            education: authReq.user.profile?.education,
            skills: authReq.user.profile?.skills || [],
            interests: authReq.user.profile?.interests || [],
            businessInterest: authReq.user.profile?.businessInterest || [],
            financialInfo: authReq.user.profile?.financialInfo,
            goals: authReq.user.profile?.goals || [],
            language: authReq.user.language,
        };
        try {
            const [opportunities, schemes, learningPaths] = await Promise.all([
                ai_service_1.aiService.discoverBusinessOpportunities(`I have ₹${profile.financialInfo?.availableCapital || 0} capital and want to start a profitable business`, profile).catch(() => []),
                models_1.Scheme.find({ isActive: true }).lean().catch(() => []),
                [],
            ]);
            const recommendations = [];
            if (opportunities.length > 0) {
                recommendations.push({
                    id: 'opp-1',
                    type: 'opportunity',
                    title: opportunities[0].title,
                    description: opportunities[0].description,
                    reason: opportunities[0].whySuitable,
                    confidence: 85,
                    actionLabel: 'View Details',
                    actionRoute: '/explore',
                });
            }
            if (schemes.length > 0) {
                const schemeMatches = await ai_service_1.aiService.matchGovernmentSchemes(profile, schemes.map(s => ({
                    _id: s._id?.toString() || '',
                    name: s.name || '',
                    description: s.description || '',
                    eligibility: s.eligibility || [],
                    category: s.category || '',
                    officialWebsite: s.officialWebsite,
                    lastVerified: s.lastVerified?.toString(),
                })));
                schemeMatches.slice(0, 2).forEach((match, idx) => {
                    const scheme = schemes.find(s => s._id.toString() === match.schemeId) || schemes[idx];
                    if (scheme) {
                        recommendations.push({
                            id: `scheme-${idx}`,
                            type: 'scheme',
                            title: scheme.name,
                            description: scheme.description,
                            reason: match.whyMatched,
                            confidence: match.matchScore,
                            actionLabel: 'Check Eligibility',
                            actionRoute: `/funding?scheme=${scheme._id}`,
                        });
                    }
                });
            }
            recommendations.push({
                id: 'learn-1',
                type: 'learning',
                title: 'Continue Learning',
                description: 'Complete your next lesson to build skills',
                reason: 'Learning is essential for business success',
                confidence: 70,
                actionLabel: 'Continue Learning',
                actionRoute: '/learn',
            });
            res.json((0, types_1.successResponse)('Recommendations', recommendations));
        }
        catch (error) {
            logger_1.logger.error({ error }, 'AI recommendations failed');
            res.json((0, types_1.successResponse)('Recommendations', []));
        }
    }),
    getRoadmap: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const userId = authReq.user._id.toString();
        const profile = {
            name: authReq.user.name,
            skills: authReq.user.profile?.skills || [],
            goals: authReq.user.profile?.goals || [],
            financialInfo: authReq.user.profile?.financialInfo,
            onboardingCompleted: authReq.user.onboardingCompleted,
        };
        try {
            const fingerprint = await ai_service_1.aiService.generateLivelihoodAssessment(profile);
            const roadmap = {
                currentStep: authReq.user.onboardingCompleted ? 'learn' : 'interest',
                nextAction: fingerprint.recommendedNextSteps[0] || 'Complete your profile',
                steps: [
                    { id: 'interest', label: 'Interest', completed: true },
                    { id: 'learn', label: 'Learn', completed: fingerprint.learningReadiness !== 'not_ready' },
                    { id: 'practice', label: 'Practice', completed: false },
                    { id: 'assess', label: 'Assess', completed: false },
                    { id: 'plan', label: 'Plan', completed: false },
                    { id: 'fund', label: 'Fund', completed: profile.financialInfo?.availableCapital > 0 },
                    { id: 'sell', label: 'Sell', completed: false },
                    { id: 'grow', label: 'Grow', completed: false },
                ],
            };
            res.json((0, types_1.successResponse)('AI roadmap', roadmap));
        }
        catch (error) {
            logger_1.logger.error({ error }, 'AI roadmap failed');
            res.json((0, types_1.successResponse)('AI roadmap', {
                currentStep: 'learn',
                nextAction: 'Complete your profile and start learning.',
                steps: [
                    { id: 'interest', label: 'Interest', completed: true },
                    { id: 'learn', label: 'Learn', completed: false },
                    { id: 'practice', label: 'Practice', completed: false },
                    { id: 'plan', label: 'Plan', completed: false },
                    { id: 'fund', label: 'Fund', completed: false },
                    { id: 'sell', label: 'Sell', completed: false },
                    { id: 'grow', label: 'Grow', completed: false },
                ],
            }));
        }
    }),
    getConversations: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const userId = authReq.user._id.toString();
        const conversations = await models_1.AIConversation.find({ userId: new mongoose_1.default.Types.ObjectId(userId) })
            .sort({ updatedAt: -1 })
            .lean();
        res.json((0, types_1.successResponse)('Conversations retrieved', conversations));
    }),
    assess: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const profile = {
            name: authReq.user.name,
            phone: authReq.user.phone,
            age: authReq.user.profile?.age,
            gender: authReq.user.profile?.gender,
            location: authReq.user.location,
            education: authReq.user.profile?.education,
            skills: authReq.user.profile?.skills || [],
            interests: authReq.user.profile?.interests || [],
            businessInterest: authReq.user.profile?.businessInterest || [],
            financialInfo: authReq.user.profile?.financialInfo,
            goals: authReq.user.profile?.goals || [],
            language: authReq.user.language,
        };
        const assessment = await ai_service_1.aiService.generateLivelihoodAssessment(profile);
        res.json((0, types_1.successResponse)('Livelihood assessment generated', assessment));
    }),
    fingerprint: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const profile = {
            name: authReq.user.name,
            phone: authReq.user.phone,
            location: authReq.user.location,
            education: authReq.user.profile?.education,
            skills: authReq.user.profile?.skills || [],
            interests: authReq.user.profile?.interests || [],
            businessInterest: authReq.user.profile?.businessInterest || [],
            financialInfo: authReq.user.profile?.financialInfo,
            goals: authReq.user.profile?.goals || [],
            language: authReq.user.language,
        };
        const fingerprint = await ai_service_1.aiService.generateLivelihoodFingerprint(profile);
        res.json((0, types_1.successResponse)('Livelihood fingerprint generated', fingerprint));
    }),
    recommendSkills: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const profile = {
            name: authReq.user.name,
            skills: authReq.user.profile?.skills || [],
            interests: authReq.user.profile?.interests || [],
            businessInterest: authReq.user.profile?.businessInterest || [],
            location: authReq.user.location,
            goals: authReq.user.profile?.goals || [],
        };
        const skills = await ai_service_1.aiService.recommendSkills(profile);
        res.json((0, types_1.successResponse)('Skill recommendations generated', skills));
    }),
    discoverOpportunities: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const { query } = req.body;
        const profile = {
            name: authReq.user.name,
            location: authReq.user.location,
            skills: authReq.user.profile?.skills || [],
            interests: authReq.user.profile?.interests || [],
            businessInterest: authReq.user.profile?.businessInterest || [],
            financialInfo: authReq.user.profile?.financialInfo,
            goals: authReq.user.profile?.goals || [],
            education: authReq.user.profile?.education,
        };
        const opportunities = await ai_service_1.aiService.discoverBusinessOpportunities(query || `I have ₹${profile.financialInfo?.availableCapital || 0} capital and want to start a profitable business`, profile);
        res.json((0, types_1.successResponse)('Opportunities discovered', opportunities));
    }),
    simulateIncome: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { opportunity, investment } = req.body;
        const simulation = await ai_service_1.aiService.simulateIncomePaths(opportunity, investment);
        res.json((0, types_1.successResponse)('Income simulation generated', simulation));
    }),
    generateLearningPlan: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const { topic, level } = req.body;
        const profile = {
            name: authReq.user.name,
            language: authReq.user.language,
            skills: authReq.user.profile?.skills || [],
            interests: authReq.user.profile?.interests || [],
        };
        const plan = await ai_service_1.aiService.generateLearningPlan(topic, profile, level || 'beginner');
        res.json((0, types_1.successResponse)('Learning plan generated', plan));
    }),
    generateQuiz: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { topic, count, level } = req.body;
        const quiz = await ai_service_1.aiService.generateQuiz(topic, count || 5, level || 'beginner');
        res.json((0, types_1.successResponse)('Quiz generated', { questions: quiz }));
    }),
    analyzeAssessment: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { answers, questions } = req.body;
        const analysis = await ai_service_1.aiService.analyzeAssessment(answers, questions);
        res.json((0, types_1.successResponse)('Assessment analyzed', analysis));
    }),
    generateBusinessPlan: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const { idea } = req.body;
        const profile = {
            name: authReq.user.name,
            location: authReq.user.location,
            skills: authReq.user.profile?.skills || [],
            interests: authReq.user.profile?.interests || [],
            businessInterest: authReq.user.profile?.businessInterest || [],
            financialInfo: authReq.user.profile?.financialInfo,
            goals: authReq.user.profile?.goals || [],
            education: authReq.user.profile?.education,
        };
        const plan = await ai_service_1.aiService.generateBusinessPlan(idea, profile);
        res.json((0, types_1.successResponse)('Business plan generated', plan));
    }),
    matchSchemes: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const schemes = await models_1.Scheme.find({ isActive: true })
            .select('name description eligibility benefits category officialWebsite lastVerified createdAt updatedAt')
            .lean();
        const profile = {
            name: authReq.user.name,
            location: authReq.user.location,
            skills: authReq.user.profile?.skills || [],
            businessInterest: authReq.user.profile?.businessInterest || [],
            financialInfo: authReq.user.profile?.financialInfo,
            goals: authReq.user.profile?.goals || [],
            education: authReq.user.profile?.education,
            language: authReq.user.language,
        };
        const schemeInput = schemes.map((s) => ({
            _id: s._id?.toString() || s.name,
            name: s.name,
            description: s.description,
            eligibility: s.eligibility || [],
            benefits: s.benefits || [],
            category: s.category,
            officialWebsite: s.officialWebsite,
            lastVerified: s.lastVerified || s.updatedAt,
            source: 'verified_database',
        }));
        const matches = await ai_service_1.aiService.matchGovernmentSchemes(profile, schemeInput);
        res.json((0, types_1.successResponse)('Scheme matches generated', matches));
    }),
    analyzeProduct: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const { description } = req.body;
        const profile = {
            name: authReq.user.name,
            location: authReq.user.location,
        };
        const analysis = await ai_service_1.aiService.analyzeProduct(description, profile);
        res.json((0, types_1.successResponse)('Product analysis generated', analysis));
    }),
    generateProductCatalog: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const { ideas } = req.body;
        const profile = { name: authReq.user.name, location: authReq.user.location };
        const catalog = await ai_service_1.aiService.generateProductCatalog(ideas, profile);
        res.json((0, types_1.successResponse)('Product catalog generated', catalog));
    }),
    generateProductPassport: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const { product } = req.body;
        const profile = {
            name: authReq.user.name,
            location: authReq.user.location,
        };
        const passport = await ai_service_1.aiService.generateProductPassport(product, profile);
        res.json((0, types_1.successResponse)('Product passport generated', passport));
    }),
    matchBuyers: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const { productInfo } = req.body;
        const profile = {
            name: authReq.user.name,
            skills: authReq.user.profile?.skills || [],
            interests: authReq.user.profile?.interests || [],
            businessInterest: authReq.user.profile?.businessInterest || [],
            location: authReq.user.location,
            financialInfo: authReq.user.profile?.financialInfo,
        };
        const matches = await ai_service_1.aiService.matchBuyers(profile, productInfo);
        res.json((0, types_1.successResponse)('Buyer matches generated', matches));
    }),
    nextAction: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const userId = authReq.user._id.toString();
        const profile = {
            name: authReq.user.name,
            skills: authReq.user.profile?.skills || [],
            interests: authReq.user.profile?.interests || [],
            businessInterest: authReq.user.profile?.businessInterest || [],
            financialInfo: authReq.user.profile?.financialInfo,
            goals: authReq.user.profile?.goals || [],
            location: authReq.user.location,
            language: authReq.user.language,
        };
        const BusinessPlan = mongoose_1.default.model('BusinessPlan');
        const Order = mongoose_1.default.model('Order');
        const UserProgress = mongoose_1.default.model('UserProgress');
        const [plan, orders, progress] = await Promise.allSettled([
            BusinessPlan.findOne({ userId: new mongoose_1.default.Types.ObjectId(userId) }).lean(),
            Order.countDocuments({ userId: new mongoose_1.default.Types.ObjectId(userId) }),
            UserProgress.findOne({ userId: new mongoose_1.default.Types.ObjectId(userId) }).lean(),
        ]);
        const context = {
            hasBusinessPlan: plan.status === 'fulfilled' && !!plan.value,
            orders: orders.status === 'fulfilled' ? orders.value : 0,
            learningProgress: progress.status === 'fulfilled' && progress.value?.overallStats?.totalLessonsCompleted || 0,
            onboardingCompleted: authReq.user.onboardingCompleted,
        };
        const recommendation = await ai_service_1.aiService.generateGrowthRecommendation(profile, context);
        res.json((0, types_1.successResponse)('Growth recommendation generated', recommendation));
    }),
    dailyMission: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const userId = authReq.user._id.toString();
        const profile = {
            name: authReq.user.name,
            skills: authReq.user.profile?.skills || [],
            interests: authReq.user.profile?.interests || [],
            goals: authReq.user.profile?.goals || [],
            location: authReq.user.location,
            language: authReq.user.language,
        };
        const UserProgress = mongoose_1.default.model('UserProgress');
        const progress = await UserProgress.findOne({ userId: new mongoose_1.default.Types.ObjectId(userId) }).lean();
        const context = {
            learningProgress: progress?.overallStats?.totalLessonsCompleted || 0,
            currentStreak: progress?.overallStats?.currentStreak || 0,
            onboardingCompleted: authReq.user.onboardingCompleted,
        };
        const mission = await ai_service_1.aiService.generateDailyMission(profile, context);
        res.json((0, types_1.successResponse)('Daily mission generated', mission));
    }),
    voiceToText: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const { audio, language } = req.body;
        if (!audio) {
            res.status(400).json({
                success: false,
                message: 'Audio data is required',
                data: null,
                error: { code: 'MISSING_AUDIO', details: 'Please provide audio data' },
            });
            return;
        }
        try {
            const audioBuffer = Buffer.from(audio, 'base64');
            const result = await ai_service_1.aiService.transcribeVoice(audioBuffer, {
                language: language || authReq.user.language || 'hi',
            });
            res.json((0, types_1.successResponse)('Voice transcribed', result));
        }
        catch (error) {
            logger_1.logger.error({ error }, 'Voice transcription failed');
            res.status(500).json((0, types_1.successResponse)('Voice transcription failed', null));
        }
    }),
    textToVoice: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const { text, language, voice, speed } = req.body;
        if (!text) {
            res.status(400).json({
                success: false,
                message: 'Text is required',
                data: null,
                error: { code: 'MISSING_TEXT', details: 'Please provide text to synthesize' },
            });
            return;
        }
        try {
            const result = await ai_service_1.aiService.synthesizeVoice(text, {
                language: language || authReq.user.language || 'hi',
                voice,
                speed,
            });
            res.json((0, types_1.successResponse)('Voice synthesized', {
                audio: result.audioData.toString('base64'),
                mimeType: result.mimeType,
                language: result.language,
                isMock: result.isMock,
            }));
        }
        catch (error) {
            logger_1.logger.error({ error }, 'Voice synthesis failed');
            res.status(500).json((0, types_1.successResponse)('Voice synthesis failed', null));
        }
    }),
};
//# sourceMappingURL=ai.controller.js.map