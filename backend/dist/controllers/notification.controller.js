"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = void 0;
const models_1 = require("../models");
const errorHandler_1 = require("../middleware/errorHandler");
const types_1 = require("../utils/types");
const mongoose_1 = __importDefault(require("mongoose"));
exports.notificationController = {
    list: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const userId = authReq.user._id.toString();
        const { page = 1, limit = 20, type, isRead } = req.query;
        const filter = { userId: new mongoose_1.default.Types.ObjectId(userId) };
        if (type)
            filter.type = type;
        if (isRead !== undefined)
            filter.isRead = isRead === 'true';
        const skip = (Number(page) - 1) * Number(limit);
        const [notifications, total] = await Promise.all([
            models_1.Notification.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
            models_1.Notification.countDocuments(filter),
        ]);
        res.json((0, types_1.successResponse)('Notifications retrieved', (0, types_1.createPaginatedResponse)(notifications, total, Number(page), Number(limit))));
    }),
    markRead: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const authReq = req;
        const userId = authReq.user._id.toString();
        const notification = await models_1.Notification.findOneAndUpdate({ _id: id, userId: new mongoose_1.default.Types.ObjectId(userId) }, { isRead: true, readAt: new Date() }, { new: true });
        if (!notification) {
            throw new errorHandler_1.AppError('Notification not found', 404, 'NOTIFICATION_NOT_FOUND');
        }
        res.json((0, types_1.successResponse)('Notification marked as read', notification));
    }),
    markAllRead: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authReq = req;
        const userId = authReq.user._id.toString();
        await models_1.Notification.updateMany({ userId: new mongoose_1.default.Types.ObjectId(userId), isRead: false }, { isRead: true, readAt: new Date() });
        res.json((0, types_1.successResponse)('All notifications marked as read', null));
    }),
    deleteNotification: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const authReq = req;
        const userId = authReq.user._id.toString();
        const notification = await models_1.Notification.findOneAndDelete({
            _id: id,
            userId: new mongoose_1.default.Types.ObjectId(userId),
        });
        if (!notification) {
            throw new errorHandler_1.AppError('Notification not found', 404, 'NOTIFICATION_NOT_FOUND');
        }
        res.json((0, types_1.successResponse)('Notification deleted', null));
    }),
};
//# sourceMappingURL=notification.controller.js.map