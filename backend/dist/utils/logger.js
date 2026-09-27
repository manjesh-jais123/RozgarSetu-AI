"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChildLogger = exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const config_1 = require("../config");
const logger = config_1.config.nodeEnv !== 'production'
    ? (0, pino_1.default)({
        level: config_1.config.logLevel,
        base: { service: 'udyamsetu-ai-backend' },
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    })
    : (0, pino_1.default)({
        level: config_1.config.logLevel,
        base: { service: 'udyamsetu-ai-backend' },
    });
exports.logger = logger;
const createChildLogger = (context) => {
    return logger.child(context);
};
exports.createChildLogger = createChildLogger;
//# sourceMappingURL=logger.js.map