import mongoose, { Document } from 'mongoose';
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
export declare const Product: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct, {}, {}> & IProduct & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Product.d.ts.map