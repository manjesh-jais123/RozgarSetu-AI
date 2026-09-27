import { Request, Response } from 'express';
import { User, IUser } from '../models';
import { jwtService } from '../services/jwt.service';
import { otpService } from '../services/otp.service';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { successResponse } from '../utils/types';
import { logger } from '../utils/logger';
import { emitSocketEvent } from '../services/socketEvents';

function sanitizeUser(user: IUser) {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.refreshTokens;
  delete obj.password;
  return obj;
}

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { name, phone, language } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      throw new AppError('Phone number already registered', 409, 'PHONE_EXISTS');
    }

    const user = await User.create({
      name,
      phone,
      language,
      location: {
        state: '',
        district: '',
      },
      profile: {
        age: 18,
        gender: 'other',
        education: '',
        workExperience: '',
        skills: [],
        interests: [],
        businessInterest: [],
        financialInfo: {
          availableCapital: 0,
          expectedIncome: 0,
          currentIncome: 0,
          investmentCapacity: 0,
        },
        goals: [],
      },
      onboardingCompleted: false,
    });

    const { accessToken, refreshToken } = jwtService.generateTokens(user);

    user.refreshTokens.push(refreshToken);
    await user.save();

    logger.info('User registered: ' + user.phone);

    void emitSocketEvent.new_user_registered(req, {
      id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    });

    res.status(201).json(successResponse('Registration successful', {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    }));
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { phone } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated', 403, 'ACCOUNT_DEACTIVATED');
    }

    const result = await otpService.sendOTP(phone);
    if (!result.success) {
      throw new AppError(result.message, 400, 'OTP_SEND_FAILED');
    }

    res.json(successResponse(result.message, { phone: user.phone }));
  }),

  verifyOtp: asyncHandler(async (req: Request, res: Response) => {
    const { phone, otp } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    const result = await otpService.verifyOTP(phone, otp);
    if (!result.success) {
      throw new AppError(result.message, 400, 'OTP_VERIFICATION_FAILED');
    }

    user.lastLoginAt = new Date();
    const { accessToken, refreshToken } = jwtService.generateTokens(user);
    user.refreshTokens.push(refreshToken);
    await user.save();

    logger.info('User logged in: ' + user.phone);

    res.json(successResponse('Login successful', {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    }));
  }),

  resendOtp: asyncHandler(async (req: Request, res: Response) => {
    const { phone } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    const result = await otpService.resendOTP(phone);
    if (!result.success) {
      throw new AppError(result.message, 400, 'OTP_RESEND_FAILED');
    }

    res.json(successResponse(result.message, null));
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token required', 400, 'REFRESH_TOKEN_REQUIRED');
    }

    let payload;
    try {
      payload = jwtService.verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }

    const user = await User.findById(payload.userId);
    if (!user || !user.isActive) {
      throw new AppError('User not found or inactive', 401, 'USER_NOT_FOUND');
    }

    if (!user.refreshTokens.includes(refreshToken)) {
      throw new AppError('Refresh token not recognized', 401, 'TOKEN_NOT_RECOGNIZED');
    }

    user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
    const tokens = jwtService.generateTokens(user);
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    res.json(successResponse('Tokens refreshed', tokens));
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.split(' ')[1];

    if (accessToken) {
      try {
        const payload = jwtService.verifyAccessToken(accessToken);
        const user = await User.findById(payload.userId);
        if (user && refreshToken) {
          user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
          await user.save();
        }
      } catch {
        // Ignore token errors during logout
      }
    }

    res.json(successResponse('Logged out successfully', null));
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as unknown as { user: IUser };
    const user = authReq.user;

    res.json(successResponse('User profile retrieved', sanitizeUser(user)));
  }),

  forgotPassword: asyncHandler(async (req: Request, res: Response) => {
    const { phone } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      res.json(successResponse('If the phone number exists, an OTP will be sent', null));
      return;
    }

    const result = await otpService.sendOTP(phone);
    res.json(successResponse(result.message, null));
  }),

  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    const { phone, otp, newPassword } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    const result = await otpService.verifyOTP(phone, otp);
    if (!result.success) {
      throw new AppError(result.message, 400, 'OTP_VERIFICATION_FAILED');
    }

    user.password = newPassword;
    user.refreshTokens = [];
    await user.save();

    res.json(successResponse('Password reset successful', null));
  }),
};
