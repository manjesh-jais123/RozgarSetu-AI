import { Request, Response } from 'express';
export declare const marketController: {
    getBuyers: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getBuyer: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    connectWithBuyer: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    submitRfq: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    createOrder: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    listOrders: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getOrder: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    listRequests: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=market.controller.d.ts.map