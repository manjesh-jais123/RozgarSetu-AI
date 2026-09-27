import mongoose, { Document } from 'mongoose';
export interface IFundingApplication extends Document {
    userId: mongoose.Types.ObjectId;
    schemeId: mongoose.Types.ObjectId;
    status: 'pending' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'disbursed';
    applicationData: Record<string, unknown>;
    documents: string[];
    submittedAt?: Date;
    reviewedAt?: Date;
    reviewedBy?: mongoose.Types.ObjectId;
    rejectionReason?: string;
    disbursementAmount?: number;
    disbursementDate?: Date;
    notes: string[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const FundingApplication: mongoose.Model<IFundingApplication, {}, {}, {}, mongoose.Document<unknown, {}, IFundingApplication, {}, {}> & IFundingApplication & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=FundingApplication.d.ts.map