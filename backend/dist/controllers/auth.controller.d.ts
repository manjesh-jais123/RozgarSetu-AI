import { Request, Response } from 'express';
export declare const authController: {
    register: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    login: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    verifyOtp: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    resendOtp: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    refresh: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    logout: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    me: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    forgotPassword: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    resetPassword: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=auth.controller.d.ts.map