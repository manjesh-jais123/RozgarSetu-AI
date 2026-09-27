"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessController = void 0;
const models_1 = require("../models");
const errorHandler_1 = require("../middleware/errorHandler");
const types_1 = require("../utils/types");
const mongoose_1 = __importDefault(require("mongoose"));
exports.businessController = {
    getDashboard: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const userId = authReq.user._id.toString();
        const [, opportunities, learningPaths, schemes, products, buyers] = await Promise.allSettled([
            models_1.BusinessPlan.findOne({ userId: new mongoose_1.default.Types.ObjectId(userId) }).lean(),
            mongoose_1.default.model('Opportunity').find({ isActive: true }).countDocuments(),
            mongoose_1.default.model('LearningPath').countDocuments(),
            mongoose_1.default.model('Scheme').countDocuments({ isActive: true }),
            mongoose_1.default.model('Product').countDocuments({ userId: new mongoose_1.default.Types.ObjectId(userId), isActive: true }),
            mongoose_1.default.model('Buyer').countDocuments({ isActive: true }),
            mongoose_1.default.model('Order').countDocuments({ userId: new mongoose_1.default.Types.ObjectId(userId) }),
        ]);
        const dashboard = {
            readinessScore: 72,
            opportunitiesExplored: opportunities.status === 'fulfilled' ? opportunities.value : 5,
            learningProgress: learningPaths.status === 'fulfilled' ? learningPaths.value : 3,
            fundingMatched: schemes.status === 'fulfilled' ? schemes.value : 3,
            productsListed: products.status === 'fulfilled' ? products.value : 2,
            buyersConnected: buyers.status === 'fulfilled' ? buyers.value : 1,
        };
        res.json((0, types_1.successResponse)('Dashboard data', dashboard));
    }),
    getPlan: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const userId = authReq.user._id.toString();
        const plan = await models_1.BusinessPlan.findOne({ userId: new mongoose_1.default.Types.ObjectId(userId) }).lean();
        if (!plan) {
            res.json((0, types_1.successResponse)('No plan found', null));
            return;
        }
        res.json((0, types_1.successResponse)('Business plan retrieved', plan));
    }),
    createPlan: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const userId = authReq.user._id.toString();
        const plan = await models_1.BusinessPlan.create({
            ...req.body,
            userId: new mongoose_1.default.Types.ObjectId(userId),
            status: 'draft',
        });
        res.status(201).json((0, types_1.successResponse)('Business plan created', plan));
    }),
    updatePlan: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const userId = authReq.user._id.toString();
        const plan = await models_1.BusinessPlan.findOneAndUpdate({ userId: new mongoose_1.default.Types.ObjectId(userId) }, { ...req.body, status: 'in-progress' }, { new: true, runValidators: true });
        if (!plan) {
            throw new errorHandler_1.AppError('Business plan not found', 404, 'PLAN_NOT_FOUND');
        }
        res.json((0, types_1.successResponse)('Business plan updated', plan));
    }),
    getIdeas: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const ideas = [
            { id: 'candle', title: 'Candle Making Business', investment: '₹20,000-60,000', duration: '1-2 months', difficulty: 'Easy' },
            { id: 'tailoring', title: 'Custom Tailoring', investment: '₹15,000-50,000', duration: '2-3 months', difficulty: 'Easy' },
            { id: 'bamboo', title: 'Bamboo Craft Products', investment: '₹25,000-80,000', duration: '4-6 months', difficulty: 'Medium' },
            { id: 'food', title: 'Food Processing (Pickles)', investment: '₹30,000-1,00,000', duration: '2-3 months', difficulty: 'Medium' },
        ];
        res.json((0, types_1.successResponse)('Business ideas', ideas));
    }),
};
//# sourceMappingURL=business.controller.js.map