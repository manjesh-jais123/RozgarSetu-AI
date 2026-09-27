"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpService = exports.OTPService = void 0;
const config_1 = require("../config");
const helpers_1 = require("../utils/helpers");
const logger_1 = require("../utils/logger");
const otpStore = new Map();
class OTPService {
    static instance;
    static getInstance() {
        if (!OTPService.instance) {
            OTPService.instance = new OTPService();
        }
        return OTPService.instance;
    }
    async sendOTP(phone) {
        const formattedPhone = (0, helpers_1.formatPhoneNumber)(phone);
        if (config_1.config.otp.provider === 'mock') {
            return this.sendMockOTP(formattedPhone);
        }
        return this.sendRealOTP(formattedPhone);
    }
    async sendMockOTP(phone) {
        const otp = (0, helpers_1.generateOTP)(config_1.config.otp.length);
        const expiresAt = new Date(Date.now() + config_1.config.otp.expiryMinutes * 60 * 1000);
        otpStore.set(phone, {
            otp,
            expiresAt,
            attempts: 0,
        });
        logger_1.logger.info(`Mock OTP sent to ${phone}: ${otp}`);
        return {
            success: true,
            message: 'OTP sent to your phone',
        };
    }
    async sendRealOTP(phone) {
        const otp = (0, helpers_1.generateOTP)(config_1.config.otp.length);
        const expiresAt = new Date(Date.now() + config_1.config.otp.expiryMinutes * 60 * 1000);
        otpStore.set(phone, {
            otp,
            expiresAt,
            attempts: 0,
        });
        logger_1.logger.info(`OTP sent to ${phone}`);
        return {
            success: true,
            message: 'OTP sent to your phone',
        };
    }
    async verifyOTP(phone, otp) {
        const formattedPhone = (0, helpers_1.formatPhoneNumber)(phone);
        const record = otpStore.get(formattedPhone);
        if (!record) {
            return { success: false, message: 'OTP not found or expired' };
        }
        if (record.expiresAt < new Date()) {
            otpStore.delete(formattedPhone);
            return { success: false, message: 'OTP has expired' };
        }
        if (record.attempts >= 3) {
            otpStore.delete(formattedPhone);
            return { success: false, message: 'Too many attempts, please request a new OTP' };
        }
        record.attempts++;
        if (record.otp !== otp) {
            otpStore.set(formattedPhone, record);
            return { success: false, message: 'Invalid OTP' };
        }
        otpStore.delete(formattedPhone);
        return { success: true, message: 'OTP verified successfully' };
    }
    async resendOTP(phone) {
        return this.sendOTP(phone);
    }
    clearOTP(phone) {
        const formattedPhone = (0, helpers_1.formatPhoneNumber)(phone);
        otpStore.delete(formattedPhone);
    }
    cleanupExpired() {
        const now = new Date();
        for (const [phone, record] of otpStore.entries()) {
            if (record.expiresAt < now) {
                otpStore.delete(phone);
            }
        }
    }
}
exports.OTPService = OTPService;
setInterval(() => {
    OTPService.getInstance().cleanupExpired();
}, 5 * 60 * 1000);
exports.otpService = OTPService.getInstance();
//# sourceMappingURL=otp.service.js.map