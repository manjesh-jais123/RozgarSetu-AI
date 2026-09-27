"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.learningController = void 0;
const models_1 = require("../models");
const errorHandler_1 = require("../middleware/errorHandler");
const types_1 = require("../utils/types");
const helpers_1 = require("../utils/helpers");
exports.learningController = {
    getPaths: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { page = 1, limit = 10, category, difficulty, search, sort = 'createdAt', order = 'desc' } = req.query;
        const filter = { isActive: true };
        if (category)
            filter.category = category;
        if (difficulty)
            filter.difficulty = difficulty;
        if (search) {
            filter.$text = { $search: search };
        }
        const skip = (Number(page) - 1) * Number(limit);
        const sortObj = { [sort]: order === 'asc' ? 1 : -1 };
        const [paths, total] = await Promise.all([
            models_1.LearningPath.find(filter).sort(sortObj).skip(skip).limit(Number(limit)),
            models_1.LearningPath.countDocuments(filter),
        ]);
        res.json((0, types_1.successResponse)('Learning paths retrieved', (0, types_1.createPaginatedResponse)(paths, total, Number(page), Number(limit))));
    }),
    getPath: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const path = await models_1.LearningPath.findById(id).lean();
        if (!path) {
            throw new errorHandler_1.AppError('Learning path not found', 404, 'LEARNING_PATH_NOT_FOUND');
        }
        res.json((0, types_1.successResponse)('Learning path retrieved', path));
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
    completeLesson: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { pathId, lessonId } = req.params;
        const authReq = req;
        const userId = authReq.user._id.toString();
        let progress = await models_1.UserProgress.findOne({ userId });
        if (!progress) {
            progress = new models_1.UserProgress({ userId, learningPaths: [], lessons: [], overallStats: {} });
        }
        const pathProgress = progress.learningPaths.find(p => p.learningPathId.toString() === pathId);
        if (pathProgress) {
            pathProgress.status = 'in_progress';
            if (!pathProgress.completedLessons.includes(lessonId)) {
                pathProgress.completedLessons.push(lessonId);
            }
            pathProgress.progress = Math.round((pathProgress.completedLessons.length / 10) * 100);
        }
        const lessonProgress = progress.lessons.find(l => l.lessonId.toString() === lessonId && l.learningPathId.toString() === pathId);
        if (lessonProgress) {
            lessonProgress.status = 'completed';
            lessonProgress.completedAt = new Date();
            lessonProgress.progress = 100;
        }
        else {
            progress.lessons.push({
                lessonId: lessonId,
                learningPathId: pathId,
                status: 'completed',
                progress: 100,
                completedAt: new Date(),
                timeSpent: 0,
            });
        }
        await progress.save();
        const path = await models_1.LearningPath.findById(pathId).select('lessons._id');
        const lessons = path?.lessons || [];
        const nextLesson = lessons.find((l) => !progress?.lessons.some(pl => pl.lessonId.toString() === l._id.toString() && pl.status === 'completed'));
        res.json((0, types_1.successResponse)('Lesson completed', {
            nextLessonId: nextLesson?._id.toString(),
        }));
    }),
    submitQuiz: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { pathId, lessonId } = req.params;
        const { answers } = req.body;
        const path = await models_1.LearningPath.findById(pathId).select('lessons');
        if (!path) {
            throw new errorHandler_1.AppError('Learning path not found', 404, 'LEARNING_PATH_NOT_FOUND');
        }
        const lesson = path.lessons.id(lessonId);
        if (!lesson || !lesson.quiz) {
            throw new errorHandler_1.AppError('Quiz not found for this lesson', 404, 'QUIZ_NOT_FOUND');
        }
        let correct = 0;
        const correctAnswers = lesson.quiz.questions.map((q) => q.correctAnswer);
        answers.forEach((answer, index) => {
            if (answer === correctAnswers[index])
                correct++;
        });
        const score = Math.round((correct / lesson.quiz.questions.length) * 100);
        const passed = score >= (lesson.quiz.passingScore || 70);
        res.json((0, types_1.successResponse)('Quiz submitted', { score, passed, correctAnswers }));
    }),
    getProgress: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const userId = authReq.user._id.toString();
        const progress = await models_1.UserProgress.findOne({ userId }).lean();
        if (!progress) {
            res.json((0, types_1.successResponse)('Progress retrieved', {}));
            return;
        }
        const progressMap = {};
        progress.learningPaths.forEach(p => {
            progressMap[p.learningPathId.toString()] = p.progress;
        });
        res.json((0, types_1.successResponse)('Progress retrieved', {
            learningPaths: progressMap,
            overallStats: progress.overallStats,
        }));
    }),
    getRecommendations: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const userId = authReq.user._id.toString();
        const progress = await models_1.UserProgress.findOne({ userId }).lean();
        const userSkills = authReq.user.profile?.skills?.map(s => s.name.toLowerCase()) || [];
        const userInterests = authReq.user.profile?.interests?.map(i => i.name.toLowerCase()) || [];
        const paths = await models_1.LearningPath.find({ isActive: true }).lean();
        const scored = paths.map((p) => {
            const skillMatch = (0, helpers_1.calculateMatchPercentage)(userSkills, []);
            const interestMatch = p.tags?.some((tag) => userInterests.some((ui) => tag.toLowerCase().includes(ui))) ? 20 : 0;
            let progressMatch = 0;
            const existing = progress?.learningPaths?.find(lp => lp.learningPathId.toString() === p._id.toString());
            if (existing && existing.progress === 100)
                progressMatch = -50;
            const match = Math.min(100, Math.round((p.matchPercentage || 0) * 0.5 + skillMatch * 0.2 + interestMatch + progressMatch));
            return { ...p, matchPercentage: match };
        });
        const recommended = scored
            .filter(p => p.matchPercentage > 40)
            .sort((a, b) => b.matchPercentage - a.matchPercentage)
            .slice(0, 5);
        res.json((0, types_1.successResponse)('Recommended learning paths', recommended));
    }),
};
//# sourceMappingURL=learning.controller.js.map