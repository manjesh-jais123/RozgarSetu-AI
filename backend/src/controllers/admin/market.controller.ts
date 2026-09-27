import { Request, Response } from 'express';
import { Buyer, Order, MarketRequest, IUser } from '../../models';
import { asyncHandler, AppError } from '../../middleware/errorHandler';
import { successResponse, createPaginatedResponse } from '../../utils/types';
import { createAuditLog } from '../../middleware/adminAuth';
import mongoose from 'mongoose';

export const adminMarketController = {
  listBuyers: asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, type, location, verified, isActive, search } = req.query;

    const filter: Record<string, unknown> = {};
    if (type) filter.type = type;
    if (location) filter.location = location;
    if (verified !== undefined) filter.verified = verified === 'true';
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { requiredProduct: { $regex: search as string, $options: 'i' } },
        { location: { $regex: search as string, $options: 'i' } },
      ];
    }

    const [buyers, total] = await Promise.all([
      Buyer.find(filter)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .lean(),
      Buyer.countDocuments(filter),
    ]);

    const types = await Buyer.distinct('type', { isActive: true });

    res.json(successResponse('Buyers retrieved', {
      buyers,
      types,
      pagination: createPaginatedResponse(buyers, total, Number(page), Number(limit)),
    }));
  }),

  getBuyer: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const buyer = await Buyer.findById(id).lean();

    if (!buyer) {
      throw new AppError('Buyer not found', 404, 'BUYER_NOT_FOUND');
    }

    res.json(successResponse('Buyer retrieved', buyer));
  }),

  createBuyer: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as { user?: IUser };
    const admin = authReq.user!;

    const buyer = await Buyer.create({
      ...req.body,
      createdBy: admin._id,
    });

    void createAuditLog(
      admin._id.toString(),
      admin.phone,
      'create',
      'buyer',
      buyer._id?.toString(),
      { buyer: req.body },
      req
    );

    res.status(201).json(successResponse('Buyer created', buyer));
  }),

  updateBuyer: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authReq = req as { user?: IUser };
    const admin = authReq.user!;

    const buyer = await Buyer.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!buyer) {
      throw new AppError('Buyer not found', 404, 'BUYER_NOT_FOUND');
    }

    void createAuditLog(
      admin._id.toString(),
      admin.phone,
      'update',
      'buyer',
      id,
      { updates: req.body },
      req
    );

    res.json(successResponse('Buyer updated', buyer));
  }),

  deleteBuyer: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authReq = req as { user?: IUser };
    const admin = authReq.user!;

    const buyer = await Buyer.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!buyer) {
      throw new AppError('Buyer not found', 404, 'BUYER_NOT_FOUND');
    }

    void createAuditLog(
      admin._id.toString(),
      admin.phone,
      'delete',
      'buyer',
      id,
      {},
      req
    );

    res.json(successResponse('Buyer deleted', null));
  }),

  listOrders: asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, status, paymentStatus, search } = req.query;

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (search) {
      filter.$or = [
        { 'items.productName': { $regex: search as string, $options: 'i' } },
      ];
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .populate('userId', 'name phone')
        .populate('buyerId', 'name')
        .lean(),
      Order.countDocuments(filter),
    ]);

    res.json(successResponse('Orders retrieved', createPaginatedResponse(orders, total, Number(page), Number(limit))));
  }),

  getOrder: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate('userId', 'name phone')
      .populate('buyerId', 'name')
      .populate('items.productId', 'name')
      .lean();

    if (!order) {
      throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    }

    res.json(successResponse('Order retrieved', order));
  }),

  updateOrderStatus: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;
    const authReq = req as { user?: IUser };
    const admin = authReq.user!;

    const updates: Record<string, unknown> = {};
    if (status) updates.status = status;
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!order) {
      throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    }

    void createAuditLog(
      admin._id.toString(),
      admin.phone,
      'update',
      'order',
      id,
      { status, paymentStatus },
      req
    );

    res.json(successResponse('Order updated', order));
  }),

  listRequests: asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, type, status, search } = req.query;

    const filter: Record<string, unknown> = {};
    if (type) filter.type = type;
    if (status) filter.status = status;

    const [requests, total] = await Promise.all([
      MarketRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .populate('userId', 'name phone')
        .populate('buyerId', 'name')
        .populate('productId', 'name')
        .lean(),
      MarketRequest.countDocuments(filter),
    ]);

    res.json(successResponse('Market requests retrieved', createPaginatedResponse(requests, total, Number(page), Number(limit))));
  }),

  updateRequest: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, response } = req.body;
    const authReq = req as { user?: IUser };
    const admin = authReq.user!;

    const updates: Record<string, unknown> = {};
    if (status) updates.status = status;
    if (response !== undefined) {
      updates.response = response;
      updates.respondedAt = new Date();
    }

    const request = await MarketRequest.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!request) {
      throw new AppError('Request not found', 404, 'REQUEST_NOT_FOUND');
    }

    void createAuditLog(
      admin._id.toString(),
      admin.phone,
      'update',
      'marketRequest',
      id,
      { status, response },
      req
    );

    res.json(successResponse('Request updated', request));
  }),

  getFundingApplications: asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, status, search } = req.query;

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const FundingApplication = mongoose.model('FundingApplication');

    const [applications, total] = await Promise.all([
      FundingApplication.find(filter)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .populate('userId', 'name phone')
        .populate('schemeId', 'name')
        .populate('reviewedBy', 'name')
        .lean(),
      FundingApplication.countDocuments(filter),
    ]);

    res.json(successResponse('Funding applications retrieved', createPaginatedResponse(applications, total, Number(page), Number(limit))));
  }),

  updateFundingApplication: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, rejectionReason, notes } = req.body;
    const authReq = req as { user?: IUser };
    const admin = authReq.user!;

    const FundingApplication = mongoose.model('FundingApplication');

    const updates: Record<string, unknown> = {};
    if (status) updates.status = status;
    if (rejectionReason) updates.rejectionReason = rejectionReason;
    if (notes && notes.length > 0) {
      updates.notes = notes;
      updates.reviewedAt = new Date();
      updates.reviewedBy = admin._id;
    }

    const application = await FundingApplication.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!application) {
      throw new AppError('Funding application not found', 404, 'FUNDING_APPLICATION_NOT_FOUND');
    }

    void createAuditLog(
      admin._id.toString(),
      admin.phone,
      'update',
      'fundingApplication',
      id,
      { status, rejectionReason, notes },
      req
    );

    res.json(successResponse('Funding application updated', application));
  }),
};
