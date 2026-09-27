import mongoose, { Document, Schema } from 'mongoose';

export interface IMarketRequest extends Document {
  userId: mongoose.Types.ObjectId;
  productId?: mongoose.Types.ObjectId;
  buyerId?: mongoose.Types.ObjectId;
  type: 'connect' | 'rfq' | 'order';
  message: string;
  quantity?: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  response?: string;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const marketRequestSchema = new Schema<IMarketRequest>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', index: true },
  buyerId: { type: Schema.Types.ObjectId, ref: 'Buyer', index: true },
  type: { type: String, enum: ['connect', 'rfq', 'order'], required: true, index: true },
  message: { type: String, required: true },
  quantity: { type: Number, min: 1 },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'], default: 'pending', index: true },
  response: { type: String },
  respondedAt: { type: Date },
}, {
  timestamps: true,
});

marketRequestSchema.index({ userId: 1, type: 1, status: 1 });
marketRequestSchema.index({ buyerId: 1, status: 1 });

export const MarketRequest = mongoose.model<IMarketRequest>('MarketRequest', marketRequestSchema);