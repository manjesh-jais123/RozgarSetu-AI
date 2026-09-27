"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const market_controller_1 = require("../controllers/market.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
router.get('/buyers', (0, validation_1.validate)(validators_1.buyerFiltersSchema), market_controller_1.marketController.getBuyers);
router.get('/buyers/:id', (0, validation_1.validate)(validators_1.mongoIdSchema), market_controller_1.marketController.getBuyer);
router.post('/buyers/:id/connect', auth_1.authenticate, (0, validation_1.validate)(validators_1.mongoIdSchema), market_controller_1.marketController.connectWithBuyer);
router.post('/rfq', auth_1.authenticate, (0, validation_1.validate)(validators_1.createMarketRequestSchema), market_controller_1.marketController.submitRfq);
router.post('/orders', auth_1.authenticate, (0, validation_1.validate)(validators_1.createOrderSchema), market_controller_1.marketController.createOrder);
router.get('/orders', auth_1.authenticate, market_controller_1.marketController.listOrders);
router.get('/orders/:id', auth_1.authenticate, (0, validation_1.validate)(validators_1.mongoIdSchema), market_controller_1.marketController.getOrder);
router.get('/requests', auth_1.authenticate, market_controller_1.marketController.listRequests);
exports.default = router;
//# sourceMappingURL=market.routes.js.map