import { Request, Response } from 'express';
export declare const adminUserController: {
    list: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    get: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    update: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    suspend: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    activate: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    delete: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getAuditLogs: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=user.controller.d.ts.map