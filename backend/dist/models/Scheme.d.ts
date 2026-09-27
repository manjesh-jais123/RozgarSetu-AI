import mongoose, { Document } from 'mongoose';
export interface IScheme extends Document {
    name: string;
    description: string;
    eligibility: string[];
    benefits: string[];
    requiredDocuments: string[];
    applicationProcess: string[];
    matchPercentage: number;
    category: string;
    deadline?: Date;
    officialWebsite?: string;
    isActive: boolean;
    targetGroup?: string;
    stateAvailability?: string[];
    lastVerified?: Date;
    isVerified: boolean;
    createdBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Scheme: mongoose.Model<IScheme, {}, {}, {}, mongoose.Document<unknown, {}, IScheme, {}, {}> & IScheme & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Scheme.d.ts.map