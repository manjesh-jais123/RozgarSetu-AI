import { Request, Response } from 'express';
import { Product, IUser } from '../models';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { successResponse, createPaginatedResponse } from '../utils/types';
import mongoose from 'mongoose';
import { emitSocketEvent } from '../services/socketEvents';

export const productController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const userId = authReq.user._id.toString();
    const { page = 1, limit = 10, category, status, search } = req.query;

    const filter: Record<string, unknown> = { userId: new mongoose.Types.ObjectId(userId), isActive: true };
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
      filter.$text = { $search: search as string };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      Product.countDocuments(filter),
    ]);

    res.json(successResponse('Products retrieved', createPaginatedResponse(products, total, Number(page), Number(limit))));
  }),

  myProducts: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const userId = authReq.user._id.toString();
    const products = await Product.find({ userId: new mongoose.Types.ObjectId(userId), isActive: true }).sort({ createdAt: -1 });
    res.json(successResponse('Your products', products));
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authReq = req as unknown as { user: IUser };
    const userId = authReq.user._id.toString();

    const product = await Product.findOne({ _id: id, userId: new mongoose.Types.ObjectId(userId) });
    if (!product) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }

    res.json(successResponse('Product retrieved', product));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const userId = authReq.user._id.toString();

       const product = await Product.create({
        ...req.body,
        userId: new mongoose.Types.ObjectId(userId),
      });

      void emitSocketEvent.new_product_registered(req, {
        _id: product._id,
        name: product.name,
        category: product.category,
        moderationStatus: product.moderationStatus,
        createdAt: product.createdAt,
        userId: product.userId,
      });

      res.status(201).json(successResponse('Product created', product));
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authReq = req as unknown as { user: IUser };
    const userId = authReq.user._id.toString();

    const product = await Product.findOneAndUpdate(
      { _id: id, userId: new mongoose.Types.ObjectId(userId) },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }

    res.json(successResponse('Product updated', product));
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authReq = req as unknown as { user: IUser };
    const userId = authReq.user._id.toString();

    const product = await Product.findOneAndUpdate(
      { _id: id, userId: new mongoose.Types.ObjectId(userId) },
      { isActive: false },
      { new: true }
    );

    if (!product) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }

    res.json(successResponse('Product deleted', null));
  }),
};
