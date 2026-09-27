"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOpportunityController = void 0;
const models_1 = require("../../models");
const errorHandler_1 = require("../../middleware/errorHandler");
const types_1 = require("../../utils/types");
const adminAuth_1 = require("../../middleware/adminAuth");
exports.adminOpportunityController = {
    list: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { page = 1, limit = 10, category, difficulty, isActive, search, sort = 'createdAt', order = 'desc' } = req.query;
        const filter = {};
        if (category)
            filter.category = category;
        if (difficulty)
            filter.difficulty = difficulty;
        if (isActive !== undefined)
            filter.isActive = isActive === 'true';
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } },
            ];
        }
        const sortBy = { [sort]: order === 'asc' ? 1 : -1 };
        const [opportunities, total] = await Promise.all([
            models_1.Opportunity.find(filter)
                .sort(sortBy)
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit))
                .lean(),
            models_1.Opportunity.countDocuments(filter),
        ]);
        res.json((0, types_1.successResponse)('Opportunities retrieved', (0, types_1.createPaginatedResponse)(opportunities, total, Number(page), Number(limit))));
    }),
    get: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const opportunity = await models_1.Opportunity.findById(id).lean();
        if (!opportunity) {
            throw new errorHandler_1.AppError('Opportunity not found', 404, 'OPPORTUNITY_NOT_FOUND');
        }
        res.json((0, types_1.successResponse)('Opportunity retrieved', opportunity));
    }),
    create: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const admin = authReq.user;
        const opportunity = await models_1.Opportunity.create({
            ...req.body,
            createdBy: authReq.user?._id,
        });
        void (0, adminAuth_1.createAuditLog)(admin._id.toString(), admin.phone, 'create', 'opportunity', opportunity._id?.toString(), { opportunity: req.body }, req);
        res.status(201).json((0, types_1.successResponse)('Opportunity created', opportunity));
    }),
    update: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const authReq = req;
        const admin = authReq.user;
        const opportunity = await models_1.Opportunity.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!opportunity) {
            throw new errorHandler_1.AppError('Opportunity not found', 404, 'OPPORTUNITY_NOT_FOUND');
        }
        void (0, adminAuth_1.createAuditLog)(admin._id.toString(), admin.phone, 'update', 'opportunity', id, { updates: req.body }, req);
        res.json((0, types_1.successResponse)('Opportunity updated', opportunity));
    }),
    delete: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const authReq = req;
        const admin = authReq.user;
        const opportunity = await models_1.Opportunity.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!opportunity) {
            throw new errorHandler_1.AppError('Opportunity not found', 404, 'OPPORTUNITY_NOT_FOUND');
        }
        void (0, adminAuth_1.createAuditLog)(admin._id.toString(), admin.phone, 'delete', 'opportunity', id, {}, req);
        res.json((0, types_1.successResponse)('Opportunity deleted', null));
    }),
    categories: (0, errorHandler_1.asyncHandler)(async (_req, res) => {
        const categories = await models_1.Opportunity.distinct('category', { isActive: true });
        res.json((0, types_1.successResponse)('Categories retrieved', categories));
    }),
};
//# sourceMappingURL=opportunity.controller.js.map