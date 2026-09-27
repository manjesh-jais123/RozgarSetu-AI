"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const learning_controller_1 = require("../controllers/learning.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
router.get('/paths', (0, validation_1.validate)(validators_1.learningPathFiltersSchema), learning_controller_1.learningController.getPaths);
router.get('/paths/:id', (0, validation_1.validate)(validators_1.mongoIdSchema), learning_controller_1.learningController.getPath);
router.get('/paths/:pathId/lessons/:lessonId', (0, validation_1.validate)(validators_1.lessonRouteSchema), learning_controller_1.learningController.getLesson);
router.post('/paths/:pathId/lessons/:lessonId/complete', auth_1.authenticate, (0, validation_1.validate)(validators_1.lessonRouteSchema), learning_controller_1.learningController.completeLesson);
router.post('/paths/:pathId/lessons/:lessonId/quiz', auth_1.authenticate, (0, validation_1.validate)(validators_1.lessonRouteSchema), learning_controller_1.learningController.submitQuiz);
router.get('/progress', auth_1.authenticate, learning_controller_1.learningController.getProgress);
router.get('/recommendations', auth_1.authenticate, learning_controller_1.learningController.getRecommendations);
exports.default = router;
//# sourceMappingURL=learning.routes.js.map