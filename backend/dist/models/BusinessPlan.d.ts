import mongoose, { Document } from 'mongoose';
export interface IPricingStrategy {
    costPrice: number;
    sellingPrice: number;
    margin: number;
    wholesalePrice?: number;
}
export interface IBusinessPlan extends Document {
    userId: mongoose.Types.ObjectId;
    idea: string;
    requiredInvestment: number;
    rawMaterials: string[];
    equipment: string[];
    operatingCost: number;
    pricingStrategy: IPricingStrategy;
    customerSegments: string[];
    marketingPlan: string[];
    riskFactors: string[];
    nextActions: string[];
    status: 'draft' | 'in-progress' | 'completed';
    aiGenerated: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const BusinessPlan: mongoose.Model<IBusinessPlan, {}, {}, {}, mongoose.Document<unknown, {}, IBusinessPlan, {}, {}> & IBusinessPlan & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=BusinessPlan.d.ts.map