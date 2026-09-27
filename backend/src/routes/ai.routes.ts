import { Router } from 'express';
import { aiController } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { rateLimit } from 'express-rate-limit';
import {
  aiChatSchema,
  aiExplainSchema,
  aiRecommendSkillsSchema,
  aiDiscoverSchema,
  aiSimulateIncomeSchema,
  aiLearningPlanSchema,
  aiQuizSchema,
  aiAssessmentSchema,
  aiBusinessPlanSchema,
  aiAnalyzeProductSchema,
  aiProductCatalogSchema,
  aiProductPassportSchema,
  aiMatchBuyersSchema,
  aiVoiceToTextSchema,
  aiTextToVoiceSchema,
} from '../validators';

const router = Router();

router.use(authenticate);

// AI rate limiter — stricter for inference endpoints
const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Too many AI requests, please slow down',
    data: null,
    error: { code: 'RATE_LIMIT_EXCEEDED', details: 'AI rate limit exceeded' },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(aiRateLimiter);

// ── Chat ─────────────────────────────────────
router.post('/chat', validate(aiChatSchema), aiController.chat);

// ── Explanation ─────────────────────────────────
router.post('/explain', validate(aiExplainSchema), aiController.explain);

// ── Recommendations & Roadmap ──────────────────
router.get('/recommendations', aiController.getRecommendations);
router.get('/roadmap', aiController.getRoadmap);
router.get('/next-action', aiController.nextAction);
router.get('/daily-mission', aiController.dailyMission);

// ── Conversations ──────────────────────────────
router.get('/conversations', aiController.getConversations);

// ── Livelihood Assessment & Fingerprint ───────
router.post('/assess', aiController.assess);
router.post('/fingerprint', aiController.fingerprint);

// ── Skill Recommendations ──────────────────────
router.post('/recommend-skills', validate(aiRecommendSkillsSchema), aiController.recommendSkills);

// ── Opportunity Discovery ──────────────────────
router.post('/discover', validate(aiDiscoverSchema), aiController.discoverOpportunities);
router.post('/simulate-income', validate(aiSimulateIncomeSchema), aiController.simulateIncome);

// ── Learning ───────────────────────────────────
router.post('/learning-plan', validate(aiLearningPlanSchema), aiController.generateLearningPlan);
router.post('/generate-quiz', validate(aiQuizSchema), aiController.generateQuiz);
router.post('/analyze-assessment', validate(aiAssessmentSchema), aiController.analyzeAssessment);

// ── Business Plan ──────────────────────────────
router.post('/business-plan', validate(aiBusinessPlanSchema), aiController.generateBusinessPlan);

// ── Government Schemes ─────────────────────────
router.post('/match-schemes', aiController.matchSchemes);

// ── Product AI ─────────────────────────────────
router.post('/analyze-product', validate(aiAnalyzeProductSchema), aiController.analyzeProduct);
router.post('/product-catalog', validate(aiProductCatalogSchema), aiController.generateProductCatalog);
router.post('/product-passport', validate(aiProductPassportSchema), aiController.generateProductPassport);

// ── Buyer Matching ───────────────────────────
router.post('/match-buyers', validate(aiMatchBuyersSchema), aiController.matchBuyers);

// ── Voice: Speech-to-Text & Text-to-Speech ─────
router.post('/voice', validate(aiVoiceToTextSchema), aiController.voiceToText);
router.post('/voice/synthesize', validate(aiTextToVoiceSchema), aiController.textToVoice);

export default router;
