import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { config } from '../config';
import { IUser } from '../models';

export interface TokenPayload {
  userId: string;
  role: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export class JWTService {
  static generateTokens(user: IUser): Tokens {
    const payload: TokenPayload = {
      userId: user._id.toString(),
      role: user.role,
    };

    const accessToken = jwt.sign(payload, config.jwt.secret as Secret, {
      expiresIn: config.jwt.accessExpiry as SignOptions['expiresIn'],
    } as SignOptions);

    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret as Secret, {
      expiresIn: config.jwt.refreshExpiry as SignOptions['expiresIn'],
    } as SignOptions);

    return { accessToken, refreshToken };
  }

  static verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, config.jwt.secret as Secret) as TokenPayload;
  }

  static verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, config.jwt.refreshSecret as Secret) as TokenPayload;
  }

  static decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch {
      return null;
    }
  }

  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  }
}

export const jwtService = JWTService;