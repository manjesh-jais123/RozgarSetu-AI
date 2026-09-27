import { Router } from 'express';
import { schemeController } from '../controllers/scheme.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { schemeFiltersSchema, mongoIdSchema } from '../validators';

const router = Router();

router.get('/', validate(schemeFiltersSchema), schemeController.list);
router.get('/categories', schemeController.categories);
router.get('/:id', validate(mongoIdSchema), schemeController.get);
router.get('/:id/eligibility', authenticate, validate(mongoIdSchema), schemeController.checkEligibility);
router.post('/:id/apply', authenticate, validate(mongoIdSchema), schemeController.apply);

export default router;
