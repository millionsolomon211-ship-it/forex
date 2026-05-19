import { EmailService } from '@/auth/ports/EmailService';

export class ConsoleEmailService implements EmailService {
  async sendVerificationEmail(email: string, otp: string): Promise<void> {
    console.log(`[DEV] Verification OTP for ${email}: ${otp}`);
    console.log(`[DEV] Verify at: http://localhost:3000/auth/verify-otp?email=${encodeURIComponent(email)}`);
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    console.log(`[DEV] Password reset token for ${email}: ${resetToken}`);
    console.log(`[DEV] Reset link: http://localhost:3000/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`);
  }
}
