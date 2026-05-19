import { UserRepository } from '@/auth/ports/UserRepository';
import { PasswordHasher } from '@/auth/ports/PasswordHasher';
import { VerificationTokenRepository } from '@/auth/ports/VerificationTokenRepository';
import { ValidationError, NotFoundError } from '@/auth/core/domain/errors';

export interface ResetPasswordInput {
  email: string;
  token: string;
  newPassword: string;
}

export interface ResetPasswordOutput {
  message: string;
  email: string;
}

export class ResetPasswordUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher,
    private verificationTokenRepository: VerificationTokenRepository
  ) {}

  async execute(input: ResetPasswordInput): Promise<ResetPasswordOutput> {
    // Validate input
    if (!input.email || !input.token || !input.newPassword) {
      throw new ValidationError('Email, token, and new password are required');
    }

    if (input.newPassword.length < 6) {
      throw new ValidationError('Password must be at least 6 characters');
    }

    // Verify reset token
    const verificationToken = await this.verificationTokenRepository.findByEmailAndToken(
      input.email,
      input.token
    );

    if (!verificationToken) {
      throw new ValidationError('Invalid or expired reset token');
    }

    // Check if token is expired
    if (verificationToken.isExpired()) {
      throw new ValidationError('Reset token has expired');
    }

    // Find user
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Hash new password
    const hashedPassword = await this.passwordHasher.hash(input.newPassword);

    // Update user password
    await this.userRepository.update(user.getId(), {
      password: hashedPassword
    });

    // Delete reset token
    await this.verificationTokenRepository.deleteByEmail(input.email);

    return {
      message: 'Password reset successfully',
      email: input.email
    };
  }
}
