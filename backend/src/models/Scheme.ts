import mongoose, { Document, Schema } from 'mongoose';

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

const schemeSchema = new Schema<IScheme>({
  name: { type: String, required: true, trim: true, maxlength: 200, index: true },
  description: { type: String, required: true },
  eligibility: [{ type: String, required: true }],
  benefits: [{ type: String, required: true }],
  requiredDocuments: [{ type: String, required: true }],
  applicationProcess: [{ type: String, required: true }],
  matchPercentage: { type: Number, default: 0, min: 0, max: 100 },
  category: { type: String, required: true, index: true },
  deadline: { type: Date },
  officialWebsite: { type: String },
  isActive: { type: Boolean, default: true, index: true },
  targetGroup: { type: String },
  stateAvailability: [{ type: String }],
  lastVerified: { type: Date, default: null, index: true },
  isVerified: { type: Boolean, default: false, index: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});

schemeSchema.index({ category: 1, isActive: 1 });
schemeSchema.index({ deadline: 1 });
schemeSchema.index({ name: 'text', description: 'text' });
schemeSchema.index({ isVerified: 1, lastVerified: -1 });

export const Scheme = mongoose.model<IScheme>('Scheme', schemeSchema);