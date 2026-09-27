import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { auditLog, logAdminAction, adminRateLimiter } from '../middleware/adminAuth';
import { adminAnalyticsController } from '../controllers/admin/analytics.controller';
import { adminUserController } from '../controllers/admin/user.controller';
import { adminSkillController } from '../controllers/admin/skill.controller';
import { adminOpportunityController } from '../controllers/admin/opportunity.controller';
import { adminLearningController } from '../controllers/admin/learning.controller';
import { adminSchemeController } from '../controllers/admin/scheme.controller';
import { adminProductController } from '../controllers/admin/product.controller';
import { adminMarketController } from '../controllers/admin/market.controller';
import { validate } from '../middleware/validation';
import {
  userFiltersSchema,
  updateUserSchema,
  skillFiltersSchema,
  createSkillSchema,
  updateSkillSchema,
  opportunityFiltersSchema,
  createOpportunitySchema,
  updateOpportunitySchema,
  learningPathFiltersSchema,
  createLearningPathSchema,
  updateLearningPathSchema,
  lessonUpdateSchema,
  schemeFiltersSchema,
  createSchemeSchema,
  updateSchemeSchema,
  productFiltersSchema,
  productModerationSchema,
  buyerFiltersSchema,
  createBuyerSchema,
  updateBuyerSchema,
  marketRequestFiltersSchema,
  orderFiltersSchema,
  auditLogFiltersSchema,
  analyticsSchema,
  idParamSchema,
  lessonRouteSchema,
  paginationSchema,
} from '../validators';

const router = Router();

router.use(adminRateLimiter);
router.use(authenticate);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));
router.use(logAdminAction);

router.get('/dashboard', validate(analyticsSchema), adminAnalyticsController.getDashboardStats);
router.get('/analytics/user-growth', auditLog('read', 'analytics'), adminAnalyticsController.getUserGrowth);
router.get('/analytics/ai-stats', auditLog('read', 'analytics'), adminAnalyticsController.getAIGenerationStats);
router.get('/analytics/business', auditLog('read', 'analytics'), adminAnalyticsController.getBusinessAnalytics);

router.get('/users', validate(userFiltersSchema), auditLog('read', 'user'), adminUserController.list);
router.get('/users/:id', validate(idParamSchema), auditLog('read', 'user'), adminUserController.get);
router.put('/users/:id', validate(updateUserSchema), auditLog('update', 'user'), adminUserController.update);
router.patch('/users/:id/suspend', auditLog('suspend', 'user'), adminUserController.suspend);
router.patch('/users/:id/activate', auditLog('activate', 'user'), adminUserController.activate);
router.delete('/users/:id', validate(idParamSchema), auditLog('delete', 'user'), adminUserController.delete);
router.get('/audit-logs', validate(auditLogFiltersSchema), auditLog('read', 'auditLog'), adminUserController.getAuditLogs);

router.get('/skills/categories', auditLog('read', 'skill'), adminSkillController.getCategories);
router.get('/skills', validate(skillFiltersSchema), auditLog('read', 'skill'), adminSkillController.list);
router.get('/skills/:id', validate(idParamSchema), auditLog('read', 'skill'), adminSkillController.get);
router.post('/skills', validate(createSkillSchema), auditLog('create', 'skill'), adminSkillController.create);
router.put('/skills/:id', validate(updateSkillSchema), auditLog('update', 'skill'), adminSkillController.update);
router.delete('/skills/:id', validate(idParamSchema), auditLog('deactivate', 'skill'), adminSkillController.delete);

router.get('/opportunities/categories', auditLog('read', 'opportunity'), adminOpportunityController.categories);
router.get('/opportunities', validate(opportunityFiltersSchema), auditLog('read', 'opportunity'), adminOpportunityController.list);
router.get('/opportunities/:id', validate(idParamSchema), auditLog('read', 'opportunity'), adminOpportunityController.get);
router.post('/opportunities', validate(createOpportunitySchema), auditLog('create', 'opportunity'), adminOpportunityController.create);
router.put('/opportunities/:id', validate(updateOpportunitySchema), auditLog('update', 'opportunity'), adminOpportunityController.update);
router.delete('/opportunities/:id', validate(idParamSchema), auditLog('delete', 'opportunity'), adminOpportunityController.delete);

