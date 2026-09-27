"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUserController = void 0;
const models_1 = require("../../models");
const errorHandler_1 = require("../../middleware/errorHandler");
const types_1 = require("../../utils/types");
const adminAuth_1 = require("../../middleware/adminAuth");
const mongoose_1 = __importDefault(require("mongoose"));
exports.adminUserController = {
    list: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { page = 1, limit = 10, role, isActive, onboardingCompleted, state, district, search, sort = 'createdAt', order = 'desc' } = req.query;
        const filter = {};
        if (role)
            filter.role = role;
        if (isActive !== undefined)
            filter.isActive = isActive === 'true';
        if (onboardingCompleted !== undefined)
            filter.onboardingCompleted = onboardingCompleted === 'true';
        if (state)
            filter['location.state'] = state;
        if (district)
            filter['location.district'] = district;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }
        const sortBy = { [sort]: order === 'asc' ? 1 : -1 };
        const [users, total] = await Promise.all([
            models_1.User.find(filter)
                .sort(sortBy)
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit))
                .select('-refreshTokens -password')
                .lean(),
            models_1.User.countDocuments(filter),
        ]);
        res.json((0, types_1.successResponse)('Users retrieved', (0, types_1.createPaginatedResponse)(users, total, Number(page), Number(limit))));
    }),
    get: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const user = await models_1.User.findById(id).select('-refreshTokens -password').lean();
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404, 'USER_NOT_FOUND');
        }
        const [progress, businessPlan, orders, fundingApps] = await Promise.all([
            mongoose_1.default.model('UserProgress').findOne({ userId: user._id }).lean(),
            mongoose_1.default.model('BusinessPlan').findOne({ userId: user._id }).lean(),
            mongoose_1.default.model('Order').find({ userId: user._id }).countDocuments(),
            mongoose_1.default.model('FundingApplication').find({ userId: user._id }).lean(),
        ]);
        res.json((0, types_1.successResponse)('User retrieved', {
            user,
            progress,
            businessPlan,
            orderCount: orders,
            fundingApplications: fundingApps,
        }));
    }),
    update: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { name, phone, email, role, isActive, onboardingCompleted } = req.body;
        const authReq = req;
        const admin = authReq.user;
        const updates = {};
        if (name)
            updates.name = name;
        if (phone)
            updates.phone = phone;
        if (email)
            updates.email = email;
        if (role)
            updates.role = role;
        if (isActive !== undefined)
            updates.isActive = isActive;
        if (onboardingCompleted !== undefined)
            updates.onboardingCompleted = onboardingCompleted;
        const user = await models_1.User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select('-refreshTokens -password');
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404, 'USER_NOT_FOUND');
        }
        void (0, adminAuth_1.createAuditLog)(admin._id.toString(), admin.phone, 'update', 'user', id, { fieldsUpdated: Object.keys(updates) }, req);
        res.json((0, types_1.successResponse)('User updated', user));
    }),
    suspend: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const authReq = req;
        const admin = authReq.user;
        const user = await models_1.User.findByIdAndUpdate(id, { isActive: false }, { new: true }).select('-refreshTokens -password');
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404, 'USER_NOT_FOUND');
        }
        void (0, adminAuth_1.createAuditLog)(admin._id.toString(), admin.phone, 'suspend', 'user', id, { reason: req.body?.reason || 'No reason provided' }, req);
        res.json((0, types_1.successResponse)('User suspended', user));
    }),
    activate: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const authReq = req;
        const admin = authReq.user;
        const user = await models_1.User.findByIdAndUpdate(id, { isActive: true }, { new: true }).select('-refreshTokens -password');
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404, 'USER_NOT_FOUND');
        }
        void (0, adminAuth_1.createAuditLog)(admin._id.toString(), admin.phone, 'activate', 'user', id, {}, req);
        res.json((0, types_1.successResponse)('User activated', user));
    }),
    delete: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const user = await models_1.User.findByIdAndDelete(id);
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404, 'USER_NOT_FOUND');
        }
        res.json((0, types_1.successResponse)('User deleted', null));
    }),
    getAuditLogs: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { page = 1, limit = 50, action, resource, adminId, dateFrom, dateTo } = req.query;
        const filter = {};
        if (action)
            filter.action = action;
        if (resource)
            filter.resource = resource;
        if (adminId)
            filter.adminId = new mongoose_1.default.Types.ObjectId(adminId);
        if (dateFrom || dateTo) {
            filter.createdAt = {};
            if (dateFrom)
                filter.createdAt.$gte = new Date(dateFrom);
            if (dateTo)
                filter.createdAt.$lte = new Date(dateTo);
        }
        const [logs, total] = await Promise.all([
            models_1.AuditLog.find(filter)
                .sort({ createdAt: -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit))
                .populate('adminId', 'name phone role')
                .lean(),
            models_1.AuditLog.countDocuments(filter),
        ]);
        res.json((0, types_1.successResponse)('Audit logs retrieved', (0, types_1.createPaginatedResponse)(logs, total, Number(page), Number(limit))));
    }),
};
//# sourceMappingURL=user.controller.js.map