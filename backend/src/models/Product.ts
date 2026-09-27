import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  category: string;
  materials: string[];
  dimensions: string;
  price: number;
  minimumOrderQuantity: number;
  productionCapacity: number;
  images: string[];
  tags: string[];
  status: 'draft' | 'active' | 'inactive';
  moderationStatus: 'pending' | 'approved' | 'rejected';
  moderatorId?: mongoose.Types.ObjectId;
  moderationNote?: string;
  moderationAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true },
  category: { type: String, required: true, index: true },
  materials: [{ type: String }],
  dimensions: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  minimumOrderQuantity: { type: Number, required: true, min: 1, default: 1 },
  productionCapacity: { type: Number, required: true, min: 0 },
  images: [{ type: String }],
  tags: [{ type: String }],
  status: { type: String, enum: ['draft', 'active', 'inactive'], default: 'draft', index: true },
  moderationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
  moderatorId: { type: Schema.Types.ObjectId, ref: 'User' },
  moderationNote: { type: String },
  moderationAt: { type: Date },
  isActive: { type: Boolean, default: true, index: true },
}, {
  timestamps: true,
});

productSchema.index({ userId: 1, status: 1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ moderationStatus: 1, createdAt: -1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);