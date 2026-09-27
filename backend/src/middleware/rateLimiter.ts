import rateLimit from 'express-rate-limit';
import { config } from '../config';

export const globalRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    data: null,
    error: { code: 'RATE_LIMIT_EXCEEDED', details: 'Rate limit exceeded' },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimiter = rateLimit({
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

export const otpRateLimiter = rateLimit({
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

export const apiRateLimiter = rateLimit({
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