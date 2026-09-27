import { Request, Response } from 'express';
export declare const aiController: {
    chat: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    explain: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getRecommendations: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getRoadmap: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getConversations: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    assess: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    fingerprint: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    recommendSkills: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    discoverOpportunities: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    simulateIncome: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    generateLearningPlan: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    generateQuiz: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    analyzeAssessment: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    generateBusinessPlan: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    matchSchemes: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    analyzeProduct: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    generateProductCatalog: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    generateProductPassport: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    matchBuyers: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    nextAction: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    dailyMission: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    voiceToText: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    textToVoice: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=ai.controller.d.ts.map