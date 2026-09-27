import mongoose, { Document } from 'mongoose';
export interface IOpportunity extends Document {
    title: string;
    description: string;
    category: string;
    requiredInvestment: {
        min: number;
        max: number;
    };
    requiredSkills: string[];
    learningDuration: string;
    difficulty: 'easy' | 'medium' | 'hard';
    incomeScenarios: {
        conservative: number;
        expected: number;
        optimistic: number;
        currency: 'INR';
        period: 'monthly' | 'yearly';
    };
    customerSegments: string[];
    location?: string;
    matchPercentage: number;
    tags: string[];
    isActive: boolean;
    createdBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Opportunity: mongoose.Model<IOpportunity, {}, {}, {}, mongoose.Document<unknown, {}, IOpportunity, {}, {}> & IOpportunity & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Opportunity.d.ts.map