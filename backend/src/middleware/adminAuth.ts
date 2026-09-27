import { Request, Response, NextFunction } from 'express';
import { rateLimit } from 'express-rate-limit';
import { AuditLog } from '../models';
import { AuthRequest } from './auth';

export const adminRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  message: {
    success: false,
    message: 'Too many admin requests',
    data: null,
    error: { code: 'RATE_LIMIT_EXCEEDED', details: 'Admin rate limit exceeded' },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const createAuditLog = async (
  adminId: string,
  adminPhone: string,
  action: string,
  resource: string,
  resourceId?: string,
  details?: Record<string, unknown>,
  req?: Request
): Promise<void> => {
  try {
    await AuditLog.create({
      adminId: adminId,
      adminPhone,
      action,
      resource,
      resourceId: resourceId || undefined,
      details,
      ipAddress: req?.ip,
      userAgent: req?.get('user-agent'),
    });
  } catch (err) {
    console.error('Failed to create audit log:', err);
  }
};

export const auditLog = (action: string, resource: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    res.locals.auditAction = action;
    res.locals.auditResource = resource;
    next();
  };
};

export const logAdminAction = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const originalJson = res.json;
  res.json = function (body: unknown) {
    const action = res.locals.auditAction;
    const resource = res.locals.auditResource;
    if (action && resource && req.user) {
      void createAuditLog(
        req.user._id.toString(),
        req.user.phone,
        action,
        resource,
        req.params.id,
        { body: req.body, query: req.query, result: body },
        req
      );
    }
    return originalJson.call(this, body);
  };
  next();
};
