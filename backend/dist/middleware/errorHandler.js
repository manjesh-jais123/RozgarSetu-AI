"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.notFoundHandler = exports.errorHandler = exports.AppError = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../utils/logger");
class AppError extends Error {
    statusCode;
    code;
    details;
    constructor(message, statusCode, code, details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
next) => {
    logger_1.logger.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    }, 'Error occurred');
    let statusCode = 500;
    let code = 'INTERNAL_ERROR';
    let message = 'Internal server error';
    let details = undefined;
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        code = err.code;
        message = err.message;
        details = err.details;
    }
    else if (err instanceof zod_1.ZodError) {
        statusCode = 400;
        code = 'VALIDATION_ERROR';
        message = 'Validation failed';
        details = err.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
        }));
    }
    else if (err instanceof mongoose_1.default.Error.ValidationError) {
        statusCode = 400;
        code = 'VALIDATION_ERROR';
        message = 'Database validation failed';
        details = Object.values(err.errors).map(e => ({
            field: e.path,
            message: e.message,
        }));
    }
    else if (err instanceof mongoose_1.default.Error.CastError) {
        statusCode = 400;
        code = 'INVALID_ID';
        message = 'Invalid ID format';
        details = { path: err.path, value: err.value };
    }
    else if (err.name === 'MongoServerError' && err.code === 11000) {
        statusCode = 409;
        code = 'DUPLICATE_ENTRY';
        message = 'Duplicate entry';
        details = err.keyValue;
    }
    else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        code = 'INVALID_TOKEN';
        message = 'Invalid token';
    }
    else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        code = 'TOKEN_EXPIRED';
        message = 'Token expired';
    }
    const response = {
        success: false,
        message,
        data: null,
        error: { code, details },
    };
    res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    const response = {
        success: false,
        message: `Route ${req.method} ${req.path} not found`,
        data: null,
        error: { code: 'NOT_FOUND', details: 'Endpoint does not exist' },
    };
    res.status(404).json(response);
};
exports.notFoundHandler = notFoundHandler;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        return Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=errorHandler.js.map