import { IUser } from '../models';
export interface TokenPayload {
    userId: string;
    role: string;
}
export interface Tokens {
    accessToken: string;
    refreshToken: string;
}
export declare class JWTService {
    static generateTokens(user: IUser): Tokens;
    static verifyAccessToken(token: string): TokenPayload;
    static verifyRefreshToken(token: string): TokenPayload;
    static decodeToken(token: string): TokenPayload | null;
    static extractTokenFromHeader(authHeader: string | undefined): string | null;
}
export declare const jwtService: typeof JWTService;
//# sourceMappingURL=jwt.service.d.ts.map