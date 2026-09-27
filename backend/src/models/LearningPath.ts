import mongoose, { Document, Schema } from 'mongoose';

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

const quizQuestionSchema = new Schema<IQuizQuestion>({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true, min: 0 },
  explanation: { type: String },
});

const quizSchema = new Schema<IQuiz>({
  questions: [quizQuestionSchema],
  passingScore: { type: Number, required: true, min: 0, max: 100, default: 70 },
});

const lessonSchema = new Schema<ILesson>({
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

const learningPathSchema = new Schema<ILearningPath>({
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
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});

learningPathSchema.index({ category: 1, difficulty: 1 });
learningPathSchema.index({ isActive: 1, createdAt: -1 });

export const LearningPath = mongoose.model<ILearningPath>('LearningPath', learningPathSchema);
export const Lesson = mongoose.model<ILesson>('Lesson', lessonSchema);