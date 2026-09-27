import { config } from '../config';
import { generateOTP, formatPhoneNumber } from '../utils/helpers';
import { logger } from '../utils/logger';

interface OTPRecord {
  otp: string;
  expiresAt: Date;
  attempts: number;
}

const otpStore = new Map<string, OTPRecord>();

export class OTPService {
  private static instance: OTPService;

  static getInstance(): OTPService {
    if (!OTPService.instance) {
      OTPService.instance = new OTPService();
    }
    return OTPService.instance;
  }

  async sendOTP(phone: string): Promise<{ success: boolean; message: string }> {
    const formattedPhone = formatPhoneNumber(phone);

    if (config.otp.provider === 'mock') {
      return this.sendMockOTP(formattedPhone);
    }

    return this.sendRealOTP(formattedPhone);
  }

  private async sendMockOTP(phone: string): Promise<{ success: boolean; message: string }> {
    const otp = generateOTP(config.otp.length);
    const expiresAt = new Date(Date.now() + config.otp.expiryMinutes * 60 * 1000);

    otpStore.set(phone, {
      otp,
      expiresAt,
      attempts: 0,
    });

    logger.info(`Mock OTP sent to ${phone}: ${otp}`);

    return {
      success: true,
      message: 'OTP sent to your phone',
    };
  }

  private async sendRealOTP(phone: string): Promise<{ success: boolean; message: string }> {
    const otp = generateOTP(config.otp.length);
    const expiresAt = new Date(Date.now() + config.otp.expiryMinutes * 60 * 1000);

    otpStore.set(phone, {
      otp,
      expiresAt,
      attempts: 0,
    });

    logger.info(`OTP sent to ${phone}`);

    return {
      success: true,
      message: 'OTP sent to your phone',
    };
  }

  async verifyOTP(phone: string, otp: string): Promise<{ success: boolean; message: string }> {
    const formattedPhone = formatPhoneNumber(phone);
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

  async resendOTP(phone: string): Promise<{ success: boolean; message: string }> {
    return this.sendOTP(phone);
  }

  clearOTP(phone: string): void {
    const formattedPhone = formatPhoneNumber(phone);
    otpStore.delete(formattedPhone);
  }

  cleanupExpired(): void {
    const now = new Date();
    for (const [phone, record] of otpStore.entries()) {
      if (record.expiresAt < now) {
        otpStore.delete(phone);
      }
    }
  }
}

setInterval(() => {
  OTPService.getInstance().cleanupExpired();
}, 5 * 60 * 1000);

export const otpService = OTPService.getInstance();