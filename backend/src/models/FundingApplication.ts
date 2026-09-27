import mongoose, { Document, Schema } from 'mongoose';

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

const fundingApplicationSchema = new Schema<IFundingApplication>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  schemeId: { type: Schema.Types.ObjectId, ref: 'Scheme', required: true, index: true },
  status: {
    type: String,
    enum: ['pending', 'submitted', 'under_review', 'approved', 'rejected', 'disbursed'],
    default: 'pending',
    index: true,
  },
  applicationData: { type: Schema.Types.Mixed, required: true },
  documents: [{ type: String }],
  submittedAt: { type: Date },
  reviewedAt: { type: Date },
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  rejectionReason: { type: String },
  disbursementAmount: { type: Number, min: 0 },
  disbursementDate: { type: Date },
  notes: [{ type: String }],
}, {
  timestamps: true,
});

fundingApplicationSchema.index({ userId: 1, schemeId: 1 }, { unique: true });
fundingApplicationSchema.index({ status: 1, createdAt: -1 });

export const FundingApplication = mongoose.model<IFundingApplication>('FundingApplication', fundingApplicationSchema);