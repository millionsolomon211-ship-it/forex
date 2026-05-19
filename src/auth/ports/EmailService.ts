export interface EmailService {
  sendVerificationEmail(email: string, otp: string): Promise<void>;
  sendPasswordResetEmail(email: string, resetToken: string): Promise<void>;
}
