"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const opportunity_controller_1 = require("../controllers/opportunity.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
router.get('/', auth_1.optionalAuth, (0, validation_1.validate)(validators_1.opportunityFiltersSchema), opportunity_controller_1.opportunityController.list);
router.get('/categories', opportunity_controller_1.opportunityController.categories);
router.get('/recommendations', auth_1.authenticate, opportunity_controller_1.opportunityController.recommend);
router.get('/filter', auth_1.optionalAuth, opportunity_controller_1.opportunityController.filter);
router.get('/:id', auth_1.optionalAuth, (0, validation_1.validate)(validators_1.mongoIdSchema), opportunity_controller_1.opportunityController.get);
router.post('/', auth_1.authenticate, opportunity_controller_1.opportunityController.create);
router.put('/:id', auth_1.authenticate, (0, validation_1.validate)(validators_1.mongoIdSchema), opportunity_controller_1.opportunityController.update);
router.delete('/:id', auth_1.authenticate, (0, validation_1.validate)(validators_1.mongoIdSchema), opportunity_controller_1.opportunityController.delete);
exports.default = router;
//# sourceMappingURL=opportunity.routes.js.map