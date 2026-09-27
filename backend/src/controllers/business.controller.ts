import { Request, Response } from 'express';
import { BusinessPlan, IUser } from '../models';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { successResponse } from '../utils/types';
import mongoose from 'mongoose';

export const businessController = {
  getDashboard: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const userId = authReq.user._id.toString();

    const [, opportunities, learningPaths, schemes, products, buyers] = await Promise.allSettled([
      BusinessPlan.findOne({ userId: new mongoose.Types.ObjectId(userId) }).lean(),
      mongoose.model('Opportunity').find({ isActive: true }).countDocuments(),
      mongoose.model('LearningPath').countDocuments(),
      mongoose.model('Scheme').countDocuments({ isActive: true }),
      mongoose.model('Product').countDocuments({ userId: new mongoose.Types.ObjectId(userId), isActive: true }),
      mongoose.model('Buyer').countDocuments({ isActive: true }),
      mongoose.model('Order').countDocuments({ userId: new mongoose.Types.ObjectId(userId) }),
    ]);

    const dashboard = {
      readinessScore: 72,
      opportunitiesExplored: opportunities.status === 'fulfilled' ? opportunities.value : 5,
      learningProgress: learningPaths.status === 'fulfilled' ? learningPaths.value : 3,
      fundingMatched: schemes.status === 'fulfilled' ? schemes.value : 3,
      productsListed: products.status === 'fulfilled' ? products.value : 2,
      buyersConnected: buyers.status === 'fulfilled' ? buyers.value : 1,
    };

    res.json(successResponse('Dashboard data', dashboard));
  }),

  getPlan: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const userId = authReq.user._id.toString();

    const plan = await BusinessPlan.findOne({ userId: new mongoose.Types.ObjectId(userId) }).lean();
    if (!plan) {
      res.json(successResponse('No plan found', null));
      return;
    }

    res.json(successResponse('Business plan retrieved', plan));
  }),

  createPlan: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const userId = authReq.user._id.toString();

    const plan = await BusinessPlan.create({
      ...req.body,
      userId: new mongoose.Types.ObjectId(userId),
      status: 'draft',
    });

    res.status(201).json(successResponse('Business plan created', plan));
  }),

  updatePlan: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const userId = authReq.user._id.toString();

    const plan = await BusinessPlan.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { ...req.body, status: 'in-progress' },
      { new: true, runValidators: true }
    );

    if (!plan) {
      throw new AppError('Business plan not found', 404, 'PLAN_NOT_FOUND');
    }

    res.json(successResponse('Business plan updated', plan));
  }),

  getIdeas: asyncHandler(async (req: Request, res: Response) => {
    const ideas = [
      { id: 'candle', title: 'Candle Making Business', investment: '₹20,000-60,000', duration: '1-2 months', difficulty: 'Easy' },
      { id: 'tailoring', title: 'Custom Tailoring', investment: '₹15,000-50,000', duration: '2-3 months', difficulty: 'Easy' },
      { id: 'bamboo', title: 'Bamboo Craft Products', investment: '₹25,000-80,000', duration: '4-6 months', difficulty: 'Medium' },
      { id: 'food', title: 'Food Processing (Pickles)', investment: '₹30,000-1,00,000', duration: '2-3 months', difficulty: 'Medium' },
    ];

    res.json(successResponse('Business ideas', ideas));
  }),
};
