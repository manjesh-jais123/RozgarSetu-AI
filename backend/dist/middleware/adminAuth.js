"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAdminAction = exports.auditLog = exports.createAuditLog = exports.adminRateLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
const models_1 = require("../models");
exports.adminRateLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 60 * 1000,
    max: 120,
    message: {
        success: false,
        message: 'Too many admin requests',
        data: null,
        error: { code: 'RATE_LIMIT_EXCEEDED', details: 'Admin rate limit exceeded' },
    },
    standardHeaders: true,
    legacyHeaders: false,
});
const createAuditLog = async (adminId, adminPhone, action, resource, resourceId, details, req) => {
    try {
        await models_1.AuditLog.create({
            adminId: adminId,
            adminPhone,
            action,
            resource,
            resourceId: resourceId || undefined,
            details,
            ipAddress: req?.ip,
            userAgent: req?.get('user-agent'),
        });
    }
    catch (err) {
        console.error('Failed to create audit log:', err);
    }
};
exports.createAuditLog = createAuditLog;
const auditLog = (action, resource) => {
    return async (req, res, next) => {
        res.locals.auditAction = action;
        res.locals.auditResource = resource;
        next();
    };
};
exports.auditLog = auditLog;
const logAdminAction = (req, res, next) => {
    const originalJson = res.json;
    res.json = function (body) {
        const action = res.locals.auditAction;
        const resource = res.locals.auditResource;
        if (action && resource && req.user) {
            void (0, exports.createAuditLog)(req.user._id.toString(), req.user.phone, action, resource, req.params.id, { body: req.body, query: req.query, result: body }, req);
        }
        return originalJson.call(this, body);
    };
    next();
};
exports.logAdminAction = logAdminAction;
//# sourceMappingURL=adminAuth.js.map