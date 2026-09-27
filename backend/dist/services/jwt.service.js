"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtService = exports.JWTService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
class JWTService {
    static generateTokens(user) {
        const payload = {
            userId: user._id.toString(),
            role: user.role,
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, config_1.config.jwt.secret, {
            expiresIn: config_1.config.jwt.accessExpiry,
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, config_1.config.jwt.refreshSecret, {
            expiresIn: config_1.config.jwt.refreshExpiry,
        });
        return { accessToken, refreshToken };
    }
    static verifyAccessToken(token) {
        return jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
    }
    static verifyRefreshToken(token) {
        return jsonwebtoken_1.default.verify(token, config_1.config.jwt.refreshSecret);
    }
    static decodeToken(token) {
        try {
            return jsonwebtoken_1.default.decode(token);
        }
        catch {
            return null;
        }
    }
    static extractTokenFromHeader(authHeader) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.split(' ')[1];
    }
}
exports.JWTService = JWTService;
exports.jwtService = JWTService;
//# sourceMappingURL=jwt.service.js.map