import mongoose, { Document, Schema } from 'mongoose';

export interface ILessonProgress {
  lessonId: mongoose.Types.ObjectId;
  learningPathId: mongoose.Types.ObjectId;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  completedAt?: Date;
  quizScore?: number;
  quizPassed?: boolean;
  timeSpent: number;
}

export interface ILearningPathProgress {
  learningPathId: mongoose.Types.ObjectId;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  currentLessonId?: mongoose.Types.ObjectId;
  completedLessons: mongoose.Types.ObjectId[];
  startedAt?: Date;
  completedAt?: Date;
  totalTimeSpent: number;
}

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  learningPaths: ILearningPathProgress[];
  lessons: ILessonProgress[];
  overallStats: {
    totalLessonsCompleted: number;
    totalTimeSpent: number;
    averageQuizScore: number;
    learningPathsCompleted: number;
    currentStreak: number;
    longestStreak: number;
    lastActiveDate?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const lessonProgressSchema = new Schema<ILessonProgress>({
  lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
  learningPathId: { type: Schema.Types.ObjectId, ref: 'LearningPath', required: true },
  status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  completedAt: { type: Date },
  quizScore: { type: Number, min: 0, max: 100 },
  quizPassed: { type: Boolean },
  timeSpent: { type: Number, default: 0 },
});

const learningPathProgressSchema = new Schema<ILearningPathProgress>({
  learningPathId: { type: Schema.Types.ObjectId, ref: 'LearningPath', required: true },
  status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  currentLessonId: { type: Schema.Types.ObjectId, ref: 'Lesson' },
  completedLessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
  startedAt: { type: Date },
  completedAt: { type: Date },
  totalTimeSpent: { type: Number, default: 0 },
});

const overallStatsSchema = new Schema({
  totalLessonsCompleted: { type: Number, default: 0 },
  totalTimeSpent: { type: Number, default: 0 },
  averageQuizScore: { type: Number, default: 0 },
  learningPathsCompleted: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActiveDate: { type: Date },
});

const userProgressSchema = new Schema<IUserProgress>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  learningPaths: [learningPathProgressSchema],
  lessons: [lessonProgressSchema],
  overallStats: overallStatsSchema,
}, {
  timestamps: true,
});

export const UserProgress = mongoose.model<IUserProgress>('UserProgress', userProgressSchema);