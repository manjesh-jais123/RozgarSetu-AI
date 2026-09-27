import { Router } from 'express';
import { marketController } from '../controllers/market.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { buyerFiltersSchema, mongoIdSchema, createOrderSchema, createMarketRequestSchema } from '../validators';

const router = Router();

router.get('/buyers', validate(buyerFiltersSchema), marketController.getBuyers);
router.get('/buyers/:id', validate(mongoIdSchema), marketController.getBuyer);
router.post('/buyers/:id/connect', authenticate, validate(mongoIdSchema), marketController.connectWithBuyer);
router.post('/rfq', authenticate, validate(createMarketRequestSchema), marketController.submitRfq);
router.post('/orders', authenticate, validate(createOrderSchema), marketController.createOrder);
router.get('/orders', authenticate, marketController.listOrders);
router.get('/orders/:id', authenticate, validate(mongoIdSchema), marketController.getOrder);
router.get('/requests', authenticate, marketController.listRequests);

export default router;
