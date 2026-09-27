import { Request, Response } from 'express';
export declare const adminMarketController: {
    listBuyers: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getBuyer: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    createBuyer: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateBuyer: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    deleteBuyer: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    listOrders: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getOrder: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateOrderStatus: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    listRequests: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateRequest: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getFundingApplications: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateFundingApplication: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=market.controller.d.ts.map