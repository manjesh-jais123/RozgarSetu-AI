import mongoose, { Document, Schema } from 'mongoose';

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

const aiMessageSchema = new Schema<IAIMessages>({
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: Schema.Types.Mixed },
});

const aiConversationSchema = new Schema<IAIConversation>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  sessionId: { type: String, required: true, index: true },
  messages: [aiMessageSchema],
  context: { type: Schema.Types.Mixed },
  isActive: { type: Boolean, default: true, index: true },
}, {
  timestamps: true,
});

aiConversationSchema.index({ userId: 1, sessionId: 1 });
aiConversationSchema.index({ userId: 1, isActive: 1, updatedAt: -1 });

export const AIConversation = mongoose.model<IAIConversation>('AIConversation', aiConversationSchema);