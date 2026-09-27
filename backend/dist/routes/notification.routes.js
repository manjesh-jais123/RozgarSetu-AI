"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../controllers/notification.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', (0, validation_1.validate)(validators_1.notificationFiltersSchema), notification_controller_1.notificationController.list);
router.put('/read-all', notification_controller_1.notificationController.markAllRead);
router.put('/:id/read', (0, validation_1.validate)(validators_1.notificationIdSchema), notification_controller_1.notificationController.markRead);
router.delete('/:id', (0, validation_1.validate)(validators_1.notificationIdSchema), notification_controller_1.notificationController.deleteNotification);
exports.default = router;
//# sourceMappingURL=notification.routes.js.map