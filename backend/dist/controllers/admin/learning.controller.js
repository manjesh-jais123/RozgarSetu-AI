"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLearningController = void 0;
const models_1 = require("../../models");
const errorHandler_1 = require("../../middleware/errorHandler");
const types_1 = require("../../utils/types");
const adminAuth_1 = require("../../middleware/adminAuth");
const mongoose_1 = __importDefault(require("mongoose"));
exports.adminLearningController = {
    listPaths: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { page = 1, limit = 10, category, difficulty, isActive, search } = req.query;
        const filter = {};
        if (category)
            filter.category = category;
        if (difficulty)
            filter.difficulty = difficulty;
        if (isActive !== undefined)
            filter.isActive = isActive === 'true';
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }
        const [paths, total] = await Promise.all([
            models_1.LearningPath.find(filter)
                .sort({ createdAt: -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit))
                .lean(),
            models_1.LearningPath.countDocuments(filter),
        ]);
        const categories = await models_1.LearningPath.distinct('category', { isActive: true });
        res.json((0, types_1.successResponse)('Learning paths retrieved', {
            paths,
            categories,
            pagination: (0, types_1.createPaginatedResponse)(paths, total, Number(page), Number(limit)),
        }));
    }),
    getPath: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const path = await models_1.LearningPath.findById(id).lean();
        if (!path) {
            throw new errorHandler_1.AppError('Learning path not found', 404, 'LEARNING_PATH_NOT_FOUND');
        }
        res.json((0, types_1.successResponse)('Learning path retrieved', path));
    }),
    createPath: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const admin = authReq.user;
        const path = await models_1.LearningPath.create({
            ...req.body,
            createdBy: admin._id,
        });
        void (0, adminAuth_1.createAuditLog)(admin._id.toString(), admin.phone, 'create', 'learningPath', path._id?.toString(), { path: req.body }, req);
        res.status(201).json((0, types_1.successResponse)('Learning path created', path));
    }),
    updatePath: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const authReq = req;
        const admin = authReq.user;
        const path = await models_1.LearningPath.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!path) {
            throw new errorHandler_1.AppError('Learning path not found', 404, 'LEARNING_PATH_NOT_FOUND');
        }
        void (0, adminAuth_1.createAuditLog)(admin._id.toString(), admin.phone, 'update', 'learningPath', id, { updates: req.body }, req);
        res.json((0, types_1.successResponse)('Learning path updated', path));
    }),
    deletePath: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const authReq = req;
        const admin = authReq.user;
        const path = await models_1.LearningPath.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!path) {
            throw new errorHandler_1.AppError('Learning path not found', 404, 'LEARNING_PATH_NOT_FOUND');
        }
        void (0, adminAuth_1.createAuditLog)(admin._id.toString(), admin.phone, 'delete', 'learningPath', id, {}, req);
        res.json((0, types_1.successResponse)('Learning path deleted', null));
    }),
    getLessons: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id: pathId } = req.params;
        const path = await models_1.LearningPath.findById(pathId).select('lessons').lean();
        if (!path) {
            throw new errorHandler_1.AppError('Learning path not found', 404, 'LEARNING_PATH_NOT_FOUND');
        }
        res.json((0, types_1.successResponse)('Lessons retrieved', path.lessons));
    }),
    getLesson: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { pathId, lessonId } = req.params;
        const path = await models_1.LearningPath.findById(pathId).select('lessons');
        if (!path) {
            throw new errorHandler_1.AppError('Learning path not found', 404, 'LEARNING_PATH_NOT_FOUND');
        }
        const lesson = path.lessons.id(lessonId);
        if (!lesson) {
            throw new errorHandler_1.AppError('Lesson not found', 404, 'LESSON_NOT_FOUND');
        }
        res.json((0, types_1.successResponse)('Lesson retrieved', lesson.toObject()));
    }),
    updateLesson: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { pathId, lessonId } = req.params;
        const authReq = req;
        const admin = authReq.user;
        const path = await models_1.LearningPath.findById(pathId);
        if (!path) {
            throw new errorHandler_1.AppError('Learning path not found', 404, 'LEARNING_PATH_NOT_FOUND');
        }
        const lesson = path.lessons.id(lessonId);
        if (!lesson) {
            throw new errorHandler_1.AppError('Lesson not found', 404, 'LESSON_NOT_FOUND');
        }
        Object.assign(lesson, req.body);
        await path.save();
        void (0, adminAuth_1.createAuditLog)(admin._id.toString(), admin.phone, 'update', 'lesson', lessonId, { updates: req.body }, req);
        res.json((0, types_1.successResponse)('Lesson updated', lesson));
    }),
    deleteLesson: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { pathId, lessonId } = req.params;
        const authReq = req;
        const admin = authReq.user;
        const path = await models_1.LearningPath.findById(pathId);
        if (!path) {
            throw new errorHandler_1.AppError('Learning path not found', 404, 'LEARNING_PATH_NOT_FOUND');
        }
        const lesson = path.lessons.id(lessonId);
        if (!lesson) {
            throw new errorHandler_1.AppError('Lesson not found', 404, 'LESSON_NOT_FOUND');
        }
        lesson.remove();
        await path.save();
        void (0, adminAuth_1.createAuditLog)(admin._id.toString(), admin.phone, 'delete', 'lesson', lessonId, {}, req);
        res.json((0, types_1.successResponse)('Lesson deleted', null));
    }),
    getProgress: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { page = 1, limit = 10 } = req.query;
        const UserProgress = mongoose_1.default.model('UserProgress');
        const [progress, total] = await Promise.all([
            UserProgress.find({})
                .sort({ createdAt: -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit))
                .populate('userId', 'name phone')
                .lean(),
            UserProgress.countDocuments({}),
        ]);
        res.json((0, types_1.successResponse)('User progress retrieved', (0, types_1.createPaginatedResponse)(progress, total, Number(page), Number(limit))));
    }),
};
//# sourceMappingURL=learning.controller.js.map