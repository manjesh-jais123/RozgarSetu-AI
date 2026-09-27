import { Request, Response } from 'express';
export declare const adminLearningController: {
    listPaths: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getPath: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    createPath: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updatePath: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    deletePath: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getLessons: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getLesson: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateLesson: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    deleteLesson: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getProgress: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=learning.controller.d.ts.map