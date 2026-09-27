import { Request, Response } from 'express';
import { LearningPath, ILearningPath, ILesson } from '../../models';
import { asyncHandler, AppError } from '../../middleware/errorHandler';
import { successResponse, createPaginatedResponse } from '../../utils/types';
import { createAuditLog } from '../../middleware/adminAuth';
import mongoose from 'mongoose';
import { emitSocketEvent } from '../../services/socketEvents';

export const adminLearningController = {
  listPaths: asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, category, difficulty, isActive, search } = req.query;

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
      ];
    }

    const [paths, total] = await Promise.all([
      LearningPath.find(filter)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .lean(),
      LearningPath.countDocuments(filter),
    ]);

    const categories = await LearningPath.distinct('category', { isActive: true });

    res.json(successResponse('Learning paths retrieved', {
      paths,
      categories,
      pagination: createPaginatedResponse(paths, total, Number(page), Number(limit)),
    }));
  }),

  getPath: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const path = await LearningPath.findById(id).lean();

    if (!path) {
      throw new AppError('Learning path not found', 404, 'LEARNING_PATH_NOT_FOUND');
    }

    res.json(successResponse('Learning path retrieved', path));
  }),

  createPath: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as { user?: { _id: { toString(): string }; phone: string } };
    const admin = authReq.user!;

    const path = await LearningPath.create({
      ...req.body,
      createdBy: admin._id,
    });

    void createAuditLog(
      admin._id.toString(),
      admin.phone,
      'create',
      'learningPath',
      path._id?.toString(),
      { path: req.body },
      req
    );

    res.status(201).json(successResponse('Learning path created', path));

    void emitSocketEvent.learning_content_updated(req, {
      action: 'created',
      pathId: path._id,
      title: path.title,
      category: path.category,
      difficulty: path.difficulty,
    });
  }),

  updatePath: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authReq = req as { user?: { _id: { toString(): string }; phone: string } };
    const admin = authReq.user!;

    const path = await LearningPath.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!path) {
      throw new AppError('Learning path not found', 404, 'LEARNING_PATH_NOT_FOUND');
    }

    void createAuditLog(
      admin._id.toString(),
      admin.phone,
      'update',
      'learningPath',
      id,
      { updates: req.body },
      req
    );

    res.json(successResponse('Learning path updated', path));

    void emitSocketEvent.learning_content_updated(req, {
      action: 'updated',
      pathId: path._id,
      title: path.title,
      category: path.category,
      difficulty: path.difficulty,
    });
  }),

  deletePath: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authReq = req as { user?: { _id: { toString(): string }; phone: string } };
    const admin = authReq.user!;

    const path = await LearningPath.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!path) {
      throw new AppError('Learning path not found', 404, 'LEARNING_PATH_NOT_FOUND');
    }

    void createAuditLog(
      admin._id.toString(),
      admin.phone,
      'delete',
      'learningPath',
      id,
      {},
      req
    );

    res.json(successResponse('Learning path deleted', null));
  }),

  getLessons: asyncHandler(async (req: Request, res: Response) => {
    const { id: pathId } = req.params;
    const path = await LearningPath.findById(pathId).select('lessons').lean();

    if (!path) {
      throw new AppError('Learning path not found', 404, 'LEARNING_PATH_NOT_FOUND');
    }

    res.json(successResponse('Lessons retrieved', path.lessons));
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

  updateLesson: asyncHandler(async (req: Request, res: Response) => {
    const { pathId, lessonId } = req.params;
    const authReq = req as { user?: { _id: { toString(): string }; phone: string } };
    const admin = authReq.user!;

    const path = await LearningPath.findById(pathId);
    if (!path) {
      throw new AppError('Learning path not found', 404, 'LEARNING_PATH_NOT_FOUND');
    }

    const lesson = (path.lessons as any).id(lessonId);
    if (!lesson) {
      throw new AppError('Lesson not found', 404, 'LESSON_NOT_FOUND');
    }

    Object.assign(lesson, req.body);
    await path.save();

    void createAuditLog(
      admin._id.toString(),
      admin.phone,
      'update',
      'lesson',
      lessonId,
      { updates: req.body },
      req
    );

    res.json(successResponse('Lesson updated', lesson));
  }),

  deleteLesson: asyncHandler(async (req: Request, res: Response) => {
    const { pathId, lessonId } = req.params;
    const authReq = req as { user?: { _id: { toString(): string }; phone: string } };
    const admin = authReq.user!;

    const path = await LearningPath.findById(pathId);
    if (!path) {
      throw new AppError('Learning path not found', 404, 'LEARNING_PATH_NOT_FOUND');
    }

    const lesson = (path.lessons as any).id(lessonId);
    if (!lesson) {
      throw new AppError('Lesson not found', 404, 'LESSON_NOT_FOUND');
    }

    (lesson as any).remove();
    await path.save();

    void createAuditLog(
      admin._id.toString(),
      admin.phone,
      'delete',
      'lesson',
      lessonId,
      {},
      req
    );

    res.json(successResponse('Lesson deleted', null));
  }),

  getProgress: asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const UserProgress = mongoose.model('UserProgress');

    const [progress, total] = await Promise.all([
      UserProgress.find({})
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .populate('userId', 'name phone')
        .lean(),
      UserProgress.countDocuments({}),
    ]);

    res.json(successResponse('User progress retrieved', createPaginatedResponse(progress, total, Number(page), Number(limit))));
  }),
};
