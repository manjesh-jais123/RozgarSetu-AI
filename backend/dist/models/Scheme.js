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
exports.Scheme = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const schemeSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, maxlength: 200, index: true },
    description: { type: String, required: true },
    eligibility: [{ type: String, required: true }],
    benefits: [{ type: String, required: true }],
    requiredDocuments: [{ type: String, required: true }],
    applicationProcess: [{ type: String, required: true }],
    matchPercentage: { type: Number, default: 0, min: 0, max: 100 },
    category: { type: String, required: true, index: true },
    deadline: { type: Date },
    officialWebsite: { type: String },
    isActive: { type: Boolean, default: true, index: true },
    targetGroup: { type: String },
    stateAvailability: [{ type: String }],
    lastVerified: { type: Date, default: null, index: true },
    isVerified: { type: Boolean, default: false, index: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
});
schemeSchema.index({ category: 1, isActive: 1 });
schemeSchema.index({ deadline: 1 });
schemeSchema.index({ name: 'text', description: 'text' });
schemeSchema.index({ isVerified: 1, lastVerified: -1 });
exports.Scheme = mongoose_1.default.model('Scheme', schemeSchema);
//# sourceMappingURL=Scheme.js.map