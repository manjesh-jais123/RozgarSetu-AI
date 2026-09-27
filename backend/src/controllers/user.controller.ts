import { Request, Response } from 'express';
import { IUser } from '../models';
import { asyncHandler } from '../middleware/errorHandler';
import { successResponse } from '../utils/types';

export const userController = {
  getProfile: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as any;
    const user = authReq.user as IUser;

    res.json(successResponse('Profile retrieved', sanitizeUser(user)));
  }),

  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as any;
    const user = authReq.user as IUser;
    const { name, language, avatar } = req.body;

    if (name) user.name = name;
    if (language) user.language = language;
    if (avatar) user.avatar = avatar;

    await user.save();
    res.json(successResponse('Profile updated', sanitizeUser(user)));
  }),

  updateBasicInfo: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as any;
    const user = authReq.user as IUser;
    const { age, gender, education, workExperience, location } = req.body;

    if (age !== undefined) user.profile.age = age;
    if (gender) user.profile.gender = gender;
    if (education !== undefined) user.profile.education = education;
    if (workExperience !== undefined) user.profile.workExperience = workExperience;
    if (location) {
      user.location = { ...user.location, ...location };
    }

    await user.save();
    res.json(successResponse('Basic info updated', sanitizeUser(user)));
  }),

  updateSkills: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as any;
    const user = authReq.user as IUser;
    const { skills } = req.body;

    user.profile.skills = skills;
    await user.save();
    res.json(successResponse('Skills updated', sanitizeUser(user)));
  }),

  updateInterests: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as any;
    const user = authReq.user as IUser;
    const { interests, businessInterest } = req.body;

    if (interests) user.profile.interests = interests;
    if (businessInterest) user.profile.businessInterest = businessInterest;

    await user.save();
    res.json(successResponse('Interests updated', sanitizeUser(user)));
  }),

  updateFinancialInfo: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as any;
    const user = authReq.user as IUser;
    const { availableCapital, expectedIncome, currentIncome, investmentCapacity } = req.body;

    if (availableCapital !== undefined) user.profile.financialInfo.availableCapital = availableCapital;
    if (expectedIncome !== undefined) user.profile.financialInfo.expectedIncome = expectedIncome;
    if (currentIncome !== undefined) user.profile.financialInfo.currentIncome = currentIncome;
    if (investmentCapacity !== undefined) user.profile.financialInfo.investmentCapacity = investmentCapacity;

    await user.save();
    res.json(successResponse('Financial info updated', sanitizeUser(user)));
  }),

  updateGoals: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as any;
    const user = authReq.user as IUser;
    const { goals } = req.body;

    user.profile.goals = goals;
    await user.save();
    res.json(successResponse('Goals updated', sanitizeUser(user)));
  }),

  completeOnboarding: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as any;
    const user = authReq.user as IUser;

    user.onboardingCompleted = true;
    await user.save();
    res.json(successResponse('Onboarding completed', sanitizeUser(user)));
  }),

  deleteAccount: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as any;
    const user = authReq.user as IUser;

    user.isActive = false;
    await user.save();
    res.json(successResponse('Account deactivated', null));
  }),
};

function sanitizeUser(user: IUser) {
  const obj = user.toObject();
  delete obj.refreshTokens;
  delete obj.password;
  return obj;
}