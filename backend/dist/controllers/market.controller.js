"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketController = void 0;
const models_1 = require("../models");
const errorHandler_1 = require("../middleware/errorHandler");
const types_1 = require("../utils/types");
const mongoose_1 = __importDefault(require("mongoose"));
exports.marketController = {
    getBuyers: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { page = 1, limit = 10, type, product, location, verified, search } = req.query;
        void product;
        const filter = { isActive: true };
        if (type)
            filter.type = type;
        if (location)
            filter.location = location;
        if (verified)
            filter.verified = verified === 'true';
        if (product)
            filter.requiredProduct = { $regex: product, $options: 'i' };
        if (search) {
            filter.$text = { $search: search };
        }
        const skip = (Number(page) - 1) * Number(limit);
        const [buyers, total] = await Promise.all([
            models_1.Buyer.find(filter).skip(skip).limit(Number(limit)).sort({ matchPercentage: -1 }),
            models_1.Buyer.countDocuments(filter),
        ]);
        res.json((0, types_1.successResponse)('Buyers retrieved', (0, types_1.createPaginatedResponse)(buyers, total, Number(page), Number(limit))));
    }),
    getBuyer: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const buyer = await models_1.Buyer.findById(id).lean();
        if (!buyer || !buyer.isActive) {
            throw new errorHandler_1.AppError('Buyer not found', 404, 'BUYER_NOT_FOUND');
        }
        res.json((0, types_1.successResponse)('Buyer retrieved', buyer));
    }),
    connectWithBuyer: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const authReq = req;
        const userId = authReq.user._id.toString();
        const { message } = req.body;
        const buyer = await models_1.Buyer.findById(id);
        if (!buyer || !buyer.isActive) {
            throw new errorHandler_1.AppError('Buyer not found', 404, 'BUYER_NOT_FOUND');
        }
        const request = await models_1.MarketRequest.create({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            buyerId: new mongoose_1.default.Types.ObjectId(id),
            type: 'connect',
            message,
            status: 'pending',
        });
        res.status(201).json((0, types_1.successResponse)('Connection request sent', request));
    }),
    submitRfq: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const userId = authReq.user._id.toString();
        const { productId, buyerId, message, quantity } = req.body;
        const request = await models_1.MarketRequest.create({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            productId: productId ? new mongoose_1.default.Types.ObjectId(productId) : undefined,
            buyerId: buyerId ? new mongoose_1.default.Types.ObjectId(buyerId) : undefined,
            type: 'rfq',
            message,
            quantity,
            status: 'pending',
        });
        res.status(201).json((0, types_1.successResponse)('RFQ submitted', request));
    }),
    createOrder: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const userId = authReq.user._id.toString();
        const { buyerId, items, shippingAddress, paymentMethod, notes } = req.body;
        const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
        const order = await models_1.Order.create({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            buyerId: buyerId ? new mongoose_1.default.Types.ObjectId(buyerId) : undefined,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod,
            notes,
            status: 'pending',
            paymentStatus: 'pending',
        });
        res.status(201).json((0, types_1.successResponse)('Order created', order));
    }),
    listOrders: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const userId = authReq.user._id.toString();
        const { page = 1, limit = 10, status } = req.query;
        const filter = { userId: new mongoose_1.default.Types.ObjectId(userId) };
        if (status)
            filter.status = status;
        const skip = (Number(page) - 1) * Number(limit);
        const [orders, total] = await Promise.all([
            models_1.Order.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
            models_1.Order.countDocuments(filter),
        ]);
        res.json((0, types_1.successResponse)('Orders retrieved', (0, types_1.createPaginatedResponse)(orders, total, Number(page), Number(limit))));
    }),
    getOrder: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const authReq = req;
        const userId = authReq.user._id.toString();
        const order = await models_1.Order.findOne({ _id: id, userId: new mongoose_1.default.Types.ObjectId(userId) });
        if (!order) {
            throw new errorHandler_1.AppError('Order not found', 404, 'ORDER_NOT_FOUND');
        }
        res.json((0, types_1.successResponse)('Order retrieved', order));
    }),
    listRequests: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const userId = authReq.user._id.toString();
        const { page = 1, limit = 10, type, status } = req.query;
        const filter = { userId: new mongoose_1.default.Types.ObjectId(userId) };
        if (type)
            filter.type = type;
        if (status)
            filter.status = status;
        const skip = (Number(page) - 1) * Number(limit);
        const [requests, total] = await Promise.all([
            models_1.MarketRequest.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
            models_1.MarketRequest.countDocuments(filter),
        ]);
        res.json((0, types_1.successResponse)('Market requests retrieved', (0, types_1.createPaginatedResponse)(requests, total, Number(page), Number(limit))));
    }),
};
//# sourceMappingURL=market.controller.js.map