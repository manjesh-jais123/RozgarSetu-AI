import { Request, Response } from 'express';
import { Opportunity } from '../models';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { successResponse, createPaginatedResponse } from '../utils/types';
import { parseQueryFilters } from '../utils/helpers';

export const opportunityController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, category, difficulty, minInvestment, maxInvestment, skill, location, search, sort = 'matchPercentage', order = 'desc' } = req.query;

    const filter: Record<string, unknown> = { isActive: true };

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (location) filter.location = location;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }
    if (minInvestment || maxInvestment) {
      filter.requiredInvestment = {};
      if (minInvestment) (filter.requiredInvestment as any).min = { $gte: Number(minInvestment) };
      if (maxInvestment) (filter.requiredInvestment as any).max = { $lte: Number(maxInvestment) };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortObj: Record<string, 1 | -1> = { [sort as string]: order === 'asc' ? 1 : -1 };

    const [opportunities, total] = await Promise.all([
      Opportunity.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Opportunity.countDocuments(filter),
    ]);

    let results = opportunities;

    if (skill) {
      const userSkill = String(skill).toLowerCase();
      results = results.map(opp => ({
        ...opp,
        matchPercentage: calculateMatchPercentage([userSkill], opp.requiredSkills),
      })).sort((a, b) => b.matchPercentage - a.matchPercentage);
    }

    res.json(successResponse('Opportunities retrieved', createPaginatedResponse(results, total, Number(page), Number(limit))));
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const opportunity = await Opportunity.findById(id).lean();

    if (!opportunity) {
      throw new AppError('Opportunity not found', 404, 'OPPORTUNITY_NOT_FOUND');
    }

    res.json(successResponse('Opportunity retrieved', opportunity));
  }),

  recommend: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as any;
    const user = authReq.user;

    const userSkills = user.profile.skills.map((s: any) => s.name.toLowerCase());
    const userInterests = user.profile.interests.map((i: any) => i.name.toLowerCase());
    const userBusinessInterests = user.profile.businessInterest.map((b: any) => b.name.toLowerCase());

    const opportunities = await Opportunity.find({ isActive: true }).lean();

    const scored = opportunities.map(opp => {
      const skillMatch = calculateMatchPercentage(userSkills, opp.requiredSkills);
      const interestMatch = opp.tags.some((tag: string) =>
        userInterests.some((ui: string) => tag.toLowerCase().includes(ui)) ||
        userBusinessInterests.some((ubi: string) => tag.toLowerCase().includes(ubi))
      ) ? 20 : 0;
      const locationMatch = user.location.state && opp.location &&
        opp.location.toLowerCase().includes(user.location.state.toLowerCase()) ? 15 : 0;

      const totalMatch = Math.min(100, Math.round(opp.matchPercentage * 0.6 + skillMatch * 0.3 + interestMatch + locationMatch));

      return { ...opp, matchPercentage: totalMatch };
    });

    const recommended = scored
      .filter(o => o.matchPercentage > 50)
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 10);

    res.json(successResponse('Recommended opportunities', recommended));
  }),

  filter: asyncHandler(async (req: Request, res: Response) => {
    const filters = parseQueryFilters(req.query);
    const { page = 1, limit = 10 } = req.query;

    const filter: Record<string, unknown> = { isActive: true };

    if (filters.budget) {
      filter.requiredInvestment = {
        min: { $lte: Number(filters.budget) },
        max: { $gte: Number(filters.budget) },
      };
    }
    if (filters.difficulty) filter.difficulty = filters.difficulty;
    if (filters.category) filter.category = filters.category;
    if (filters.skill) {
      filter.requiredSkills = { $in: [new RegExp(filters.skill as string, 'i')] };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [opportunities, total] = await Promise.all([
      Opportunity.find(filter).skip(skip).limit(Number(limit)).lean(),
      Opportunity.countDocuments(filter),
    ]);

    res.json(successResponse('Filtered opportunities', createPaginatedResponse(opportunities, total, Number(page), Number(limit))));
  }),

  categories: asyncHandler(async (req: Request, res: Response) => {
    const categories = await Opportunity.distinct('category', { isActive: true });
    res.json(successResponse('Categories retrieved', categories));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as any;
    const user = authReq.user;

    const opportunity = await Opportunity.create({ ...req.body, createdBy: user._id });
    res.status(201).json(successResponse('Opportunity created', opportunity));
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const opportunity = await Opportunity.findByIdAndUpdate(id, req.body, { new: true });

    if (!opportunity) {
      throw new AppError('Opportunity not found', 404, 'OPPORTUNITY_NOT_FOUND');
    }

    res.json(successResponse('Opportunity updated', opportunity));
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const opportunity = await Opportunity.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!opportunity) {
      throw new AppError('Opportunity not found', 404, 'OPPORTUNITY_NOT_FOUND');
    }

    res.json(successResponse('Opportunity deleted', null));
  }),
};

function calculateMatchPercentage(userSkills: string[], requiredSkills: string[]): number {
  if (!requiredSkills.length) return 100;
  const userSkillSet = new Set(userSkills);
  const matches = requiredSkills.filter(s => userSkillSet.has(s.toLowerCase())).length;
  return Math.round((matches / requiredSkills.length) * 100);
}