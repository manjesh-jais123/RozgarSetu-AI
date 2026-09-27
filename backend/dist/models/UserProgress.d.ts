import mongoose, { Document } from 'mongoose';
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
export declare const UserProgress: mongoose.Model<IUserProgress, {}, {}, {}, mongoose.Document<unknown, {}, IUserProgress, {}, {}> & IUserProgress & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=UserProgress.d.ts.map