router.get('/learning/paths', validate(learningPathFiltersSchema), auditLog('read', 'learningPath'), adminLearningController.listPaths);
router.get('/learning/paths/:id', validate(idParamSchema), auditLog('read', 'learningPath'), adminLearningController.getPath);
router.post('/learning/paths', validate(createLearningPathSchema), auditLog('create', 'learningPath'), adminLearningController.createPath);
router.put('/learning/paths/:id', validate(updateLearningPathSchema), auditLog('update', 'learningPath'), adminLearningController.updatePath);
router.delete('/learning/paths/:id', validate(idParamSchema), auditLog('delete', 'learningPath'), adminLearningController.deletePath);
router.get('/learning/paths/:pathId/lessons', validate(idParamSchema), auditLog('read', 'lesson'), adminLearningController.getLessons);
router.get('/learning/paths/:pathId/lessons/:lessonId', validate(lessonRouteSchema), auditLog('read', 'lesson'), adminLearningController.getLesson);
router.patch('/learning/paths/:pathId/lessons/:lessonId', validate(lessonUpdateSchema), auditLog('update', 'lesson'), adminLearningController.updateLesson);
router.get('/learning/progress', auditLog('read', 'learning'), adminLearningController.getProgress);

router.get('/schemes/categories', auditLog('read', 'scheme'), adminSchemeController.list);
router.get('/schemes', validate(schemeFiltersSchema), auditLog('read', 'scheme'), adminSchemeController.list);
router.get('/schemes/:id', validate(idParamSchema), auditLog('read', 'scheme'), adminSchemeController.get);
router.post('/schemes', validate(createSchemeSchema), auditLog('create', 'scheme'), adminSchemeController.create);
router.put('/schemes/:id', validate(updateSchemeSchema), auditLog('update', 'scheme'), adminSchemeController.update);
router.delete('/schemes/:id', validate(idParamSchema), auditLog('delete', 'scheme'), adminSchemeController.delete);
router.patch('/schemes/:id/verify', validate(idParamSchema), auditLog('verify', 'scheme'), adminSchemeController.verify);

router.get('/products/categories', auditLog('read', 'product'), adminProductController.categories);
router.get('/products', validate(productFiltersSchema), auditLog('read', 'product'), adminProductController.list);
router.get('/products/:id', validate(idParamSchema), auditLog('read', 'product'), adminProductController.get);
router.patch('/products/:id/moderate', auditLog('read', 'product'), adminProductController.moderate);
router.put('/products/:id', validate(idParamSchema), auditLog('update', 'product'), adminProductController.update);
router.delete('/products/:id', validate(idParamSchema), auditLog('delete', 'product'), adminProductController.delete);

router.get('/market/buyers', validate(buyerFiltersSchema), auditLog('read', 'buyer'), adminMarketController.listBuyers);
router.get('/market/buyers/:id', validate(idParamSchema), auditLog('read', 'buyer'), adminMarketController.getBuyer);
router.post('/market/buyers', validate(createBuyerSchema), auditLog('create', 'buyer'), adminMarketController.createBuyer);
router.put('/market/buyers/:id', validate(updateBuyerSchema), auditLog('update', 'buyer'), adminMarketController.updateBuyer);
router.delete('/market/buyers/:id', validate(idParamSchema), auditLog('delete', 'buyer'), adminMarketController.deleteBuyer);
router.get('/market/orders', validate(orderFiltersSchema), auditLog('read', 'order'), adminMarketController.listOrders);
router.get('/market/orders/:id', validate(idParamSchema), auditLog('read', 'order'), adminMarketController.getOrder);
router.patch('/market/orders/:id/status', validate(idParamSchema), auditLog('update', 'order'), adminMarketController.updateOrderStatus);
router.get('/market/requests', validate(marketRequestFiltersSchema), auditLog('read', 'marketRequest'), adminMarketController.listRequests);
router.patch('/market/requests/:id', validate(idParamSchema), auditLog('update', 'marketRequest'), adminMarketController.updateRequest);
router.get('/funding/applications', validate(paginationSchema), auditLog('read', 'fundingApplication'), adminMarketController.getFundingApplications);
router.patch('/funding/applications/:id', validate(idParamSchema), auditLog('update', 'fundingApplication'), adminMarketController.updateFundingApplication);

export default router;
