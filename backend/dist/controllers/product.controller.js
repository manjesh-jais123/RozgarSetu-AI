"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const models_1 = require("../models");
const errorHandler_1 = require("../middleware/errorHandler");
const types_1 = require("../utils/types");
const mongoose_1 = __importDefault(require("mongoose"));
exports.productController = {
    list: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const userId = authReq.user._id.toString();
        const { page = 1, limit = 10, category, status, search } = req.query;
        const filter = { userId: new mongoose_1.default.Types.ObjectId(userId), isActive: true };
        if (category)
            filter.category = category;
        if (status)
            filter.status = status;
        if (search) {
            filter.$text = { $search: search };
        }
        const skip = (Number(page) - 1) * Number(limit);
        const [products, total] = await Promise.all([
            models_1.Product.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
            models_1.Product.countDocuments(filter),
        ]);
        res.json((0, types_1.successResponse)('Products retrieved', (0, types_1.createPaginatedResponse)(products, total, Number(page), Number(limit))));
    }),
    myProducts: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const userId = authReq.user._id.toString();
        const products = await models_1.Product.find({ userId: new mongoose_1.default.Types.ObjectId(userId), isActive: true }).sort({ createdAt: -1 });
        res.json((0, types_1.successResponse)('Your products', products));
    }),
    get: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const authReq = req;
        const userId = authReq.user._id.toString();
        const product = await models_1.Product.findOne({ _id: id, userId: new mongoose_1.default.Types.ObjectId(userId) });
        if (!product) {
            throw new errorHandler_1.AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
        }
        res.json((0, types_1.successResponse)('Product retrieved', product));
    }),
    create: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const userId = authReq.user._id.toString();
        const product = await models_1.Product.create({
            ...req.body,
            userId: new mongoose_1.default.Types.ObjectId(userId),
        });
        res.status(201).json((0, types_1.successResponse)('Product created', product));
    }),
    update: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const authReq = req;
        const userId = authReq.user._id.toString();
        const product = await models_1.Product.findOneAndUpdate({ _id: id, userId: new mongoose_1.default.Types.ObjectId(userId) }, req.body, { new: true, runValidators: true });
        if (!product) {
            throw new errorHandler_1.AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
        }
        res.json((0, types_1.successResponse)('Product updated', product));
    }),
    delete: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const authReq = req;
        const userId = authReq.user._id.toString();
        const product = await models_1.Product.findOneAndUpdate({ _id: id, userId: new mongoose_1.default.Types.ObjectId(userId) }, { isActive: false }, { new: true });
        if (!product) {
            throw new errorHandler_1.AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
        }
        res.json((0, types_1.successResponse)('Product deleted', null));
    }),
};
//# sourceMappingURL=product.controller.js.map