"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminSchemeController = void 0;
const models_1 = require("../../models");
const errorHandler_1 = require("../../middleware/errorHandler");
const types_1 = require("../../utils/types");
const adminAuth_1 = require("../../middleware/adminAuth");
exports.adminSchemeController = {
    list: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { page = 1, limit = 10, category, isVerified, isActive, state, search } = req.query;
        const filter = {};
        if (category)
            filter.category = category;
        if (isVerified !== undefined)
            filter.isVerified = isVerified === 'true';
        if (isActive !== undefined)
            filter.isActive = isActive === 'true';
        if (state)
            filter.stateAvailability = state;
        if (search)
            filter.$text = { $search: search };
        const [schemes, total] = await Promise.all([
            models_1.Scheme.find(filter)
                .sort({ createdAt: -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit))
                .lean(),
            models_1.Scheme.countDocuments(filter),
        ]);
        const categories = await models_1.Scheme.distinct('category', { isActive: true });
        res.json((0, types_1.successResponse)('Schemes retrieved', {
            schemes,
            categories,
            pagination: (0, types_1.createPaginatedResponse)(schemes, total, Number(page), Number(limit)),
        }));
    }),
    get: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const scheme = await models_1.Scheme.findById(id).lean();
        if (!scheme) {
            throw new errorHandler_1.AppError('Scheme not found', 404, 'SCHEME_NOT_FOUND');
        }
        res.json((0, types_1.successResponse)('Scheme retrieved', scheme));
    }),
    create: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const admin = authReq.user;
        const scheme = await models_1.Scheme.create({
            ...req.body,
            createdBy: admin._id,
            lastVerified: req.body.isVerified ? new Date() : null,
        });
        void (0, adminAuth_1.createAuditLog)(admin._id.toString(), admin.phone, 'create', 'scheme', scheme._id?.toString(), { scheme: req.body }, req);
        res.status(201).json((0, types_1.successResponse)('Scheme created', scheme));
    }),
    update: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const authReq = req;
        const admin = authReq.user;
        const updates = { ...req.body };
        if (updates.isVerified === true && !updates.lastVerified) {
            updates.lastVerified = new Date();
        }
        const scheme = await models_1.Scheme.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });
        if (!scheme) {
            throw new errorHandler_1.AppError('Scheme not found', 404, 'SCHEME_NOT_FOUND');
        }
        void (0, adminAuth_1.createAuditLog)(admin._id.toString(), admin.phone, 'update', 'scheme', id, { updates: req.body }, req);
        res.json((0, types_1.successResponse)('Scheme updated', scheme));
    }),
    delete: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const authReq = req;
        const admin = authReq.user;
        const scheme = await models_1.Scheme.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!scheme) {
            throw new errorHandler_1.AppError('Scheme not found', 404, 'SCHEME_NOT_FOUND');
        }
        void (0, adminAuth_1.createAuditLog)(admin._id.toString(), admin.phone, 'delete', 'scheme', id, {}, req);
        res.json((0, types_1.successResponse)('Scheme deleted', null));
    }),
    verify: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const authReq = req;
        const admin = authReq.user;
        const scheme = await models_1.Scheme.findByIdAndUpdate(id, { isVerified: true, lastVerified: new Date() }, { new: true });
        if (!scheme) {
            throw new errorHandler_1.AppError('Scheme not found', 404, 'SCHEME_NOT_FOUND');
        }
        void (0, adminAuth_1.createAuditLog)(admin._id.toString(), admin.phone, 'verify', 'scheme', id, {}, req);
        res.json((0, types_1.successResponse)('Scheme verified', scheme));
    }),
};
//# sourceMappingURL=scheme.controller.js.map