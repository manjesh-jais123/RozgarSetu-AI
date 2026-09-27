import mongoose, { Document, Schema } from 'mongoose';

export interface ISkillMaster extends Document {
  name: string;
  category: string;
  description?: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced';
  yearsExperience: number;
  learningResourceUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<ISkillMaster>({
  name: { type: String, required: true, trim: true, maxlength: 200, index: true },
  category: { type: String, required: true, index: true },
  description: { type: String, maxlength: 1000 },
  proficiency: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true, index: true },
  yearsExperience: { type: Number, required: true, min: 0 },
  learningResourceUrl: { type: String, trim: true },
  isActive: { type: Boolean, default: true, index: true },
}, {
  timestamps: true,
});

skillSchema.index({ category: 1, isActive: 1 });
skillSchema.index({ name: 'text', category: 'text' });

export const Skill = mongoose.model<ISkillMaster>('Skill', skillSchema);
