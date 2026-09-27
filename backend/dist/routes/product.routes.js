"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, (0, validation_1.validate)(validators_1.productFiltersSchema), product_controller_1.productController.list);
router.get('/my', auth_1.authenticate, product_controller_1.productController.myProducts);
router.get('/:id', auth_1.authenticate, (0, validation_1.validate)(validators_1.mongoIdSchema), product_controller_1.productController.get);
router.post('/', auth_1.authenticate, (0, validation_1.validate)(validators_1.createProductSchema), product_controller_1.productController.create);
router.put('/:id', auth_1.authenticate, (0, validation_1.validate)(validators_1.mongoIdSchema), (0, validation_1.validate)(validators_1.updateProductSchema), product_controller_1.productController.update);
router.delete('/:id', auth_1.authenticate, (0, validation_1.validate)(validators_1.mongoIdSchema), product_controller_1.productController.delete);
exports.default = router;
//# sourceMappingURL=product.routes.js.map