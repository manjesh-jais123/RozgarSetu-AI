import mongoose, { Document, Schema } from 'mongoose';

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

const pricingStrategySchema = new Schema<IPricingStrategy>({
  costPrice: { type: Number, required: true, min: 0 },
  sellingPrice: { type: Number, required: true, min: 0 },
  margin: { type: Number, required: true, min: 0, max: 100 },
  wholesalePrice: { type: Number, min: 0 },
});

const businessPlanSchema = new Schema<IBusinessPlan>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  idea: { type: String, required: true, trim: true },
  requiredInvestment: { type: Number, required: true, min: 0 },
  rawMaterials: [{ type: String }],
  equipment: [{ type: String }],
  operatingCost: { type: Number, required: true, min: 0 },
  pricingStrategy: { type: pricingStrategySchema, required: true },
  customerSegments: [{ type: String }],
  marketingPlan: [{ type: String }],
  riskFactors: [{ type: String }],
  nextActions: [{ type: String }],
  status: { type: String, enum: ['draft', 'in-progress', 'completed'], default: 'draft', index: true },
  aiGenerated: { type: Boolean, default: false },
}, {
  timestamps: true,
});

businessPlanSchema.index({ userId: 1, status: 1 });

export const BusinessPlan = mongoose.model<IBusinessPlan>('BusinessPlan', businessPlanSchema);