import { AuthenticateUserUseCase } from './core/usecases/AuthenticateUserUseCase';
import { RegisterUserUseCase } from './core/usecases/RegisterUserUseCase';
import { VerifyEmailUseCase } from './core/usecases/VerifyEmailUseCase';
import { InitiatePasswordResetUseCase } from './core/usecases/InitiatePasswordResetUseCase';
import { ResetPasswordUseCase } from './core/usecases/ResetPasswordUseCase';

// Error classes
export { AuthenticationError } from './core/domain/errors/AuthenticationError';
export { ValidationError } from './core/domain/errors/ValidationError';
export { NotFoundError } from './core/domain/errors/NotFoundError';

// Domain models
export { User } from './core/domain/User';
export { VerificationToken } from './core/domain/VerificationToken';

// Port interfaces
export type { UserRepository } from './ports/UserRepository';
export type { VerificationTokenRepository } from './ports/VerificationTokenRepository';
export type { PasswordHasher } from './ports/PasswordHasher';
export type { TokenService } from './ports/TokenService';
export type { EmailService } from './ports/EmailService';

// Use case exports
export type { AuthenticateUserInput, AuthenticateUserOutput } from './core/usecases/AuthenticateUserUseCase';
export type { RegisterUserInput, RegisterUserOutput } from './core/usecases/RegisterUserUseCase';
export type { VerifyEmailInput, VerifyEmailOutput } from './core/usecases/VerifyEmailUseCase';
export type { InitiatePasswordResetInput, InitiatePasswordResetOutput } from './core/usecases/InitiatePasswordResetUseCase';
export type { ResetPasswordInput, ResetPasswordOutput } from './core/usecases/ResetPasswordUseCase';

// Container export
export { authContainer } from './container';
