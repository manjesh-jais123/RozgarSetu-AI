"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = require("./app");
const database_1 = require("./config/database");
const logger_1 = require("./utils/logger");
const config_1 = require("./config");
const startServer = async () => {
    try {
        await (0, database_1.connectDB)();
        const app = (0, app_1.createApp)();
        const server = app.listen(config_1.config.port, () => {
            logger_1.logger.info(`RozgarSetu AI Backend running in ${config_1.config.nodeEnv} mode on port ${config_1.config.port}`);
        });
        process.on('SIGTERM', () => {
            logger_1.logger.info('SIGTERM received, shutting down gracefully');
            server.close(() => {
                logger_1.logger.info('Server closed');
                process.exit(0);
            });
        });
        process.on('SIGINT', () => {
            logger_1.logger.info('SIGINT received, shutting down gracefully');
            server.close(() => {
                logger_1.logger.info('Server closed');
                process.exit(0);
            });
        });
    }
    catch (error) {
        logger_1.logger.error({ error }, 'Failed to start server');
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map