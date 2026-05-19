import { UserRepository } from '@/auth/ports/UserRepository';
import { PasswordHasher } from '@/auth/ports/PasswordHasher';
import { ValidationError, AuthenticationError } from '@/auth/core/domain/errors';
import { User, UserEntity } from '@/auth/core/domain/User';

export interface AuthenticateUserInput {
  email: string;
  password: string;
}

export interface AuthenticateUserOutput {
  id: string;
  name: string;
  email: string;
  role: string;
  isAuthorized: boolean;
}

export class AuthenticateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher
  ) {}

  async execute(input: AuthenticateUserInput): Promise<AuthenticateUserOutput> {
    // Validate input
    if (!input.email || !input.password) {
      throw new ValidationError('Email and password are required');
    }

    // Find user by email
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await this.passwordHasher.compare(
      input.password,
      user.getPassword()
    );
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive()) {
      throw new AuthenticationError('User account is not active');
    }

    return {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      role: user.getRole(),
      isAuthorized: user.isProviderAuthorized()
    };
  }
}
