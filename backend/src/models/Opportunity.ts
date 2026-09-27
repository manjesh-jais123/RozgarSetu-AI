import mongoose, { Document, Schema } from 'mongoose';

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

const opportunitySchema = new Schema<IOpportunity>({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true, index: true },
  requiredInvestment: {
    min: { type: Number, required: true, min: 0 },
    max: { type: Number, required: true, min: 0 },
  },
  requiredSkills: [{ type: String }],
  learningDuration: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true, index: true },
  incomeScenarios: {
    conservative: { type: Number, required: true, min: 0 },
    expected: { type: Number, required: true, min: 0 },
    optimistic: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ['INR'], default: 'INR' },
    period: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
  },
  customerSegments: [{ type: String }],
  location: { type: String, index: true },
  matchPercentage: { type: Number, default: 0, min: 0, max: 100 },
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true, index: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});

opportunitySchema.index({ category: 1, difficulty: 1 });
opportunitySchema.index({ location: 1, category: 1 });
opportunitySchema.index({ isActive: 1, matchPercentage: -1 });

export const Opportunity = mongoose.model<IOpportunity>('Opportunity', opportunitySchema);