"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_controller_1 = require("../controllers/ai.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const express_rate_limit_1 = require("express-rate-limit");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
// AI rate limiter — stricter for inference endpoints
const aiRateLimiter = (0, express_rate_limit_1.rateLimit)({
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
router.post('/chat', (0, validation_1.validate)(validators_1.aiChatSchema), ai_controller_1.aiController.chat);
// ── Explanation ─────────────────────────────────
router.post('/explain', (0, validation_1.validate)(validators_1.aiExplainSchema), ai_controller_1.aiController.explain);
// ── Recommendations & Roadmap ──────────────────
router.get('/recommendations', ai_controller_1.aiController.getRecommendations);
router.get('/roadmap', ai_controller_1.aiController.getRoadmap);
router.get('/next-action', ai_controller_1.aiController.nextAction);
router.get('/daily-mission', ai_controller_1.aiController.dailyMission);
// ── Conversations ──────────────────────────────
router.get('/conversations', ai_controller_1.aiController.getConversations);
// ── Livelihood Assessment & Fingerprint ───────
router.post('/assess', ai_controller_1.aiController.assess);
router.post('/fingerprint', ai_controller_1.aiController.fingerprint);
// ── Skill Recommendations ──────────────────────
router.post('/recommend-skills', (0, validation_1.validate)(validators_1.aiRecommendSkillsSchema), ai_controller_1.aiController.recommendSkills);
// ── Opportunity Discovery ──────────────────────
router.post('/discover', (0, validation_1.validate)(validators_1.aiDiscoverSchema), ai_controller_1.aiController.discoverOpportunities);
router.post('/simulate-income', (0, validation_1.validate)(validators_1.aiSimulateIncomeSchema), ai_controller_1.aiController.simulateIncome);
// ── Learning ───────────────────────────────────
router.post('/learning-plan', (0, validation_1.validate)(validators_1.aiLearningPlanSchema), ai_controller_1.aiController.generateLearningPlan);
router.post('/generate-quiz', (0, validation_1.validate)(validators_1.aiQuizSchema), ai_controller_1.aiController.generateQuiz);
router.post('/analyze-assessment', (0, validation_1.validate)(validators_1.aiAssessmentSchema), ai_controller_1.aiController.analyzeAssessment);
// ── Business Plan ──────────────────────────────
router.post('/business-plan', (0, validation_1.validate)(validators_1.aiBusinessPlanSchema), ai_controller_1.aiController.generateBusinessPlan);
// ── Government Schemes ─────────────────────────
router.post('/match-schemes', ai_controller_1.aiController.matchSchemes);
// ── Product AI ─────────────────────────────────
router.post('/analyze-product', (0, validation_1.validate)(validators_1.aiAnalyzeProductSchema), ai_controller_1.aiController.analyzeProduct);
router.post('/product-catalog', (0, validation_1.validate)(validators_1.aiProductCatalogSchema), ai_controller_1.aiController.generateProductCatalog);
router.post('/product-passport', (0, validation_1.validate)(validators_1.aiProductPassportSchema), ai_controller_1.aiController.generateProductPassport);
// ── Buyer Matching ───────────────────────────
router.post('/match-buyers', (0, validation_1.validate)(validators_1.aiMatchBuyersSchema), ai_controller_1.aiController.matchBuyers);
// ── Voice: Speech-to-Text & Text-to-Speech ─────
router.post('/voice', (0, validation_1.validate)(validators_1.aiVoiceToTextSchema), ai_controller_1.aiController.voiceToText);
router.post('/voice/synthesize', (0, validation_1.validate)(validators_1.aiTextToVoiceSchema), ai_controller_1.aiController.textToVoice);
exports.default = router;
//# sourceMappingURL=ai.routes.js.map