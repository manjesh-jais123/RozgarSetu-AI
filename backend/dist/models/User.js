"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const locationSchema = new mongoose_1.Schema({
    state: { type: String, required: true },
    district: { type: String, required: true },
    village: { type: String },
    pincode: { type: String },
});
const skillSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    proficiency: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    yearsExperience: { type: Number, required: true, min: 0 },
});
const interestSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
});
const businessInterestSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
});
const financialInfoSchema = new mongoose_1.Schema({
    availableCapital: { type: Number, required: true, min: 0 },
    expectedIncome: { type: Number, required: true, min: 0 },
    currentIncome: { type: Number, required: true, min: 0 },
    investmentCapacity: { type: Number, required: true, min: 0 },
});
const goalSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['learn', 'start', 'grow', 'customers', 'funding'], required: true },
});
const userProfileSchema = new mongoose_1.Schema({
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
const userSchema = new mongoose_1.Schema({
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
exports.User = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=User.js.map