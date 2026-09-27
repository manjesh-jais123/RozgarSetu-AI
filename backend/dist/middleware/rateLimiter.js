"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRateLimiter = exports.otpRateLimiter = exports.authRateLimiter = exports.globalRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = require("../config");
exports.globalRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: config_1.config.rateLimit.windowMs,
    max: config_1.config.rateLimit.maxRequests,
    message: {
        success: false,
        message: 'Too many requests, please try again later',
        data: null,
        error: { code: 'RATE_LIMIT_EXCEEDED', details: 'Rate limit exceeded' },
    },
    standardHeaders: true,
    legacyHeaders: false,
});
exports.authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later',
        data: null,
        error: { code: 'RATE_LIMIT_EXCEEDED', details: 'Auth rate limit exceeded' },
    },
    standardHeaders: true,
    legacyHeaders: false,
});
exports.otpRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Too many OTP requests, please try again in an hour',
        data: null,
        error: { code: 'RATE_LIMIT_EXCEEDED', details: 'OTP rate limit exceeded' },
    },
    standardHeaders: true,
    legacyHeaders: false,
});
exports.apiRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 60,
    message: {
        success: false,
        message: 'Too many API requests',
        data: null,
        error: { code: 'RATE_LIMIT_EXCEEDED', details: 'API rate limit exceeded' },
    },
    standardHeaders: true,
    legacyHeaders: false,
});
//# sourceMappingURL=rateLimiter.js.map