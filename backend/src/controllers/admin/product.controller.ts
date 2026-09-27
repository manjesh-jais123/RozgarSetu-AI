import { Request, Response } from 'express';
import { Product, IUser } from '../../models';
import { asyncHandler, AppError } from '../../middleware/errorHandler';
import { successResponse, createPaginatedResponse } from '../../utils/types';
import { createAuditLog } from '../../middleware/adminAuth';
import { emitSocketEvent } from '../../services/socketEvents';

export const adminProductController = {
  categories: asyncHandler(async (_req: Request, res: Response) => {
    const categories = await Product.distinct('category', { isActive: true });
    res.json(successResponse('Categories retrieved', categories));
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, category, moderationStatus, status, search } = req.query;

    const filter: Record<string, unknown> = { isActive: true };
    if (category) filter.category = category;
    if (moderationStatus) filter.moderationStatus = moderationStatus;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
      ];
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .populate('userId', 'name phone')
        .lean(),
      Product.countDocuments(filter),
    ]);

    const categories = await Product.distinct('category', { isActive: true });

    res.json(successResponse('Products retrieved', {
      products,
      categories,
      pagination: createPaginatedResponse(products, total, Number(page), Number(limit)),
    }));
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('userId', 'name phone').lean();

    if (!product) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }

    res.json(successResponse('Product retrieved', product));
  }),

  moderate: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { moderationStatus, moderationNote, category, status } = req.body;
    const authReq = req as { user?: IUser };
    const admin = authReq.user!;

    const updates: Record<string, unknown> = {
      moderationStatus,
      moderatorId: admin._id,
      moderationAt: new Date(),
    };
    if (moderationNote) updates.moderationNote = moderationNote;
    if (category) updates.category = category;
    if (status) updates.status = status;

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('userId', 'name phone');

    if (!product) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }

    void createAuditLog(
      admin._id.toString(),
      admin.phone,
      moderationStatus === 'approved' ? 'approve' : moderationStatus === 'rejected' ? 'reject' : 'update',
      'product',
      id,
      { moderationStatus, moderationNote, category, status },
      req
    );

    res.json(successResponse('Product moderated', product));

      void emitSocketEvent.product_status_updated(req, {
        _id: product._id,
        name: product.name,
        moderationStatus,
        moderationNote,
        category: product.category,
        userId: product.userId,
      });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authReq = req as { user?: IUser };
    const admin = authReq.user!;

    const product = await Product.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('userId', 'name phone');

    if (!product) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }

    void createAuditLog(
      admin._id.toString(),
      admin.phone,
      'update',
      'product',
      id,
      { updates: req.body },
      req
    );

    res.json(successResponse('Product updated', product));
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authReq = req as { user?: IUser };
    const admin = authReq.user!;

    const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!product) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }

    void createAuditLog(
      admin._id.toString(),
      admin.phone,
      'delete',
      'product',
      id,
      {},
      req
    );

    res.json(successResponse('Product deleted', null));
  }),
};
