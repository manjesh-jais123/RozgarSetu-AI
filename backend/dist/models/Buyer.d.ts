import mongoose, { Document } from 'mongoose';
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
export declare const Buyer: mongoose.Model<IBuyer, {}, {}, {}, mongoose.Document<unknown, {}, IBuyer, {}, {}> & IBuyer & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Buyer.d.ts.map