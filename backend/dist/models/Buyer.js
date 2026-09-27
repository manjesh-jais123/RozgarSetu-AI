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
exports.Buyer = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const contactInfoSchema = new mongoose_1.Schema({
    phone: { type: String },
    email: { type: String },
    address: { type: String },
});
const buyerSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, maxlength: 200 },
    type: {
        type: String,
        enum: ['individual', 'business', 'wholesaler', 'retailer', 'exporter'],
        required: true,
        index: true,
    },
    location: { type: String, required: true, index: true },
    requiredProduct: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    budget: { type: Number, required: true, min: 0 },
    matchPercentage: { type: Number, default: 0, min: 0, max: 100 },
    contactInfo: contactInfoSchema,
    verified: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
});
buyerSchema.index({ type: 1, location: 1 });
buyerSchema.index({ requiredProduct: 'text', location: 'text' });
buyerSchema.index({ isActive: 1, verified: 1, matchPercentage: -1 });
exports.Buyer = mongoose_1.default.model('Buyer', buyerSchema);
//# sourceMappingURL=Buyer.js.map