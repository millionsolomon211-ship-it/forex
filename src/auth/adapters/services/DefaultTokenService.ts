import { TokenService } from '@/auth/ports/TokenService';

export class DefaultTokenService implements TokenService {
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  generateResetToken(): string {
    return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
  }

  validateTokenFormat(token: string): boolean {
    return token && token.length > 0;
  }
}
