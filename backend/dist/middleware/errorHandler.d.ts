import { Request, Response, NextFunction, RequestHandler } from 'express';
export declare class AppError extends Error {
    statusCode: number;
    code: string;
    details?: unknown;
    constructor(message: string, statusCode: number, code: string, details?: unknown);
}
export declare const errorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => void;
export declare const notFoundHandler: (req: Request, res: Response) => void;
export declare const asyncHandler: (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=errorHandler.d.ts.map