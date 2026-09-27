import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { notificationFiltersSchema, notificationIdSchema } from '../validators';

const router = Router();

router.use(authenticate);

router.get('/', validate(notificationFiltersSchema), notificationController.list);
router.put('/read-all', notificationController.markAllRead);
router.put('/:id/read', validate(notificationIdSchema), notificationController.markRead);
router.delete('/:id', validate(notificationIdSchema), notificationController.deleteNotification);

export default router;
