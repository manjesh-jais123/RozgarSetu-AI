import mongoose, { Document, Schema } from 'mongoose';

export interface IContactInfo {
  phone?: string;
  email?: string;
  address?: string;
}

export interface IBuyer extends Document {
  name: string;
  type: 'individual' | 'business' | 'wholesaler' | 'retailer' | 'exporter';
  location: string;
  requiredProduct: string;
  quantity: number;
  budget: number;
  matchPercentage: number;
  contactInfo?: IContactInfo;
  verified: boolean;
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const contactInfoSchema = new Schema<IContactInfo>({
  phone: { type: String },
  email: { type: String },
  address: { type: String },
});

const buyerSchema = new Schema<IBuyer>({
  name: { type: String, required: true, trim: true, maxlength: 200 },
  type: {
    type: String,
    enum: ['individual', 'business', 'wholesaler', 'retailer', 'exporter'],
    required: true,
    index: true,
  },
  location: { type: String, required: true, index: true },
  requiredProduct: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  budget: { type: Number, required: true, min: 0 },
  matchPercentage: { type: Number, default: 0, min: 0, max: 100 },
  contactInfo: contactInfoSchema,
  verified: { type: Boolean, default: false, index: true },
  isActive: { type: Boolean, default: true, index: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});

buyerSchema.index({ type: 1, location: 1 });
buyerSchema.index({ requiredProduct: 'text', location: 'text' });
buyerSchema.index({ isActive: 1, verified: 1, matchPercentage: -1 });

export const Buyer = mongoose.model<IBuyer>('Buyer', buyerSchema);