export interface TokenService {
  generateOTP(): string;
  generateResetToken(): string;
  validateTokenFormat(token: string): boolean;
}
