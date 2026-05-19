import { VerificationTokenRepository } from '@/auth/ports/VerificationTokenRepository';
import { UserRepository } from '@/auth/ports/UserRepository';
import { ValidationError, NotFoundError } from '@/auth/core/domain/errors';

export interface VerifyEmailInput {
  email: string;
  token: string;
}

export interface VerifyEmailOutput {
  message: string;
  email: string;
}

export class VerifyEmailUseCase {
  constructor(
    private verificationTokenRepository: VerificationTokenRepository,
    private userRepository: UserRepository
  ) {}

  async execute(input: VerifyEmailInput): Promise<VerifyEmailOutput> {
    // Validate input
    if (!input.email || !input.token) {
      throw new ValidationError('Email and token are required');
    }

    // Find verification token
    const verificationToken = await this.verificationTokenRepository.findByEmailAndToken(
      input.email,
      input.token
    );

    if (!verificationToken) {
      throw new ValidationError('Invalid or expired OTP');
    }

    // Check if token is expired
    if (verificationToken.isExpired()) {
      throw new ValidationError('OTP has expired');
    }

    // Find user
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Mark email as verified
    await this.userRepository.update(user.getId(), {
      emailVerified: new Date()
    });

    // Delete verification token
    await this.verificationTokenRepository.deleteByEmail(input.email);

    return {
      message: 'Email verified successfully',
      email: input.email
    };
  }
}
