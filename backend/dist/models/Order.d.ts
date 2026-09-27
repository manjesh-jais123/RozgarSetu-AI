import mongoose, { Document } from 'mongoose';
export interface IOrderItem {
    productId: mongoose.Types.ObjectId;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}
export interface IOrder extends Document {
    userId: mongoose.Types.ObjectId;
    buyerId?: mongoose.Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
    shippingAddress: {
        name: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        pincode: string;
    };
    paymentStatus: 'pending' | 'paid' | 'partial' | 'refunded' | 'failed';
    paymentMethod?: string;
    paymentId?: string;
    notes?: string;
    shippedAt?: Date;
    deliveredAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Order: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, {}> & IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Order.d.ts.map