import { Request, Response } from 'express';
import { Buyer, Order, MarketRequest, IUser } from '../models';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { successResponse, createPaginatedResponse } from '../utils/types';
import mongoose from 'mongoose';

export const marketController = {
  getBuyers: asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, type, product, location, verified, search } = req.query;
    void product;

    const filter: Record<string, unknown> = { isActive: true };
    if (type) filter.type = type;
    if (location) filter.location = location;
    if (verified) filter.verified = verified === 'true';
    if (product) filter.requiredProduct = { $regex: product as string, $options: 'i' };
    if (search) {
      filter.$text = { $search: search as string };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [buyers, total] = await Promise.all([
      Buyer.find(filter).skip(skip).limit(Number(limit)).sort({ matchPercentage: -1 }),
      Buyer.countDocuments(filter),
    ]);

    res.json(successResponse('Buyers retrieved', createPaginatedResponse(buyers, total, Number(page), Number(limit))));
  }),

  getBuyer: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const buyer = await Buyer.findById(id).lean();

    if (!buyer || !buyer.isActive) {
      throw new AppError('Buyer not found', 404, 'BUYER_NOT_FOUND');
    }

    res.json(successResponse('Buyer retrieved', buyer));
  }),

  connectWithBuyer: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authReq = req as unknown as { user: IUser };
    const userId = authReq.user._id.toString();
    const { message } = req.body;

    const buyer = await Buyer.findById(id);
    if (!buyer || !buyer.isActive) {
      throw new AppError('Buyer not found', 404, 'BUYER_NOT_FOUND');
    }

    const request = await MarketRequest.create({
      userId: new mongoose.Types.ObjectId(userId),
      buyerId: new mongoose.Types.ObjectId(id),
      type: 'connect',
      message,
      status: 'pending',
    });

    res.status(201).json(successResponse('Connection request sent', request));
  }),

  submitRfq: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const userId = authReq.user._id.toString();
    const { productId, buyerId, message, quantity } = req.body;

    const request = await MarketRequest.create({
      userId: new mongoose.Types.ObjectId(userId),
      productId: productId ? new mongoose.Types.ObjectId(productId) : undefined,
      buyerId: buyerId ? new mongoose.Types.ObjectId(buyerId) : undefined,
      type: 'rfq',
      message,
      quantity,
      status: 'pending',
    });

    res.status(201).json(successResponse('RFQ submitted', request));
  }),

  createOrder: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const userId = authReq.user._id.toString();
    const { buyerId, items, shippingAddress, paymentMethod, notes } = req.body;

    const totalAmount = items.reduce((sum: number, item: { totalPrice: number }) => sum + item.totalPrice, 0);

    const order = await Order.create({
      userId: new mongoose.Types.ObjectId(userId),
      buyerId: buyerId ? new mongoose.Types.ObjectId(buyerId) : undefined,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      notes,
      status: 'pending',
      paymentStatus: 'pending',
    });

    res.status(201).json(successResponse('Order created', order));
  }),

  listOrders: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const userId = authReq.user._id.toString();
    const { page = 1, limit = 10, status } = req.query;

    const filter: Record<string, unknown> = { userId: new mongoose.Types.ObjectId(userId) };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      Order.countDocuments(filter),
    ]);

    res.json(successResponse('Orders retrieved', createPaginatedResponse(orders, total, Number(page), Number(limit))));
  }),

  getOrder: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authReq = req as unknown as { user: IUser };
    const userId = authReq.user._id.toString();

    const order = await Order.findOne({ _id: id, userId: new mongoose.Types.ObjectId(userId) });
    if (!order) {
      throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    }

    res.json(successResponse('Order retrieved', order));
  }),

  listRequests: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const userId = authReq.user._id.toString();
    const { page = 1, limit = 10, type, status } = req.query;

    const filter: Record<string, unknown> = { userId: new mongoose.Types.ObjectId(userId) };
    if (type) filter.type = type;
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [requests, total] = await Promise.all([
      MarketRequest.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      MarketRequest.countDocuments(filter),
    ]);

    res.json(successResponse('Market requests retrieved', createPaginatedResponse(requests, total, Number(page), Number(limit))));
  }),
};
