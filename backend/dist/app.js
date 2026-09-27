"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = require("./config");
const logger_1 = require("./utils/logger");
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const rateLimiter_1 = require("./middleware/rateLimiter");
const validation_1 = require("./middleware/validation");
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'", config_1.config.frontendUrl],
                fontSrc: ["'self'", "https:", "data:"],
            },
        },
    }));
    app.use((0, cors_1.default)({
        origin: config_1.config.frontendUrl,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    app.use((0, compression_1.default)());
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
    app.use(validation_1.sanitize);
    if (config_1.config.nodeEnv !== 'production') {
        app.use((0, morgan_1.default)('dev', {
            stream: {
                write: (message) => logger_1.logger.info(message.trim()),
            },
        }));
    }
    app.get('/health', (req, res) => {
        res.json({
            success: true,
            message: 'RozgarSetu AI Backend is healthy',
            data: {
                status: 'ok',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
            },
            error: null,
        });
    });
    app.use(rateLimiter_1.globalRateLimiter);
    app.use('/api', routes_1.default);
    app.use('/api', (req, res) => {
        res.status(404).json({
            success: false,
            message: `Route ${req.method} ${req.path} not found`,
            data: null,
            error: { code: 'NOT_FOUND', details: 'Endpoint does not exist' },
        });
    });
    app.use(errorHandler_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map