export declare const config: {
    port: number;
    nodeEnv: string;
    mongodbUri: string;
    jwt: {
        secret: string;
        refreshSecret: string;
        accessExpiry: string;
        refreshExpiry: string;
    };
    otp: {
        provider: string;
        expiryMinutes: number;
        length: number;
    };
    llm: {
        apiKey: string | undefined;
        provider: string;
        model: string;
        useMock: boolean;
    };
    frontendUrl: string;
    rateLimit: {
        windowMs: number;
        maxRequests: number;
    };
    logLevel: string;
};
//# sourceMappingURL=index.d.ts.map