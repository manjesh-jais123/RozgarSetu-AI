import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
export declare const adminRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const createAuditLog: (adminId: string, adminPhone: string, action: string, resource: string, resourceId?: string, details?: Record<string, unknown>, req?: Request) => Promise<void>;
export declare const auditLog: (action: string, resource: string) => (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const logAdminAction: (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=adminAuth.d.ts.map