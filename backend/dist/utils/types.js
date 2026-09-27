"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaginatedResponse = exports.errorResponse = exports.successResponse = exports.createResponse = void 0;
const createResponse = (success, message, data = null, error = null) => {
    return { success, message, data, error };
};
exports.createResponse = createResponse;
const successResponse = (message, data) => {
    return (0, exports.createResponse)(true, message, data, null);
};
exports.successResponse = successResponse;
const errorResponse = (message, code, details) => {
    return (0, exports.createResponse)(false, message, null, { code, details });
};
exports.errorResponse = errorResponse;
const createPaginatedResponse = (data, total, page, limit) => {
    return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};
exports.createPaginatedResponse = createPaginatedResponse;
//# sourceMappingURL=types.js.map