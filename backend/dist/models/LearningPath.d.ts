import mongoose, { Document } from 'mongoose';
export interface IQuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
}
export interface IQuiz {
    questions: IQuizQuestion[];
    passingScore: number;
}
export interface ILesson extends Document {
    title: string;
    description: string;
    videoUrl: string;
    thumbnail: string;
    duration: string;
    difficulty: 'easy' | 'medium' | 'hard';
    order: number;
    keyPoints: string[];
    quiz?: IQuiz;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface ILearningPath extends Document {
    title: string;
    description: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedDuration: string;
    lessons: ILesson[];
    progress: number;
    thumbnail?: string;
    tags: string[];
    matchPercentage: number;
    isActive: boolean;
    createdBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const LearningPath: mongoose.Model<ILearningPath, {}, {}, {}, mongoose.Document<unknown, {}, ILearningPath, {}, {}> & ILearningPath & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const Lesson: mongoose.Model<ILesson, {}, {}, {}, mongoose.Document<unknown, {}, ILesson, {}, {}> & ILesson & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=LearningPath.d.ts.map