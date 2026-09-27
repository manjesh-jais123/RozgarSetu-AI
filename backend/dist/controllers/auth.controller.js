"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const models_1 = require("../models");
const jwt_service_1 = require("../services/jwt.service");
const otp_service_1 = require("../services/otp.service");
const errorHandler_1 = require("../middleware/errorHandler");
const types_1 = require("../utils/types");
const logger_1 = require("../utils/logger");
function sanitizeUser(user) {
    const obj = user.toObject();
    delete obj.refreshTokens;
    delete obj.password;
    return obj;
}
exports.authController = {
    register: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { name, phone, language } = req.body;
        const existingUser = await models_1.User.findOne({ phone });
        if (existingUser) {
            throw new errorHandler_1.AppError('Phone number already registered', 409, 'PHONE_EXISTS');
        }
        const user = await models_1.User.create({
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
        const { accessToken, refreshToken } = jwt_service_1.jwtService.generateTokens(user);
        user.refreshTokens.push(refreshToken);
        await user.save();
        logger_1.logger.info('User registered: ' + user.phone);
        res.status(201).json((0, types_1.successResponse)('Registration successful', {
            user: sanitizeUser(user),
            accessToken,
            refreshToken,
        }));
    }),
    login: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { phone } = req.body;
        const user = await models_1.User.findOne({ phone });
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404, 'USER_NOT_FOUND');
        }
        if (!user.isActive) {
            throw new errorHandler_1.AppError('Account is deactivated', 403, 'ACCOUNT_DEACTIVATED');
        }
        const result = await otp_service_1.otpService.sendOTP(phone);
        if (!result.success) {
            throw new errorHandler_1.AppError(result.message, 400, 'OTP_SEND_FAILED');
        }
        res.json((0, types_1.successResponse)(result.message, { phone: user.phone }));
    }),
    verifyOtp: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { phone, otp } = req.body;
        const user = await models_1.User.findOne({ phone });
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404, 'USER_NOT_FOUND');
        }
        const result = await otp_service_1.otpService.verifyOTP(phone, otp);
        if (!result.success) {
            throw new errorHandler_1.AppError(result.message, 400, 'OTP_VERIFICATION_FAILED');
        }
        user.lastLoginAt = new Date();
        const { accessToken, refreshToken } = jwt_service_1.jwtService.generateTokens(user);
        user.refreshTokens.push(refreshToken);
        await user.save();
        logger_1.logger.info('User logged in: ' + user.phone);
        res.json((0, types_1.successResponse)('Login successful', {
            user: sanitizeUser(user),
            accessToken,
            refreshToken,
        }));
    }),
    resendOtp: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { phone } = req.body;
        const user = await models_1.User.findOne({ phone });
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404, 'USER_NOT_FOUND');
        }
        const result = await otp_service_1.otpService.resendOTP(phone);
        if (!result.success) {
            throw new errorHandler_1.AppError(result.message, 400, 'OTP_RESEND_FAILED');
        }
        res.json((0, types_1.successResponse)(result.message, null));
    }),
    refresh: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw new errorHandler_1.AppError('Refresh token required', 400, 'REFRESH_TOKEN_REQUIRED');
        }
        let payload;
        try {
            payload = jwt_service_1.jwtService.verifyRefreshToken(refreshToken);
        }
        catch {
            throw new errorHandler_1.AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
        }
        const user = await models_1.User.findById(payload.userId);
        if (!user || !user.isActive) {
            throw new errorHandler_1.AppError('User not found or inactive', 401, 'USER_NOT_FOUND');
        }
        if (!user.refreshTokens.includes(refreshToken)) {
            throw new errorHandler_1.AppError('Refresh token not recognized', 401, 'TOKEN_NOT_RECOGNIZED');
        }
        user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
        const tokens = jwt_service_1.jwtService.generateTokens(user);
        user.refreshTokens.push(tokens.refreshToken);
        await user.save();
        res.json((0, types_1.successResponse)('Tokens refreshed', tokens));
    }),
    logout: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { refreshToken } = req.body;
        const authHeader = req.headers.authorization;
        const accessToken = authHeader?.split(' ')[1];
        if (accessToken) {
            try {
                const payload = jwt_service_1.jwtService.verifyAccessToken(accessToken);
                const user = await models_1.User.findById(payload.userId);
                if (user && refreshToken) {
                    user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
                    await user.save();
                }
            }
            catch {
                // Ignore token errors during logout
            }
        }
        res.json((0, types_1.successResponse)('Logged out successfully', null));
    }),
    me: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const user = authReq.user;
        res.json((0, types_1.successResponse)('User profile retrieved', sanitizeUser(user)));
    }),
    forgotPassword: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { phone } = req.body;
        const user = await models_1.User.findOne({ phone });
        if (!user) {
            res.json((0, types_1.successResponse)('If the phone number exists, an OTP will be sent', null));
            return;
        }
        const result = await otp_service_1.otpService.sendOTP(phone);
        res.json((0, types_1.successResponse)(result.message, null));
    }),
    resetPassword: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { phone, otp, newPassword } = req.body;
        const user = await models_1.User.findOne({ phone });
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404, 'USER_NOT_FOUND');
        }
        const result = await otp_service_1.otpService.verifyOTP(phone, otp);
        if (!result.success) {
            throw new errorHandler_1.AppError(result.message, 400, 'OTP_VERIFICATION_FAILED');
        }
        user.password = newPassword;
        user.refreshTokens = [];
        await user.save();
        res.json((0, types_1.successResponse)('Password reset successful', null));
    }),
};
//# sourceMappingURL=auth.controller.js.map