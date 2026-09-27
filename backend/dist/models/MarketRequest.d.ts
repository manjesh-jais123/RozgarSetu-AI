import mongoose, { Document } from 'mongoose';
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
export declare const MarketRequest: mongoose.Model<IMarketRequest, {}, {}, {}, mongoose.Document<unknown, {}, IMarketRequest, {}, {}> & IMarketRequest & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=MarketRequest.d.ts.map