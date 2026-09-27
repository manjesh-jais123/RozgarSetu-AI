import { Router } from 'express';
import { opportunityController } from '../controllers/opportunity.controller';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { opportunityFiltersSchema, mongoIdSchema } from '../validators';

const router = Router();

router.get('/', optionalAuth, validate(opportunityFiltersSchema), opportunityController.list);
router.get('/categories', opportunityController.categories);
router.get('/recommendations', authenticate, opportunityController.recommend);
router.get('/filter', optionalAuth, opportunityController.filter);
router.get('/:id', optionalAuth, validate(mongoIdSchema), opportunityController.get);
router.post('/', authenticate, opportunityController.create);
router.put('/:id', authenticate, validate(mongoIdSchema), opportunityController.update);
router.delete('/:id', authenticate, validate(mongoIdSchema), opportunityController.delete);

export default router;
