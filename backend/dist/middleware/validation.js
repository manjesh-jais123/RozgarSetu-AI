"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitize = exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => {
    return (req, res, next) => {
        try {
            const data = {
                body: req.body,
                query: req.query,
                params: req.params,
            };
            const validated = schema.parse(data);
            req.body = validated.body;
            req.query = validated.query;
            req.params = validated.params;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const details = error.errors.map(e => ({
                    field: e.path.join('.'),
                    message: e.message,
                }));
                const response = {
                    success: false,
                    message: 'Validation failed',
                    data: null,
                    error: { code: 'VALIDATION_ERROR', details: JSON.stringify(details) },
                };
                res.status(400).json(response);
                return;
            }
            next(error);
        }
    };
};
exports.validate = validate;
const sanitize = (req, res, next) => {
    const sanitizeObject = (obj) => {
        if (obj === null || obj === undefined)
            return obj;
        if (typeof obj === 'string') {
            return obj.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        }
        if (Array.isArray(obj)) {
            return obj.map(sanitizeObject);
        }
        if (typeof obj === 'object') {
            const sanitized = {};
            for (const [key, value] of Object.entries(obj)) {
                sanitized[key] = sanitizeObject(value);
            }
            return sanitized;
        }
        return obj;
    };
    req.body = sanitizeObject(req.body);
    req.query = sanitizeObject(req.query);
    next();
};
exports.sanitize = sanitize;
//# sourceMappingURL=validation.js.map