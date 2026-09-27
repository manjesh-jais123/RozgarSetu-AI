import mongoose, { Document, Schema } from 'mongoose';

export interface ILocation {
  state: string;
  district: string;
  village?: string;
  pincode?: string;
}

export interface ISkill {
  name: string;
  category: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced';
  yearsExperience: number;
}

export interface IInterest {
  name: string;
  category: string;
}

export interface IBusinessInterest {
  name: string;
  category: string;
  description: string;
}

export interface IFinancialInfo {
  availableCapital: number;
  expectedIncome: number;
  currentIncome: number;
  investmentCapacity: number;
}

export interface IGoal {
  name: string;
  description: string;
  category: 'learn' | 'start' | 'grow' | 'customers' | 'funding';
}

export interface IUserProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  education: string;
  workExperience: string;
  skills: ISkill[];
  interests: IInterest[];
  businessInterest: IBusinessInterest[];
  financialInfo: IFinancialInfo;
  goals: IGoal[];
}

export interface IUser extends Document {
  name: string;
  phone: string;
  email?: string;
  language: 'hi' | 'en';
  avatar?: string;
  location: ILocation;
  profile: IUserProfile;
  onboardingCompleted: boolean;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  isActive: boolean;
  lastLoginAt?: Date;
   refreshTokens: string[];
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

const locationSchema = new Schema<ILocation>({
  state: { type: String, required: true },
  district: { type: String, required: true },
  village: { type: String },
  pincode: { type: String },
});

const skillSchema = new Schema<ISkill>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  proficiency: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  yearsExperience: { type: Number, required: true, min: 0 },
});

const interestSchema = new Schema<IInterest>({
  name: { type: String, required: true },
  category: { type: String, required: true },
});

const businessInterestSchema = new Schema<IBusinessInterest>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
});

const financialInfoSchema = new Schema<IFinancialInfo>({
  availableCapital: { type: Number, required: true, min: 0 },
  expectedIncome: { type: Number, required: true, min: 0 },
  currentIncome: { type: Number, required: true, min: 0 },
  investmentCapacity: { type: Number, required: true, min: 0 },
});

const goalSchema = new Schema<IGoal>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['learn', 'start', 'grow', 'customers', 'funding'], required: true },
});

const userProfileSchema = new Schema<IUserProfile>({
  age: { type: Number, required: true, min: 13, max: 100 },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  education: { type: String, required: true },
  workExperience: { type: String, required: true },
  skills: [skillSchema],
  interests: [interestSchema],
  businessInterest: [businessInterestSchema],
  financialInfo: { type: financialInfoSchema, required: true },
  goals: [goalSchema],
});

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  phone: { type: String, required: true, unique: true, index: true },
  email: { type: String, unique: true, sparse: true, index: true },
  language: { type: String, enum: ['hi', 'en'], default: 'hi' },
  avatar: { type: String },
  location: { type: locationSchema, required: true },
  profile: { type: userProfileSchema, required: true },
  onboardingCompleted: { type: Boolean, default: false },
  role: { type: String, enum: ['USER', 'ADMIN', 'SUPER_ADMIN'], default: 'USER' },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date },
   refreshTokens: [{ type: String }],
   password: { type: String, select: false },
 }, {
  timestamps: true,
});

userSchema.index({ phone: 1 });
userSchema.index({ email: 1 });
userSchema.index({ 'location.state': 1, 'location.district': 1 });
userSchema.index({ role: 1 });

export const User = mongoose.model<IUser>('User', userSchema);