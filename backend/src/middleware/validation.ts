import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiResponse } from '../utils/types';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = {
        body: req.body,
        query: req.query,
        params: req.params,
      };
      const validated = schema.parse(data);
      req.body = validated.body;
      req.query = validated.query;
      req.params = validated.params;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        const response: ApiResponse<null> = {
          success: false,
          message: 'Validation failed',
          data: null,
          error: { code: 'VALIDATION_ERROR', details: JSON.stringify(details) },
        };
        res.status(400).json(response);
        return;
      }
      next(error);
    }
  };
};

export const sanitize = (req: Request, res: Response, next: NextFunction): void => {
  const sanitizeObject = (obj: unknown): unknown => {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'string') {
      return obj.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    if (typeof obj === 'object') {
      const sanitized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }
    return obj;
  };

  req.body = sanitizeObject(req.body) as Record<string, unknown>;
  req.query = sanitizeObject(req.query) as any;
  next();
};