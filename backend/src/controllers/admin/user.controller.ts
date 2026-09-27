import { Request, Response } from 'express';
import { User, IUser, AuditLog } from '../../models';
import { asyncHandler, AppError } from '../../middleware/errorHandler';
import { successResponse, createPaginatedResponse } from '../../utils/types';
import { createAuditLog } from '../../middleware/adminAuth';
import mongoose from 'mongoose';

export const adminUserController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, role, isActive, onboardingCompleted, state, district, search, sort = 'createdAt', order = 'desc' } = req.query;

    const filter: Record<string, unknown> = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (onboardingCompleted !== undefined) filter.onboardingCompleted = onboardingCompleted === 'true';
    if (state) filter['location.state'] = state;
    if (district) filter['location.district'] = district;
    if (search) {
      filter.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { phone: { $regex: search as string, $options: 'i' } },
        { email: { $regex: search as string, $options: 'i' } },
      ];
    }

    const sortBy: Record<string, 1 | -1> = { [sort as string]: order === 'asc' ? 1 : -1 };

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort(sortBy)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .select('-refreshTokens -password')
        .lean(),
      User.countDocuments(filter),
    ]);

    res.json(successResponse('Users retrieved', createPaginatedResponse(users, total, Number(page), Number(limit))));
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await User.findById(id).select('-refreshTokens -password').lean();

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    const [progress, businessPlan, orders, fundingApps] = await Promise.all([
      mongoose.model('UserProgress').findOne({ userId: user._id }).lean(),
      mongoose.model('BusinessPlan').findOne({ userId: user._id }).lean(),
      mongoose.model('Order').find({ userId: user._id }).countDocuments(),
      mongoose.model('FundingApplication').find({ userId: user._id }).lean(),
    ]);

    res.json(successResponse('User retrieved', {
      user,
      progress,
      businessPlan,
      orderCount: orders,
      fundingApplications: fundingApps,
    }));
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, phone, email, role, isActive, onboardingCompleted } = req.body;
    const authReq = req as AuthRequest;
    const admin = authReq.user!;

    const updates: Record<string, unknown> = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (email) updates.email = email;
    if (role) updates.role = role;
    if (isActive !== undefined) updates.isActive = isActive;
    if (onboardingCompleted !== undefined) updates.onboardingCompleted = onboardingCompleted;

    const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select('-refreshTokens -password');

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    void createAuditLog(
      admin._id.toString(),
      admin.phone,
      'update',
      'user',
      id,
      { fieldsUpdated: Object.keys(updates) },
      req
    );

    res.json(successResponse('User updated', user));
  }),

  suspend: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authReq = req as AuthRequest;
    const admin = authReq.user!;

    const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true }).select('-refreshTokens -password');

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    void createAuditLog(
      admin._id.toString(),
      admin.phone,
      'suspend',
      'user',
      id,
      { reason: req.body?.reason || 'No reason provided' },
      req
    );

    res.json(successResponse('User suspended', user));
  }),

  activate: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authReq = req as AuthRequest;
    const admin = authReq.user!;

    const user = await User.findByIdAndUpdate(id, { isActive: true }, { new: true }).select('-refreshTokens -password');

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    void createAuditLog(
      admin._id.toString(),
      admin.phone,
      'activate',
      'user',
      id,
      {},
      req
    );

    res.json(successResponse('User activated', user));
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    res.json(successResponse('User deleted', null));
  }),

  getAuditLogs: asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 50, action, resource, adminId, dateFrom, dateTo } = req.query;

    const filter: Record<string, unknown> = {};
    if (action) filter.action = action;
    if (resource) filter.resource = resource;
    if (adminId) filter.adminId = new mongoose.Types.ObjectId(adminId as string);
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) (filter.createdAt as any).$gte = new Date(dateFrom as string);
      if (dateTo) (filter.createdAt as any).$lte = new Date(dateTo as string);
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .populate('adminId', 'name phone role')
        .lean(),
      AuditLog.countDocuments(filter),
    ]);

    res.json(successResponse('Audit logs retrieved', createPaginatedResponse(logs, total, Number(page), Number(limit))));
  }),
};

interface AuthRequest {
  user?: IUser;
}
