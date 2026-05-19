import { UserRepository } from '@/auth/ports/UserRepository';
import { TokenService } from '@/auth/ports/TokenService';
import { VerificationTokenRepository } from '@/auth/ports/VerificationTokenRepository';
import { EmailService } from '@/auth/ports/EmailService';
import { ValidationError } from '@/auth/core/domain/errors';
import { VerificationToken } from '@/auth/core/domain/VerificationToken';

export interface InitiatePasswordResetInput {
  email: string;
}

export interface InitiatePasswordResetOutput {
  message: string;
}

export class InitiatePasswordResetUseCase {
  constructor(
    private userRepository: UserRepository,
    private tokenService: TokenService,
    private verificationTokenRepository: VerificationTokenRepository,
    private emailService: EmailService
  ) {}

  async execute(input: InitiatePasswordResetInput): Promise<InitiatePasswordResetOutput> {
    // Validate input
    if (!input.email) {
      throw new ValidationError('Email is required');
    }

    // Check if user exists
    const user = await this.userRepository.findByEmail(input.email);
    
    if (!user) {
      // Return generic message for security (don't leak user existence)
      return {
        message: 'If an account exists with this email, a password reset link has been sent.'
      };
    }

    // Clean up existing tokens
    await this.verificationTokenRepository.deleteByEmail(input.email);

    // Generate reset token
    const resetToken = this.tokenService.generateResetToken();
    const verificationToken = VerificationToken.create(input.email, resetToken, 15);

    // Save reset token
    await this.verificationTokenRepository.create(
      input.email,
      resetToken,
      verificationToken.getExpiresAt()
    );

    // Send reset email
    await this.emailService.sendPasswordResetEmail(input.email, resetToken);

    return {
      message: 'If an account exists with this email, a password reset link has been sent.'
    };
  }
}
