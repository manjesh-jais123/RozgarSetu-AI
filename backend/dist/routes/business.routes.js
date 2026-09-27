"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const business_controller_1 = require("../controllers/business.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/dashboard', business_controller_1.businessController.getDashboard);
router.get('/plan', business_controller_1.businessController.getPlan);
router.post('/plan', (0, validation_1.validate)(validators_1.createBusinessPlanSchema), business_controller_1.businessController.createPlan);
router.put('/plan', business_controller_1.businessController.updatePlan);
router.get('/ideas', business_controller_1.businessController.getIdeas);
exports.default = router;
//# sourceMappingURL=business.routes.js.map