"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMarketController = void 0;
const models_1 = require("../../models");
const errorHandler_1 = require("../../middleware/errorHandler");
const types_1 = require("../../utils/types");
const adminAuth_1 = require("../../middleware/adminAuth");
const mongoose_1 = __importDefault(require("mongoose"));
exports.adminMarketController = {
    listBuyers: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { page = 1, limit = 10, type, location, verified, isActive, search } = req.query;
        const filter = {};
        if (type)
            filter.type = type;
        if (location)
            filter.location = location;
        if (verified !== undefined)
            filter.verified = verified === 'true';
        if (isActive !== undefined)
            filter.isActive = isActive === 'true';
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { requiredProduct: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
            ];
        }
        const [buyers, total] = await Promise.all([
            models_1.Buyer.find(filter)
                .sort({ createdAt: -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit))
                .lean(),
            models_1.Buyer.countDocuments(filter),
        ]);
        const types = await models_1.Buyer.distinct('type', { isActive: true });
        res.json((0, types_1.successResponse)('Buyers retrieved', {
            buyers,
            types,
            pagination: (0, types_1.createPaginatedResponse)(buyers, total, Number(page), Number(limit)),
        }));
    }),
    getBuyer: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const buyer = await models_1.Buyer.findById(id).lean();
        if (!buyer) {
            throw new errorHandler_1.AppError('Buyer not found', 404, 'BUYER_NOT_FOUND');
        }
        res.json((0, types_1.successResponse)('Buyer retrieved', buyer));
    }),
    createBuyer: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const admin = authReq.user;
        const buyer = await models_1.Buyer.create({
            ...req.body,
            createdBy: admin._id,
        });
        void (0, adminAuth_1.createAuditLog)(admin._id.toString(), admin.phone, 'create', 'buyer', buyer._id?.toString(), { buyer: req.body }, req);
        res.status(201).json((0, types_1.successResponse)('Buyer created', buyer));
    }),
    updateBuyer: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const authReq = req;
        const admin = authReq.user;
        const buyer = await models_1.Buyer.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!buyer) {
            throw new errorHandler_1.AppError('Buyer not found', 404, 'BUYER_NOT_FOUND');
        }
        void (0, adminAuth_1.createAuditLog)(admin._id.toString(), admin.phone, 'update', 'buyer', id, { updates: req.body }, req);
        res.json((0, types_1.successResponse)('Buyer updated', buyer));
    }),
    deleteBuyer: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const authReq = req;
        const admin = authReq.user;
        const buyer = await models_1.Buyer.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!buyer) {
            throw new errorHandler_1.AppError('Buyer not found', 404, 'BUYER_NOT_FOUND');
        }
        void (0, adminAuth_1.createAuditLog)(admin._id.toString(), admin.phone, 'delete', 'buyer', id, {}, req);
        res.json((0, types_1.successResponse)('Buyer deleted', null));
    }),
    listOrders: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { page = 1, limit = 10, status, paymentStatus, search } = req.query;
        const filter = {};
        if (status)
            filter.status = status;
        if (paymentStatus)
            filter.paymentStatus = paymentStatus;
        if (search) {
            filter.$or = [
                { 'items.productName': { $regex: search, $options: 'i' } },
            ];
        }
        const [orders, total] = await Promise.all([
            models_1.Order.find(filter)
                .sort({ createdAt: -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit))
                .populate('userId', 'name phone')
                .populate('buyerId', 'name')
                .lean(),
            models_1.Order.countDocuments(filter),
        ]);
        res.json((0, types_1.successResponse)('Orders retrieved', (0, types_1.createPaginatedResponse)(orders, total, Number(page), Number(limit))));
    }),
    getOrder: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const order = await models_1.Order.findById(id)
            .populate('userId', 'name phone')
            .populate('buyerId', 'name')
            .populate('items.productId', 'name')
            .lean();
        if (!order) {
            throw new errorHandler_1.AppError('Order not found', 404, 'ORDER_NOT_FOUND');
        }
        res.json((0, types_1.successResponse)('Order retrieved', order));
    }),
    updateOrderStatus: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { status, paymentStatus } = req.body;
        const authReq = req;
        const admin = authReq.user;
        const updates = {};
        if (status)
            updates.status = status;
        if (paymentStatus)
            updates.paymentStatus = paymentStatus;
        const order = await models_1.Order.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!order) {
            throw new errorHandler_1.AppError('Order not found', 404, 'ORDER_NOT_FOUND');
        }
        void (0, adminAuth_1.createAuditLog)(admin._id.toString(), admin.phone, 'update', 'order', id, { status, paymentStatus }, req);
        res.json((0, types_1.successResponse)('Order updated', order));
    }),
    listRequests: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { page = 1, limit = 10, type, status, search } = req.query;
        const filter = {};
        if (type)
            filter.type = type;
        if (status)
            filter.status = status;
        const [requests, total] = await Promise.all([
            models_1.MarketRequest.find(filter)
                .sort({ createdAt: -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit))
                .populate('userId', 'name phone')
                .populate('buyerId', 'name')
                .populate('productId', 'name')
                .lean(),
            models_1.MarketRequest.countDocuments(filter),
        ]);
        res.json((0, types_1.successResponse)('Market requests retrieved', (0, types_1.createPaginatedResponse)(requests, total, Number(page), Number(limit))));
    }),
    updateRequest: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { status, response } = req.body;
        const authReq = req;
        const admin = authReq.user;
        const updates = {};
        if (status)
            updates.status = status;
        if (response !== undefined) {
            updates.response = response;
            updates.respondedAt = new Date();
        }
        const request = await models_1.MarketRequest.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!request) {
            throw new errorHandler_1.AppError('Request not found', 404, 'REQUEST_NOT_FOUND');
        }
        void (0, adminAuth_1.createAuditLog)(admin._id.toString(), admin.phone, 'update', 'marketRequest', id, { status, response }, req);
        res.json((0, types_1.successResponse)('Request updated', request));
    }),
    getFundingApplications: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { page = 1, limit = 10, status, search } = req.query;
        const filter = {};
        if (status)
            filter.status = status;
        const FundingApplication = mongoose_1.default.model('FundingApplication');
        const [applications, total] = await Promise.all([
            FundingApplication.find(filter)
                .sort({ createdAt: -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit))
                .populate('userId', 'name phone')
                .populate('schemeId', 'name')
                .populate('reviewedBy', 'name')
                .lean(),
            FundingApplication.countDocuments(filter),
        ]);
        res.json((0, types_1.successResponse)('Funding applications retrieved', (0, types_1.createPaginatedResponse)(applications, total, Number(page), Number(limit))));
    }),
    updateFundingApplication: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { status, rejectionReason, notes } = req.body;
        const authReq = req;
        const admin = authReq.user;
        const FundingApplication = mongoose_1.default.model('FundingApplication');
        const updates = {};
        if (status)
            updates.status = status;
        if (rejectionReason)
            updates.rejectionReason = rejectionReason;
        if (notes && notes.length > 0) {
            updates.notes = notes;
            updates.reviewedAt = new Date();
            updates.reviewedBy = admin._id;
        }
        const application = await FundingApplication.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });
        if (!application) {
            throw new errorHandler_1.AppError('Funding application not found', 404, 'FUNDING_APPLICATION_NOT_FOUND');
        }
        void (0, adminAuth_1.createAuditLog)(admin._id.toString(), admin.phone, 'update', 'fundingApplication', id, { status, rejectionReason, notes }, req);
        res.json((0, types_1.successResponse)('Funding application updated', application));
    }),
};
//# sourceMappingURL=market.controller.js.map