# Auth Backend - Hexagonal Architecture

## Overview

The auth backend has been refactored to follow the **Hexagonal Architecture** (also known as Ports & Adapters). This design pattern isolates the core business logic from external dependencies, making the system more testable, maintainable, and flexible.

## Architecture Layers

### 1. **Core Domain** (`/src/auth/core/domain/`)
Contains pure business logic and domain entities with no external dependencies.

- **Entities:**
  - `User.ts` - Domain model for users with business rules
  - `VerificationToken.ts` - Domain model for OTP/reset tokens

- **Errors:**
  - `AuthenticationError.ts` - Thrown on failed authentication
  - `ValidationError.ts` - Thrown on invalid input
  - `NotFoundError.ts` - Thrown when resources don't exist

- **Use Cases** (`/core/usecases/`):
  - `AuthenticateUserUseCase` - Authenticates user by email/password
  - `RegisterUserUseCase` - Registers new users with email verification
  - `VerifyEmailUseCase` - Verifies user email via OTP
  - `InitiatePasswordResetUseCase` - Initiates password recovery flow
  - `ResetPasswordUseCase` - Completes password reset with token

### 2. **Ports (Interfaces)** (`/src/auth/ports/`)
Define contracts that the core domain needs from external systems. These are **interfaces only** - no implementation.

- `UserRepository` - Interface for user persistence operations
- `VerificationTokenRepository` - Interface for token persistence
- `PasswordHasher` - Interface for password hashing
- `TokenService` - Interface for generating tokens
- `EmailService` - Interface for sending emails

### 3. **Adapters (Implementations)** (`/src/auth/adapters/`)
Implement the ports using specific technologies. Adapters are pluggable and can be swapped.

**Repositories** (`/adapters/repositories/`):
- `MongoUserRepository` - MongoDB implementation for user storage
- `MongoVerificationTokenRepository` - MongoDB implementation for token storage

**Services** (`/adapters/services/`):
- `BcryptPasswordHasher` - bcryptjs implementation
- `DefaultTokenService` - Generates OTPs and reset tokens
- `ConsoleEmailService` - Console logging for development (can be replaced with SendGrid, AWS SES, etc.)

### 4. **Dependency Injection Container** (`/src/auth/container.ts`)
Orchestrates object creation and wires all dependencies together. Single point of configuration.

### 5. **API Routes** (`/src/app/api/auth/*/route-hexagonal.ts`)
HTTP handlers that:
1. Accept requests
2. Call use cases from the container
3. Handle errors and return responses

## Benefits

✅ **Testability** - Mock ports and test use cases in isolation  
✅ **Maintainability** - Clear separation of concerns  
✅ **Flexibility** - Swap implementations (e.g., PostgreSQL instead of MongoDB)  
✅ **Scalability** - Add new features without modifying core logic  
✅ **Encapsulation** - Business rules live in one place  

## Data Flow

```
HTTP Request
    ↓
Route Handler (API endpoint)
    ↓
Use Case (business logic)
    ↓
Ports (interfaces)
    ↓
Adapters (implementations)
    ↓
External Systems (MongoDB, bcryptjs, etc.)
```

## Example: User Registration

```
1. POST /api/auth/signup
2. route-hexagonal.ts calls authContainer.registerUserUseCase
3. RegisterUserUseCase:
   - Validates input via ValidationError
   - Checks user exists via UserRepository port
   - Hashes password via PasswordHasher port
   - Creates user via UserRepository port
   - Generates OTP via TokenService port
   - Saves token via VerificationTokenRepository port
   - Sends email via EmailService port
4. Returns RegisterUserOutput to client
```

## How to Add New Features

### Example: Add SMS for OTP Delivery

1. Create new port: `SMSService.ts`
2. Create adapter: `TwilioSMSService.ts` implementing SMSService
3. Add to container in `container.ts`
4. Update use case to accept SMS service
5. Inject it into use case

✅ **No changes needed to existing code!**

## Testing Example

```typescript
// Mock all ports
const mockUserRepository = {} as UserRepository;
const mockPasswordHasher = {} as PasswordHasher;

// Test use case with mocks
const useCase = new AuthenticateUserUseCase(
  mockUserRepository,
  mockPasswordHasher
);

// Test business logic in isolation
await useCase.execute({ email: 'test@example.com', password: 'pwd' });
```

## Migration Guide

### Old Code (Monolithic)
```typescript
// Routes directly call DB, no abstraction
const user = await User.findOne({ email });
const hash = bcrypt.compare(password, user.password);
```

### New Code (Hexagonal)
```typescript
// Use cases contain business logic
const result = await authContainer.authenticateUserUseCase.execute({
  email,
  password
});
```

## File Structure

```
src/auth/
├── core/
│   ├── domain/
│   │   ├── User.ts
│   │   ├── VerificationToken.ts
│   │   └── errors/
│   │       ├── AuthenticationError.ts
│   │       ├── ValidationError.ts
│   │       └── NotFoundError.ts
│   └── usecases/
│       ├── AuthenticateUserUseCase.ts
│       ├── RegisterUserUseCase.ts
│       ├── VerifyEmailUseCase.ts
│       ├── InitiatePasswordResetUseCase.ts
│       └── ResetPasswordUseCase.ts
├── ports/
│   ├── UserRepository.ts
│   ├── VerificationTokenRepository.ts
│   ├── PasswordHasher.ts
│   ├── TokenService.ts
│   └── EmailService.ts
├── adapters/
│   ├── repositories/
│   │   ├── MongoUserRepository.ts
│   │   └── MongoVerificationTokenRepository.ts
│   └── services/
│       ├── BcryptPasswordHasher.ts
│       ├── DefaultTokenService.ts
│       └── ConsoleEmailService.ts
└── container.ts
```

## Next Steps

1. **Integrate API Routes**: Replace existing routes with `route-hexagonal.ts` versions
2. **Add Tests**: Create unit tests using mocked ports
3. **Implement Email Service**: Replace ConsoleEmailService with SendGrid/AWS SES
4. **Add More Use Cases**: RefreshTokenUseCase, LogoutUseCase, etc.
5. **Create Admin Use Cases**: Authorize providers, suspend users, etc.
