import { Request, Response } from 'express';
import { Scheme, IUser } from '../models';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { successResponse, createPaginatedResponse } from '../utils/types';
import mongoose from 'mongoose';

export const schemeController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, category, search } = req.query;

    const filter: Record<string, unknown> = { isActive: true };
    if (category) filter.category = category;
    if (search) {
      filter.$text = { $search: search as string };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [schemes, total] = await Promise.all([
      Scheme.find(filter).skip(skip).limit(Number(limit)),
      Scheme.countDocuments(filter),
    ]);

    res.json(successResponse('Schemes retrieved', createPaginatedResponse(schemes, total, Number(page), Number(limit))));
  }),

  categories: asyncHandler(async (req: Request, res: Response) => {
    const categories = await Scheme.distinct('category', { isActive: true });
    res.json(successResponse('Categories retrieved', categories));
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const scheme = await Scheme.findById(id).lean();

    if (!scheme) {
      throw new AppError('Scheme not found', 404, 'SCHEME_NOT_FOUND');
    }

    res.json(successResponse('Scheme retrieved', scheme));
  }),

  checkEligibility: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authReq = req as unknown as { user: IUser };
    const user = authReq.user;

    const scheme = await Scheme.findById(id);
    if (!scheme) {
      throw new AppError('Scheme not found', 404, 'SCHEME_NOT_FOUND');
    }

    const reasons: string[] = [];
    if (user.location?.state && scheme.eligibility?.some(e => e.toLowerCase().includes(user.location.state.toLowerCase()))) {
      reasons.push('Location eligible');
    }
    reasons.push('Matches your profile');

    const eligible = scheme.eligibility?.some(e =>
      e.toLowerCase().includes('income') || e.toLowerCase().includes('capital') || e.toLowerCase().includes('skill')
    );

    res.json(successResponse('Eligibility checked', { eligible: eligible ?? true, reasons }));
  }),

  apply: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authReq = req as unknown as { user: IUser };
    const userId = authReq.user._id.toString();
    const { applicationData, documents } = req.body;

    const scheme = await Scheme.findById(id);
    if (!scheme) {
      throw new AppError('Scheme not found', 404, 'SCHEME_NOT_FOUND');
    }

    const FundingApplication = mongoose.model('FundingApplication');
    let application = await FundingApplication.findOne({ userId, schemeId: id });
    if (application) {
      application.applicationData = applicationData || application.applicationData;
      application.documents = documents || application.documents;
      application.status = 'submitted';
      application.submittedAt = new Date();
    } else {
      application = new FundingApplication({
        userId: new mongoose.Types.ObjectId(userId),
        schemeId: new mongoose.Types.ObjectId(id),
        applicationData,
        documents,
        status: 'submitted',
        submittedAt: new Date(),
        notes: [],
      });
    }
    await application.save();

    res.json(successResponse('Application submitted', application));
  }),
};
