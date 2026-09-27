import { Request, Response } from 'express';
import { Scheme, IScheme } from '../../models';
import { asyncHandler, AppError } from '../../middleware/errorHandler';
import { successResponse, createPaginatedResponse } from '../../utils/types';
import { createAuditLog } from '../../middleware/adminAuth';
import { emitSocketEvent } from '../../services/socketEvents';

export const adminSchemeController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, category, isVerified, isActive, state, search } = req.query;

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (isVerified !== undefined) filter.isVerified = isVerified === 'true';
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (state) filter.stateAvailability = state;
    if (search) filter.$text = { $search: search as string };

    const [schemes, total] = await Promise.all([
      Scheme.find(filter)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .lean(),
      Scheme.countDocuments(filter),
    ]);

    const categories = await Scheme.distinct('category', { isActive: true });

    res.json(successResponse('Schemes retrieved', {
      schemes,
      categories,
      pagination: createPaginatedResponse(schemes, total, Number(page), Number(limit)),
    }));
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const scheme = await Scheme.findById(id).lean();

    if (!scheme) {
      throw new AppError('Scheme not found', 404, 'SCHEME_NOT_FOUND');
    }

    res.json(successResponse('Scheme retrieved', scheme));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as { user?: { _id: { toString(): string }; phone: string } };
    const admin = authReq.user!;

    const scheme = await Scheme.create({
      ...req.body,
      createdBy: admin._id,
      lastVerified: req.body.isVerified ? new Date() : null,
    });

    void createAuditLog(
      admin._id.toString(),
      admin.phone,
      'create',
      'scheme',
      scheme._id?.toString(),
      { scheme: req.body },
      req
    );

    res.status(201).json(successResponse('Scheme created', scheme));

    void emitSocketEvent.scheme_updated(req, {
      action: 'created',
      schemeId: scheme._id,
      name: scheme.name,
      isVerified: scheme.isVerified,
      isActive: scheme.isActive,
    });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authReq = req as { user?: { _id: { toString(): string }; phone: string } };
    const admin = authReq.user!;

    const updates: Record<string, unknown> = { ...req.body };
    if (updates.isVerified === true && !updates.lastVerified) {
      updates.lastVerified = new Date();
    }

    const scheme = await Scheme.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!scheme) {
      throw new AppError('Scheme not found', 404, 'SCHEME_NOT_FOUND');
    }

    void createAuditLog(
      admin._id.toString(),
      admin.phone,
      'update',
      'scheme',
      id,
      { updates: req.body },
      req
    );

    res.json(successResponse('Scheme updated', scheme));

    void emitSocketEvent.scheme_updated(req, {
      action: 'updated',
      schemeId: scheme._id,
      name: scheme.name,
      isVerified: scheme.isVerified,
      isActive: scheme.isActive,
    });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authReq = req as { user?: { _id: { toString(): string }; phone: string } };
    const admin = authReq.user!;

    const scheme = await Scheme.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!scheme) {
      throw new AppError('Scheme not found', 404, 'SCHEME_NOT_FOUND');
    }

    void createAuditLog(
      admin._id.toString(),
      admin.phone,
      'delete',
      'scheme',
      id,
      {},
      req
    );

    res.json(successResponse('Scheme deleted', null));
  }),

  verify: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authReq = req as { user?: { _id: { toString(): string }; phone: string } };
    const admin = authReq.user!;

    const scheme = await Scheme.findByIdAndUpdate(
      id,
      { isVerified: true, lastVerified: new Date() },
      { new: true }
    );

    if (!scheme) {
      throw new AppError('Scheme not found', 404, 'SCHEME_NOT_FOUND');
    }

    void createAuditLog(
      admin._id.toString(),
      admin.phone,
      'verify',
      'scheme',
      id,
      {},
      req
    );

    res.json(successResponse('Scheme verified', scheme));

    void emitSocketEvent.scheme_updated(req, {
      action: 'verified',
      schemeId: scheme._id,
      name: scheme.name,
      isVerified: scheme.isVerified,
      isActive: scheme.isActive,
    });
  }),
};
