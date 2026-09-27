"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scheme_controller_1 = require("../controllers/scheme.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
router.get('/', (0, validation_1.validate)(validators_1.schemeFiltersSchema), scheme_controller_1.schemeController.list);
router.get('/categories', scheme_controller_1.schemeController.categories);
router.get('/:id', (0, validation_1.validate)(validators_1.mongoIdSchema), scheme_controller_1.schemeController.get);
router.get('/:id/eligibility', auth_1.authenticate, (0, validation_1.validate)(validators_1.mongoIdSchema), scheme_controller_1.schemeController.checkEligibility);
router.post('/:id/apply', auth_1.authenticate, (0, validation_1.validate)(validators_1.mongoIdSchema), scheme_controller_1.schemeController.apply);
exports.default = router;
//# sourceMappingURL=scheme.routes.js.map