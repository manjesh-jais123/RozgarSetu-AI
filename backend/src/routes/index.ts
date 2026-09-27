import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import opportunityRoutes from './opportunity.routes';
import learningRoutes from './learning.routes';
import schemeRoutes from './scheme.routes';
import productRoutes from './product.routes';
import marketRoutes from './market.routes';
import businessRoutes from './business.routes';
import aiRoutes from './ai.routes';
import notificationRoutes from './notification.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/opportunities', opportunityRoutes);
router.use('/learning', learningRoutes);
router.use('/schemes', schemeRoutes);
router.use('/products', productRoutes);
router.use('/market', marketRoutes);
router.use('/business', businessRoutes);
router.use('/ai', aiRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

export default router;
