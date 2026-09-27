import { Request, Response } from 'express';
import { AIConversation, IUser, Scheme } from '../models';
import { asyncHandler } from '../middleware/errorHandler';
import { successResponse } from '../utils/types';
import { aiService } from '../services/ai.service';
import { logger } from '../utils/logger';
import mongoose from 'mongoose';

export const aiController = {
  chat: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
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

    let response: string;
    const suggestions: string[] = ['View opportunity', 'Check funding', 'Continue learning', 'Connect with buyer'];

    try {
      const result = await aiService.getProvider().generateText(
        `You are RozgarSetu AI, a helpful assistant for rural Indian entrepreneurs. 
User profile: ${JSON.stringify(profile)}
User message: "${message}"
Context: ${JSON.stringify(context || {})}

Respond in ${profile.language === 'hi' ? 'Hindi' : 'English'}, keeping it conversational and helpful.
Keep responses concise (max 2-3 paragraphs).`,
        { temperature: 0.7 }
      );
      response = result.content;
    } catch (error) {
      logger.error({ error }, 'AI chat failed');
      response = 'मैं एक ग्लिच के कारण जवाब नहीं दे सका। कृपया फिर से कोशिश करें।';
    }

    const conversation = new AIConversation({
      userId: new mongoose.Types.ObjectId(userId),
      sessionId: `session-${Date.now()}`,
      messages: [
        { role: 'user', content: message, timestamp: new Date() },
        { role: 'assistant', content: response, timestamp: new Date() },
      ],
      context: { ...context, profile },
    });
    await conversation.save();

    res.json(successResponse('AI response', { response, suggestions }));
  }),

  explain: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const { topic, language, style } = req.body;

    const profile = {
      name: authReq.user.name,
      phone: authReq.user.phone,
      skills: authReq.user.profile?.skills || [],
      interests: authReq.user.profile?.interests || [],
      language: authReq.user.language,
    };

    const explanation = await aiService.generateLessonExplanation(
      topic,
      { ...profile, language: language || authReq.user.language || 'hi' },
      style || 'simple'
    );

    res.json(successResponse('Explanation generated', { explanation }));
  }),

  getRecommendations: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
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
        aiService.discoverBusinessOpportunities(
          `I have ₹${profile.financialInfo?.availableCapital || 0} capital and want to start a profitable business`,
          profile
        ).catch(() => []),
        Scheme.find({ isActive: true }).lean().catch(() => []),
        [] as any,
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
        const schemeMatches = await aiService.matchGovernmentSchemes(profile, schemes.map(s => ({
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

      res.json(successResponse('Recommendations', recommendations));
    } catch (error) {
      logger.error({ error }, 'AI recommendations failed');
      res.json(successResponse('Recommendations', []));
    }
  }),

  getRoadmap: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const userId = authReq.user._id.toString();

    const profile = {
      name: authReq.user.name,
      skills: authReq.user.profile?.skills || [],
      goals: authReq.user.profile?.goals || [],
      financialInfo: authReq.user.profile?.financialInfo,
      onboardingCompleted: authReq.user.onboardingCompleted,
    };

    try {
      const fingerprint = await aiService.generateLivelihoodAssessment(profile);

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

      res.json(successResponse('AI roadmap', roadmap));
    } catch (error) {
      logger.error({ error }, 'AI roadmap failed');
      res.json(successResponse('AI roadmap', {
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

  getConversations: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const userId = authReq.user._id.toString();

    const conversations = await AIConversation.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ updatedAt: -1 })
      .lean();

    res.json(successResponse('Conversations retrieved', conversations));
  }),

  assess: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
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

    const assessment = await aiService.generateLivelihoodAssessment(profile);
    res.json(successResponse('Livelihood assessment generated', assessment));
  }),

  fingerprint: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
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

    const fingerprint = await aiService.generateLivelihoodFingerprint(profile);
    res.json(successResponse('Livelihood fingerprint generated', fingerprint));
  }),

  recommendSkills: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const profile = {
      name: authReq.user.name,
      skills: authReq.user.profile?.skills || [],
      interests: authReq.user.profile?.interests || [],
      businessInterest: authReq.user.profile?.businessInterest || [],
      location: authReq.user.location,
      goals: authReq.user.profile?.goals || [],
    };

    const skills = await aiService.recommendSkills(profile);
    res.json(successResponse('Skill recommendations generated', skills));
  }),

  discoverOpportunities: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
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

    const opportunities = await aiService.discoverBusinessOpportunities(
      query || `I have ₹${profile.financialInfo?.availableCapital || 0} capital and want to start a profitable business`,
      profile
    );
    res.json(successResponse('Opportunities discovered', opportunities));
  }),

  simulateIncome: asyncHandler(async (req: Request, res: Response) => {
    const { opportunity, investment } = req.body;
    const simulation = await aiService.simulateIncomePaths(opportunity, investment);
    res.json(successResponse('Income simulation generated', simulation));
  }),

  generateLearningPlan: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const { topic, level } = req.body;
    const profile = {
      name: authReq.user.name,
      language: authReq.user.language,
      skills: authReq.user.profile?.skills || [],
      interests: authReq.user.profile?.interests || [],
    };

    const plan = await aiService.generateLearningPlan(topic, profile, level || 'beginner');
    res.json(successResponse('Learning plan generated', plan));
  }),

  generateQuiz: asyncHandler(async (req: Request, res: Response) => {
    const { topic, count, level } = req.body;
    const quiz = await aiService.generateQuiz(topic, count || 5, level || 'beginner');
    res.json(successResponse('Quiz generated', { questions: quiz }));
  }),

  analyzeAssessment: asyncHandler(async (req: Request, res: Response) => {
    const { answers, questions } = req.body;
    const analysis = await aiService.analyzeAssessment(answers, questions);
    res.json(successResponse('Assessment analyzed', analysis));
  }),

  generateBusinessPlan: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
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

    const plan = await aiService.generateBusinessPlan(idea, profile);
    res.json(successResponse('Business plan generated', plan));
  }),

   matchSchemes: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const schemes = await Scheme.find({ isActive: true })
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

    const schemeInput = schemes.map((s: any) => ({
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
    const matches = await aiService.matchGovernmentSchemes(profile, schemeInput);
    res.json(successResponse('Scheme matches generated', matches));
  }),

  analyzeProduct: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const { description } = req.body;
    const profile = {
      name: authReq.user.name,
      location: authReq.user.location,
    };

    const analysis = await aiService.analyzeProduct(description, profile);
    res.json(successResponse('Product analysis generated', analysis));
  }),

  generateProductCatalog: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const { ideas } = req.body;
    const profile = { name: authReq.user.name, location: authReq.user.location };

    const catalog = await aiService.generateProductCatalog(ideas, profile);
    res.json(successResponse('Product catalog generated', catalog));
  }),

  generateProductPassport: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const { product } = req.body;
    const profile = {
      name: authReq.user.name,
      location: authReq.user.location,
    };

    const passport = await aiService.generateProductPassport(product, profile);
    res.json(successResponse('Product passport generated', passport));
  }),

  matchBuyers: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const { productInfo } = req.body;
    const profile = {
      name: authReq.user.name,
      skills: authReq.user.profile?.skills || [],
      interests: authReq.user.profile?.interests || [],
      businessInterest: authReq.user.profile?.businessInterest || [],
      location: authReq.user.location,
      financialInfo: authReq.user.profile?.financialInfo,
    };

    const matches = await aiService.matchBuyers(profile, productInfo);
    res.json(successResponse('Buyer matches generated', matches));
  }),

  nextAction: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
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

    const BusinessPlan = mongoose.model('BusinessPlan');
    const Order = mongoose.model('Order');
    const UserProgress = mongoose.model('UserProgress');

    const [plan, orders, progress] = await Promise.allSettled([
      BusinessPlan.findOne({ userId: new mongoose.Types.ObjectId(userId) }).lean(),
      Order.countDocuments({ userId: new mongoose.Types.ObjectId(userId) }),
      UserProgress.findOne({ userId: new mongoose.Types.ObjectId(userId) }).lean(),
    ]);

    const context = {
      hasBusinessPlan: plan.status === 'fulfilled' && !!plan.value,
      orders: orders.status === 'fulfilled' ? orders.value : 0,
      learningProgress: progress.status === 'fulfilled' && (progress.value as any)?.overallStats?.totalLessonsCompleted || 0,
      onboardingCompleted: authReq.user.onboardingCompleted,
    };

    const recommendation = await aiService.generateGrowthRecommendation(profile, context);
    res.json(successResponse('Growth recommendation generated', recommendation));
  }),

  dailyMission: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const userId = authReq.user._id.toString();

    const profile = {
      name: authReq.user.name,
      skills: authReq.user.profile?.skills || [],
      interests: authReq.user.profile?.interests || [],
      goals: authReq.user.profile?.goals || [],
      location: authReq.user.location,
      language: authReq.user.language,
    };

    const UserProgress = mongoose.model('UserProgress');
    const progress = await UserProgress.findOne({ userId: new mongoose.Types.ObjectId(userId) }).lean();

    const context = {
       learningProgress: (progress as any)?.overallStats?.totalLessonsCompleted || 0,
       currentStreak: (progress as any)?.overallStats?.currentStreak || 0,
      onboardingCompleted: authReq.user.onboardingCompleted,
    };

    const mission = await aiService.generateDailyMission(profile, context);
    res.json(successResponse('Daily mission generated', mission));
  }),

  voiceToText: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const { audio, language } = req.body;

    if (!audio) {
      res.status(400).json({
        success: false,
        message: 'Audio data is required',
        data: null,
        error: { code: 'MISSING_AUDIO', details: 'Please provide audio data' },
      } as any);
      return;
    }

    try {
      const audioBuffer = Buffer.from(audio, 'base64');
      const result = await aiService.transcribeVoice(audioBuffer, {
        language: language || authReq.user.language || 'hi',
      });
      res.json(successResponse('Voice transcribed', result));
    } catch (error: any) {
      logger.error({ error }, 'Voice transcription failed');
      res.status(500).json(successResponse('Voice transcription failed', null) as any);
    }
  }),

  textToVoice: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const { text, language, voice, speed } = req.body;

    if (!text) {
      res.status(400).json({
        success: false,
        message: 'Text is required',
        data: null,
        error: { code: 'MISSING_TEXT', details: 'Please provide text to synthesize' },
      } as any);
      return;
    }

    try {
      const result = await aiService.synthesizeVoice(text, {
        language: language || authReq.user.language || 'hi',
        voice,
        speed,
      });
      res.json(successResponse('Voice synthesized', {
        audio: result.audioData.toString('base64'),
        mimeType: result.mimeType,
        language: result.language,
        isMock: result.isMock,
      }));
    } catch (error: any) {
      logger.error({ error }, 'Voice synthesis failed');
      res.status(500).json(successResponse('Voice synthesis failed', null) as any);
    }
  }),
};
