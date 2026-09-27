import { Router } from 'express';
import { learningController } from '../controllers/learning.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { learningPathFiltersSchema, mongoIdSchema, lessonRouteSchema } from '../validators';

const router = Router();

router.get('/paths', validate(learningPathFiltersSchema), learningController.getPaths);
router.get('/paths/:id', validate(mongoIdSchema), learningController.getPath);
router.get('/paths/:pathId/lessons/:lessonId', validate(lessonRouteSchema), learningController.getLesson);
router.post('/paths/:pathId/lessons/:lessonId/complete', authenticate, validate(lessonRouteSchema), learningController.completeLesson);
router.post('/paths/:pathId/lessons/:lessonId/quiz', authenticate, validate(lessonRouteSchema), learningController.submitQuiz);
router.get('/progress', authenticate, learningController.getProgress);
router.get('/recommendations', authenticate, learningController.getRecommendations);

export default router;
