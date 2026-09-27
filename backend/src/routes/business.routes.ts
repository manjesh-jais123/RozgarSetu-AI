import { Router } from 'express';
import { businessController } from '../controllers/business.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createBusinessPlanSchema } from '../validators';

const router = Router();

router.use(authenticate);

router.get('/dashboard', businessController.getDashboard);
router.get('/plan', businessController.getPlan);
router.post('/plan', validate(createBusinessPlanSchema), businessController.createPlan);
router.put('/plan', businessController.updatePlan);
router.get('/ideas', businessController.getIdeas);

export default router;
