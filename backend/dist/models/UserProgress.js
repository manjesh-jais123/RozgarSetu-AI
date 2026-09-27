"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProgress = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const lessonProgressSchema = new mongoose_1.Schema({
    lessonId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    learningPathId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'LearningPath', required: true },
    status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completedAt: { type: Date },
    quizScore: { type: Number, min: 0, max: 100 },
    quizPassed: { type: Boolean },
    timeSpent: { type: Number, default: 0 },
});
const learningPathProgressSchema = new mongoose_1.Schema({
    learningPathId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'LearningPath', required: true },
    status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    currentLessonId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Lesson' },
    completedLessons: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Lesson' }],
    startedAt: { type: Date },
    completedAt: { type: Date },
    totalTimeSpent: { type: Number, default: 0 },
});
const overallStatsSchema = new mongoose_1.Schema({
    totalLessonsCompleted: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 },
    averageQuizScore: { type: Number, default: 0 },
    learningPathsCompleted: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
});
const userProgressSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    learningPaths: [learningPathProgressSchema],
    lessons: [lessonProgressSchema],
    overallStats: overallStatsSchema,
}, {
    timestamps: true,
});
exports.UserProgress = mongoose_1.default.model('UserProgress', userProgressSchema);
//# sourceMappingURL=UserProgress.js.map