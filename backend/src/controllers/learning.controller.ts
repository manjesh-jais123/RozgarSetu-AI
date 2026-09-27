import { Request, Response } from 'express';
import { LearningPath, UserProgress } from '../models';
import { IUser } from '../models';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { successResponse, createPaginatedResponse } from '../utils/types';
import { calculateMatchPercentage } from '../utils/helpers';

export const learningController = {
  getPaths: asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, category, difficulty, search, sort = 'createdAt', order = 'desc' } = req.query;

    const filter: Record<string, unknown> = { isActive: true };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$text = { $search: search as string };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortObj: Record<string, 1 | -1> = { [sort as string]: order === 'asc' ? 1 : -1 };

    const [paths, total] = await Promise.all([
      LearningPath.find(filter).sort(sortObj).skip(skip).limit(Number(limit)),
      LearningPath.countDocuments(filter),
    ]);

    res.json(successResponse('Learning paths retrieved', createPaginatedResponse(paths, total, Number(page), Number(limit))));
  }),

  getPath: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const path = await LearningPath.findById(id).lean();

    if (!path) {
      throw new AppError('Learning path not found', 404, 'LEARNING_PATH_NOT_FOUND');
    }

    res.json(successResponse('Learning path retrieved', path));
  }),

  getLesson: asyncHandler(async (req: Request, res: Response) => {
    const { pathId, lessonId } = req.params;
    const path = await LearningPath.findById(pathId).select('lessons');
    if (!path) {
      throw new AppError('Learning path not found', 404, 'LEARNING_PATH_NOT_FOUND');
    }

    const lesson = (path.lessons as any).id(lessonId);
    if (!lesson) {
      throw new AppError('Lesson not found', 404, 'LESSON_NOT_FOUND');
    }

    res.json(successResponse('Lesson retrieved', lesson.toObject()));
  }),

  completeLesson: asyncHandler(async (req: Request, res: Response) => {
    const { pathId, lessonId } = req.params;
    const authReq = req as unknown as { user: IUser };
    const userId = authReq.user._id.toString();

    let progress = await UserProgress.findOne({ userId });
    if (!progress) {
      progress = new UserProgress({ userId, learningPaths: [], lessons: [], overallStats: {} });
    }

    const pathProgress = progress.learningPaths.find(p => p.learningPathId.toString() === pathId);
    if (pathProgress) {
      pathProgress.status = 'in_progress';
      if (!pathProgress.completedLessons.includes(lessonId as any)) {
        pathProgress.completedLessons.push(lessonId as any);
      }
      pathProgress.progress = Math.round((pathProgress.completedLessons.length / 10) * 100);
    }

    const lessonProgress = progress.lessons.find(l => l.lessonId.toString() === lessonId && l.learningPathId.toString() === pathId);
    if (lessonProgress) {
      lessonProgress.status = 'completed';
      lessonProgress.completedAt = new Date();
      lessonProgress.progress = 100;
    } else {
      progress.lessons.push({
        lessonId: lessonId as any,
        learningPathId: pathId as any,
        status: 'completed',
        progress: 100,
        completedAt: new Date(),
        timeSpent: 0,
      });
    }

    await progress.save();

    const path = await LearningPath.findById(pathId).select('lessons._id');
    const lessons = path?.lessons || [];
    const nextLesson = lessons.find((l: any) => !progress?.lessons.some(pl => pl.lessonId.toString() === l._id.toString() && pl.status === 'completed'));

    res.json(successResponse('Lesson completed', {
      nextLessonId: nextLesson?._id.toString(),
    }));
  }),

  submitQuiz: asyncHandler(async (req: Request, res: Response) => {
    const { pathId, lessonId } = req.params;
    const { answers } = req.body;

    const path = await LearningPath.findById(pathId).select('lessons');
    if (!path) {
      throw new AppError('Learning path not found', 404, 'LEARNING_PATH_NOT_FOUND');
    }

    const lesson = (path.lessons as any).id(lessonId);
    if (!lesson || !lesson.quiz) {
      throw new AppError('Quiz not found for this lesson', 404, 'QUIZ_NOT_FOUND');
    }

    let correct = 0;
    const correctAnswers = lesson.quiz.questions.map((q: any) => q.correctAnswer);
    answers.forEach((answer: number, index: number) => {
      if (answer === correctAnswers[index]) correct++;
    });

    const score = Math.round((correct / lesson.quiz.questions.length) * 100);
    const passed = score >= (lesson.quiz.passingScore || 70);

    res.json(successResponse('Quiz submitted', { score, passed, correctAnswers }));
  }),

  getProgress: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const userId = authReq.user._id.toString();

    const progress = await UserProgress.findOne({ userId }).lean();
    if (!progress) {
      res.json(successResponse('Progress retrieved', {}));
      return;
    }

    const progressMap: Record<string, number> = {};
    progress.learningPaths.forEach(p => {
      progressMap[p.learningPathId.toString()] = p.progress;
    });

    res.json(successResponse('Progress retrieved', {
      learningPaths: progressMap,
      overallStats: progress.overallStats,
    }));
  }),

  getRecommendations: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const userId = authReq.user._id.toString();

    const progress = await UserProgress.findOne({ userId }).lean();
    const userSkills = authReq.user.profile?.skills?.map(s => s.name.toLowerCase()) || [];
    const userInterests = authReq.user.profile?.interests?.map(i => i.name.toLowerCase()) || [];

    const paths = await LearningPath.find({ isActive: true }).lean();

    const scored = paths.map((p: any) => {
      const skillMatch = calculateMatchPercentage(userSkills, []);
      const interestMatch = p.tags?.some((tag: string) =>
        userInterests.some((ui: string) => tag.toLowerCase().includes(ui))
      ) ? 20 : 0;
      let progressMatch = 0;
      const existing = progress?.learningPaths?.find(lp => lp.learningPathId.toString() === p._id.toString());
      if (existing && existing.progress === 100) progressMatch = -50;

      const match = Math.min(100, Math.round((p.matchPercentage || 0) * 0.5 + skillMatch * 0.2 + interestMatch + progressMatch));
      return { ...p, matchPercentage: match };
    });

    const recommended = scored
      .filter(p => p.matchPercentage > 40)
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 5);

    res.json(successResponse('Recommended learning paths', recommended));
  }),
};
