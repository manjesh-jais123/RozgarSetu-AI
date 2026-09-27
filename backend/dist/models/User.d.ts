import mongoose, { Document } from 'mongoose';
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
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=User.d.ts.map