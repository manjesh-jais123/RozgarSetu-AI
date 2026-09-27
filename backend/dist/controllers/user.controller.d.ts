import { Request, Response } from 'express';
export declare const userController: {
    getProfile: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateProfile: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateBasicInfo: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateSkills: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateInterests: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateFinancialInfo: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateGoals: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    completeOnboarding: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    deleteAccount: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=user.controller.d.ts.map