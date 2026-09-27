import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { productFiltersSchema, mongoIdSchema, createProductSchema, updateProductSchema } from '../validators';

const router = Router();

router.get('/', authenticate, validate(productFiltersSchema), productController.list);
router.get('/my', authenticate, productController.myProducts);
router.get('/:id', authenticate, validate(mongoIdSchema), productController.get);
router.post('/', authenticate, validate(createProductSchema), productController.create);
router.put('/:id', authenticate, validate(mongoIdSchema), validate(updateProductSchema), productController.update);
router.delete('/:id', authenticate, validate(mongoIdSchema), productController.delete);

export default router;
