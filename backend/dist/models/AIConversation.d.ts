import mongoose, { Document } from 'mongoose';
export interface IAIMessages {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    metadata?: Record<string, unknown>;
}
export interface IAIConversation extends Document {
    userId: mongoose.Types.ObjectId;
    sessionId: string;
    messages: IAIMessages[];
    context?: Record<string, unknown>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const AIConversation: mongoose.Model<IAIConversation, {}, {}, {}, mongoose.Document<unknown, {}, IAIConversation, {}, {}> & IAIConversation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=AIConversation.d.ts.map