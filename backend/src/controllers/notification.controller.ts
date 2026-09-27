import { Request, Response } from 'express';
import { Notification, IUser } from '../models';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { successResponse, createPaginatedResponse } from '../utils/types';
import mongoose from 'mongoose';

export const notificationController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const userId = authReq.user._id.toString();
    const { page = 1, limit = 20, type, isRead } = req.query;

    const filter: Record<string, unknown> = { userId: new mongoose.Types.ObjectId(userId) };
    if (type) filter.type = type;
    if (isRead !== undefined) filter.isRead = isRead === 'true';

    const skip = (Number(page) - 1) * Number(limit);

    const [notifications, total] = await Promise.all([
      Notification.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      Notification.countDocuments(filter),
    ]);

    res.json(successResponse('Notifications retrieved', createPaginatedResponse(notifications, total, Number(page), Number(limit))));
  }),

  markRead: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authReq = req as unknown as { user: IUser };
    const userId = authReq.user._id.toString();

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: new mongoose.Types.ObjectId(userId) },
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      throw new AppError('Notification not found', 404, 'NOTIFICATION_NOT_FOUND');
    }

    res.json(successResponse('Notification marked as read', notification));
  }),

  markAllRead: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const userId = authReq.user._id.toString();

    await Notification.updateMany(
      { userId: new mongoose.Types.ObjectId(userId), isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json(successResponse('All notifications marked as read', null));
  }),

  deleteNotification: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authReq = req as unknown as { user: IUser };
    const userId = authReq.user._id.toString();

    const notification = await Notification.findOneAndDelete({
      _id: id,
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!notification) {
      throw new AppError('Notification not found', 404, 'NOTIFICATION_NOT_FOUND');
    }

    res.json(successResponse('Notification deleted', null));
  }),
};
