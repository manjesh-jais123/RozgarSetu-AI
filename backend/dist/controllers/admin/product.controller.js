"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminProductController = void 0;
const models_1 = require("../../models");
const errorHandler_1 = require("../../middleware/errorHandler");
const types_1 = require("../../utils/types");
const adminAuth_1 = require("../../middleware/adminAuth");
exports.adminProductController = {
    categories: (0, errorHandler_1.asyncHandler)(async (_req, res) => {
        const categories = await models_1.Product.distinct('category', { isActive: true });
        res.json((0, types_1.successResponse)('Categories retrieved', categories));
    }),
    list: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { page = 1, limit = 10, category, moderationStatus, status, search } = req.query;
        const filter = { isActive: true };
        if (category)
            filter.category = category;
        if (moderationStatus)
            filter.moderationStatus = moderationStatus;
        if (status)
            filter.status = status;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }
        const [products, total] = await Promise.all([
            models_1.Product.find(filter)
                .sort({ createdAt: -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit))
                .populate('userId', 'name phone')
                .lean(),
            models_1.Product.countDocuments(filter),
        ]);
        const categories = await models_1.Product.distinct('category', { isActive: true });
        res.json((0, types_1.successResponse)('Products retrieved', {
            products,
            categories,
            pagination: (0, types_1.createPaginatedResponse)(products, total, Number(page), Number(limit)),
        }));
    }),
    get: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const product = await models_1.Product.findById(id).populate('userId', 'name phone').lean();
        if (!product) {
            throw new errorHandler_1.AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
        }
        res.json((0, types_1.successResponse)('Product retrieved', product));
    }),
    moderate: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { moderationStatus, moderationNote, category, status } = req.body;
        const authReq = req;
        const admin = authReq.user;
        const updates = {
            moderationStatus,
            moderatorId: admin._id,
            moderationAt: new Date(),
        };
        if (moderationNote)
            updates.moderationNote = moderationNote;
        if (category)
            updates.category = category;
        if (status)
            updates.status = status;
        const product = await models_1.Product.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        }).populate('userId', 'name phone');
        if (!product) {
            throw new errorHandler_1.AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
        }
        void (0, adminAuth_1.createAuditLog)(admin._id.toString(), admin.phone, moderationStatus === 'approved' ? 'approve' : moderationStatus === 'rejected' ? 'reject' : 'update', 'product', id, { moderationStatus, moderationNote, category, status }, req);
        res.json((0, types_1.successResponse)('Product moderated', product));
    }),
    update: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const authReq = req;
        const admin = authReq.user;
        const product = await models_1.Product.findByIdAndUpdate(id, { ...req.body }, { new: true, runValidators: true }).populate('userId', 'name phone');
        if (!product) {
            throw new errorHandler_1.AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
        }
        void (0, adminAuth_1.createAuditLog)(admin._id.toString(), admin.phone, 'update', 'product', id, { updates: req.body }, req);
        res.json((0, types_1.successResponse)('Product updated', product));
    }),
    delete: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const authReq = req;
        const admin = authReq.user;
        const product = await models_1.Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!product) {
            throw new errorHandler_1.AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
        }
        void (0, adminAuth_1.createAuditLog)(admin._id.toString(), admin.phone, 'delete', 'product', id, {}, req);
        res.json((0, types_1.successResponse)('Product deleted', null));
    }),
};
//# sourceMappingURL=product.controller.js.map