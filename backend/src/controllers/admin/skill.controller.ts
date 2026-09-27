import { Request, Response } from 'express';
import { User, Skill } from '../../models';
import { asyncHandler, AppError } from '../../middleware/errorHandler';
import { successResponse, createPaginatedResponse } from '../../utils/types';
import { createAuditLog } from '../../middleware/adminAuth';

export const adminSkillController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, category, proficiency, isActive, search } = req.query;

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (proficiency) filter.proficiency = proficiency;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { category: { $regex: search as string, $options: 'i' } },
      ];
    }

    const [skills, total] = await Promise.all([
      Skill.find(filter)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .lean(),
      Skill.countDocuments(filter),
    ]);

    const categories = await Skill.distinct('category', { isActive: true });

    res.json(successResponse('Skills retrieved', {
      skills,
      categories,
      pagination: createPaginatedResponse(skills, total, Number(page), Number(limit)),
    }));
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const skill = await Skill.findById(id).lean();

    if (!skill) {
      throw new AppError('Skill not found', 404, 'SKILL_NOT_FOUND');
    }

    res.json(successResponse('Skill retrieved', skill));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as { user?: { _id: { toString(): string }; phone: string } };
    const admin = authReq.user!;

    const skill = await Skill.create(req.body);

    void createAuditLog(
      admin._id.toString(),
      admin.phone,
      'create',
      'skill',
      skill._id?.toString(),
      { skill: req.body },
      req
    );

    res.status(201).json(successResponse('Skill created', skill));
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authReq = req as { user?: { _id: { toString(): string }; phone: string } };
    const admin = authReq.user!;

    const skill = await Skill.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      throw new AppError('Skill not found', 404, 'SKILL_NOT_FOUND');
    }

    void createAuditLog(
      admin._id.toString(),
      admin.phone,
      'update',
      'skill',
      id,
      { updates: req.body },
      req
    );

    res.json(successResponse('Skill updated', skill));
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authReq = req as { user?: { _id: { toString(): string }; phone: string } };
    const admin = authReq.user!;

    const skill = await Skill.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!skill) {
      throw new AppError('Skill not found', 404, 'SKILL_NOT_FOUND');
    }

    void createAuditLog(
      admin._id.toString(),
      admin.phone,
      'deactivate',
      'skill',
      id,
      {},
      req
    );

    res.json(successResponse('Skill deactivated', skill));
  }),

  getCategories: asyncHandler(async (req: Request, res: Response) => {
    const categories = await Skill.distinct('category', { isActive: true });

    const skillLevels = [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
    ];

    res.json(successResponse('Categories and levels retrieved', { categories, skillLevels }));
  }),
};
