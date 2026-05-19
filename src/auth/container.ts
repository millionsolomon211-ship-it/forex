// Dependency Injection Container
import { MongoUserRepository } from '@/auth/adapters/repositories/MongoUserRepository';
import { MongoVerificationTokenRepository } from '@/auth/adapters/repositories/MongoVerificationTokenRepository';
import { BcryptPasswordHasher } from '@/auth/adapters/services/BcryptPasswordHasher';
import { DefaultTokenService } from '@/auth/adapters/services/DefaultTokenService';
import { ConsoleEmailService } from '@/auth/adapters/services/ConsoleEmailService';
import { AuthenticateUserUseCase } from '@/auth/core/usecases/AuthenticateUserUseCase';
import { RegisterUserUseCase } from '@/auth/core/usecases/RegisterUserUseCase';
import { VerifyEmailUseCase } from '@/auth/core/usecases/VerifyEmailUseCase';
import { InitiatePasswordResetUseCase } from '@/auth/core/usecases/InitiatePasswordResetUseCase';
import { ResetPasswordUseCase } from '@/auth/core/usecases/ResetPasswordUseCase';

// Create singletons
const userRepository = new MongoUserRepository();
const verificationTokenRepository = new MongoVerificationTokenRepository();
const passwordHasher = new BcryptPasswordHasher();
const tokenService = new DefaultTokenService();
const emailService = new ConsoleEmailService();

// Export use cases
export const authContainer = {
  authenticateUserUseCase: new AuthenticateUserUseCase(userRepository, passwordHasher),
  registerUserUseCase: new RegisterUserUseCase(
    userRepository,
    passwordHasher,
    tokenService,
    verificationTokenRepository,
    emailService
  ),
  verifyEmailUseCase: new VerifyEmailUseCase(verificationTokenRepository, userRepository),
  initiatePasswordResetUseCase: new InitiatePasswordResetUseCase(
    userRepository,
    tokenService,
    verificationTokenRepository,
    emailService
  ),
  resetPasswordUseCase: new ResetPasswordUseCase(
    userRepository,
    passwordHasher,
    verificationTokenRepository
  )
};
