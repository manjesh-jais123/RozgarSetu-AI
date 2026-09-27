import { Request, Response } from 'express';
import { Opportunity } from '../../models';
import { asyncHandler, AppError } from '../../middleware/errorHandler';
import { successResponse, createPaginatedResponse } from '../../utils/types';
import { createAuditLog } from '../../middleware/adminAuth';

export const adminOpportunityController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, category, difficulty, isActive, search, sort = 'createdAt', order = 'desc' } = req.query;

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
        { tags: { $regex: search as string, $options: 'i' } },
      ];
    }

    const sortBy: Record<string, 1 | -1> = { [sort as string]: order === 'asc' ? 1 : -1 };

    const [opportunities, total] = await Promise.all([
      Opportunity.find(filter)
        .sort(sortBy)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .lean(),
      Opportunity.countDocuments(filter),
    ]);

    res.json(successResponse('Opportunities retrieved', createPaginatedResponse(opportunities, total, Number(page), Number(limit))));
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const opportunity = await Opportunity.findById(id).lean();

    if (!opportunity) {
      throw new AppError('Opportunity not found', 404, 'OPPORTUNITY_NOT_FOUND');
    }

    res.json(successResponse('Opportunity retrieved', opportunity));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as { user?: { _id: { toString(): string }; phone: string } };
    const admin = authReq.user!;

    const opportunity = await Opportunity.create({
      ...req.body,
      createdBy: authReq.user?._id,
    });

    void createAuditLog(
      admin._id.toString(),
      admin.phone,
      'create',
      'opportunity',
      opportunity._id?.toString(),
      { opportunity: req.body },
      req
    );

    res.status(201).json(successResponse('Opportunity created', opportunity));
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authReq = req as { user?: { _id: { toString(): string }; phone: string } };
    const admin = authReq.user!;

    const opportunity = await Opportunity.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!opportunity) {
      throw new AppError('Opportunity not found', 404, 'OPPORTUNITY_NOT_FOUND');
    }

    void createAuditLog(
      admin._id.toString(),
      admin.phone,
      'update',
      'opportunity',
      id,
      { updates: req.body },
      req
    );

    res.json(successResponse('Opportunity updated', opportunity));
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authReq = req as { user?: { _id: { toString(): string }; phone: string } };
    const admin = authReq.user!;

    const opportunity = await Opportunity.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!opportunity) {
      throw new AppError('Opportunity not found', 404, 'OPPORTUNITY_NOT_FOUND');
    }

    void createAuditLog(
      admin._id.toString(),
      admin.phone,
      'delete',
      'opportunity',
      id,
      {},
      req
    );

    res.json(successResponse('Opportunity deleted', null));
  }),

  categories: asyncHandler(async (_req: Request, res: Response) => {
    const categories = await Opportunity.distinct('category', { isActive: true });
    res.json(successResponse('Categories retrieved', categories));
  }),
};
