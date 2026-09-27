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
exports.Lesson = exports.LearningPath = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const quizQuestionSchema = new mongoose_1.Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true, min: 0 },
    explanation: { type: String },
});
const quizSchema = new mongoose_1.Schema({
    questions: [quizQuestionSchema],
    passingScore: { type: Number, required: true, min: 0, max: 100, default: 70 },
});
const lessonSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    thumbnail: { type: String, required: true },
    duration: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    order: { type: Number, required: true },
    keyPoints: [{ type: String }],
    quiz: quizSchema,
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
});
const learningPathSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true, index: true },
    estimatedDuration: { type: String, required: true },
    lessons: [lessonSchema],
    progress: { type: Number, default: 0, min: 0, max: 100 },
    thumbnail: { type: String },
    tags: [{ type: String }],
    matchPercentage: { type: Number, default: 0, min: 0, max: 100 },
    isActive: { type: Boolean, default: true, index: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
});
learningPathSchema.index({ category: 1, difficulty: 1 });
learningPathSchema.index({ isActive: 1, createdAt: -1 });
exports.LearningPath = mongoose_1.default.model('LearningPath', learningPathSchema);
exports.Lesson = mongoose_1.default.model('Lesson', lessonSchema);
//# sourceMappingURL=LearningPath.js.map