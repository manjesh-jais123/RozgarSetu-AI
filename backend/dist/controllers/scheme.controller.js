"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemeController = void 0;
const models_1 = require("../models");
const errorHandler_1 = require("../middleware/errorHandler");
const types_1 = require("../utils/types");
const mongoose_1 = __importDefault(require("mongoose"));
exports.schemeController = {
    list: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { page = 1, limit = 10, category, search } = req.query;
        const filter = { isActive: true };
        if (category)
            filter.category = category;
        if (search) {
            filter.$text = { $search: search };
        }
        const skip = (Number(page) - 1) * Number(limit);
        const [schemes, total] = await Promise.all([
            models_1.Scheme.find(filter).skip(skip).limit(Number(limit)),
            models_1.Scheme.countDocuments(filter),
        ]);
        res.json((0, types_1.successResponse)('Schemes retrieved', (0, types_1.createPaginatedResponse)(schemes, total, Number(page), Number(limit))));
    }),
    categories: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const categories = await models_1.Scheme.distinct('category', { isActive: true });
        res.json((0, types_1.successResponse)('Categories retrieved', categories));
    }),
    get: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const scheme = await models_1.Scheme.findById(id).lean();
        if (!scheme) {
            throw new errorHandler_1.AppError('Scheme not found', 404, 'SCHEME_NOT_FOUND');
        }
        res.json((0, types_1.successResponse)('Scheme retrieved', scheme));
    }),
    checkEligibility: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const authReq = req;
        const user = authReq.user;
        const scheme = await models_1.Scheme.findById(id);
        if (!scheme) {
            throw new errorHandler_1.AppError('Scheme not found', 404, 'SCHEME_NOT_FOUND');
        }
        const reasons = [];
        if (user.location?.state && scheme.eligibility?.some(e => e.toLowerCase().includes(user.location.state.toLowerCase()))) {
            reasons.push('Location eligible');
        }
        reasons.push('Matches your profile');
        const eligible = scheme.eligibility?.some(e => e.toLowerCase().includes('income') || e.toLowerCase().includes('capital') || e.toLowerCase().includes('skill'));
        res.json((0, types_1.successResponse)('Eligibility checked', { eligible: eligible ?? true, reasons }));
    }),
    apply: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const authReq = req;
        const userId = authReq.user._id.toString();
        const { applicationData, documents } = req.body;
        const scheme = await models_1.Scheme.findById(id);
        if (!scheme) {
            throw new errorHandler_1.AppError('Scheme not found', 404, 'SCHEME_NOT_FOUND');
        }
        const FundingApplication = mongoose_1.default.model('FundingApplication');
        let application = await FundingApplication.findOne({ userId, schemeId: id });
        if (application) {
            application.applicationData = applicationData || application.applicationData;
            application.documents = documents || application.documents;
            application.status = 'submitted';
            application.submittedAt = new Date();
        }
        else {
            application = new FundingApplication({
                userId: new mongoose_1.default.Types.ObjectId(userId),
                schemeId: new mongoose_1.default.Types.ObjectId(id),
                applicationData,
                documents,
                status: 'submitted',
                submittedAt: new Date(),
                notes: [],
            });
        }
        await application.save();
        res.json((0, types_1.successResponse)('Application submitted', application));
    }),
};
//# sourceMappingURL=scheme.controller.js.map