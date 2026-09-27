import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import {
  updateProfileSchema,
  updateBasicInfoSchema,
  updateSkillsSchema,
  updateInterestsSchema,
  updateFinancialSchema,
  updateGoalsSchema,
} from '../validators';

const router = Router();

router.use(authenticate);

router.get('/profile', userController.getProfile);
router.put('/profile', validate(updateProfileSchema), userController.updateProfile);
router.put('/profile/basic', validate(updateBasicInfoSchema), userController.updateBasicInfo);
router.put('/profile/skills', validate(updateSkillsSchema), userController.updateSkills);
router.put('/profile/interests', validate(updateInterestsSchema), userController.updateInterests);
router.put('/profile/financial', validate(updateFinancialSchema), userController.updateFinancialInfo);
router.put('/profile/goals', validate(updateGoalsSchema), userController.updateGoals);
router.post('/onboarding/complete', userController.completeOnboarding);
router.delete('/account', userController.deleteAccount);

export default router;
