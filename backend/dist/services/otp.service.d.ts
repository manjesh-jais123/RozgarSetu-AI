export declare class OTPService {
    private static instance;
    static getInstance(): OTPService;
    sendOTP(phone: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private sendMockOTP;
    private sendRealOTP;
    verifyOTP(phone: string, otp: string): Promise<{
        success: boolean;
        message: string;
    }>;
    resendOTP(phone: string): Promise<{
        success: boolean;
        message: string;
    }>;
    clearOTP(phone: string): void;
    cleanupExpired(): void;
}
export declare const otpService: OTPService;
//# sourceMappingURL=otp.service.d.ts.map