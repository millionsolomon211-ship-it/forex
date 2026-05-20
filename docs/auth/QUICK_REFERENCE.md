# Auth Backend - Developer Quick Reference

## Import Path

```typescript
// All auth exports from single entry point
import { 
  authContainer,
  ValidationError,
  AuthenticationError,
  User,
  VerificationToken
} from '@/auth';
```

## Using Use Cases

### 1. Authenticate User

```typescript
import { authContainer } from '@/auth';

const result = await authContainer.authenticateUserUseCase.execute({
  email: 'user@example.com',
  password: 'password123'
});

// Returns: { id, name, email, role, isAuthorized }
```

### 2. Register User

```typescript
const result = await authContainer.registerUserUseCase.execute({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securePassword',
  role: 'USER',
  phoneNumber: '+1234567890',
  country: 'US'
});

// Returns: { message, email, redirectUrl }
```

### 3. Verify Email

```typescript
const result = await authContainer.verifyEmailUseCase.execute({
  email: 'user@example.com',
  token: '123456' // OTP
});

// Returns: { message, email }
```

### 4. Initiate Password Reset

```typescript
const result = await authContainer.initiatePasswordResetUseCase.execute({
  email: 'user@example.com'
});

// Returns: { message }
```

### 5. Reset Password

```typescript
const result = await authContainer.resetPasswordUseCase.execute({
  email: 'user@example.com',
  token: 'reset-token',
  newPassword: 'newPassword123'
});

// Returns: { message, email }
```

## Error Handling

```typescript
import { 
  ValidationError, 
  AuthenticationError,
  NotFoundError
} from '@/auth';

try {
  await authContainer.registerUserUseCase.execute(input);
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation errors (400)
    console.error('Validation:', error.message);
  } else if (error instanceof AuthenticationError) {
    // Handle auth errors (401)
    console.error('Auth:', error.message);
  } else if (error instanceof NotFoundError) {
    // Handle not found errors (404)
    console.error('Not found:', error.message);
  } else {
    // Handle unexpected errors (500)
    console.error('Unexpected:', error);
  }
}
```

## Creating a New Use Case

### Step 1: Define Input/Output Interfaces

```typescript
// src/auth/core/usecases/MyNewUseCase.ts

export interface MyNewInput {
  userId: string;
  action: string;
}

export interface MyNewOutput {
  status: 'success' | 'failed';
}
```

### Step 2: Create the Use Case Class

```typescript
export class MyNewUseCase {
  constructor(
    private userRepository: UserRepository,
    // Inject any ports you need
  ) {}

  async execute(input: MyNewInput): Promise<MyNewOutput> {
    // Validate
    if (!input.userId) {
      throw new ValidationError('User ID required');
    }

    // Get user
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Business logic
    // ...

    return { status: 'success' };
  }
}
```

### Step 3: Register in Container

```typescript
// src/auth/container.ts

import { MyNewUseCase } from '@/auth/core/usecases/MyNewUseCase';

export const authContainer = {
  // ... existing use cases
  myNewUseCase: new MyNewUseCase(userRepository)
};
```

### Step 4: Export from Index

```typescript
// src/auth/index.ts

export type { MyNewInput, MyNewOutput } from './core/usecases/MyNewUseCase';
```

### Step 5: Use in Routes

```typescript
// src/app/api/mynew/route.ts

const result = await authContainer.myNewUseCase.execute(input);
```

## Creating a New Adapter

### Step 1: Define the Port (Interface)

```typescript
// src/auth/ports/NewService.ts

export interface NewService {
  doSomething(param: string): Promise<string>;
}
```

### Step 2: Create Adapter Implementation

```typescript
// src/auth/adapters/services/ConcreteNewService.ts

import { NewService } from '@/auth/ports/NewService';

export class ConcreteNewService implements NewService {
  async doSomething(param: string): Promise<string> {
    // Implementation
    return result;
  }
}
```

### Step 3: Inject into Container

```typescript
// src/auth/container.ts

import { ConcreteNewService } from '@/auth/adapters/services/ConcreteNewService';

const newService = new ConcreteNewService();

export const authContainer = {
  // Inject into use cases that need it
  myUseCase: new MyUseCase(..., newService)
};
```

## Testing a Use Case

```typescript
import { RegisterUserUseCase } from '@/auth/core/usecases/RegisterUserUseCase';
import { UserRepository } from '@/auth/ports/UserRepository';
import { PasswordHasher } from '@/auth/ports/PasswordHasher';
import { ValidationError } from '@/auth';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockPasswordHasher: jest.Mocked<PasswordHasher>;

  beforeEach(() => {
    // Create mocks
    mockUserRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      exists: jest.fn()
    } as any;

    mockPasswordHasher = {
      hash: jest.fn().mockResolvedValue('hashed')
    } as any;

    // Create use case with mocks
    useCase = new RegisterUserUseCase(
      mockUserRepository,
      mockPasswordHasher,
      // ... other mocked ports
    );
  });

  test('should throw ValidationError if email missing', async () => {
    await expect(
      useCase.execute({
        name: 'User',
        email: '', // Missing
        password: 'pwd',
        role: 'USER'
      })
    ).rejects.toThrow(ValidationError);
  });

  test('should create user successfully', async () => {
    mockUserRepository.exists.mockResolvedValue(false);

    const result = await useCase.execute({
      name: 'John',
      email: 'john@example.com',
      password: 'password123',
      role: 'USER'
    });

    expect(result.message).toContain('Registration successful');
    expect(mockPasswordHasher.hash).toHaveBeenCalled();
  });
});
```

## File Organization

```
When working on auth, edit these files:

For Business Logic:
  └─ src/auth/core/usecases/*.ts

For Domain Models:
  └─ src/auth/core/domain/*.ts

For New Ports:
  └─ src/auth/ports/*.ts

For New Adapters:
  └─ src/auth/adapters/{repositories|services}/*.ts

For Dependencies:
  └─ src/auth/container.ts

For API Routes:
  └─ src/app/api/auth/*/route-hexagonal.ts
```

## Common Patterns

### Check User Exists
```typescript
const exists = await authContainer.userRepository.findByEmail(email);
if (!exists) {
  throw new ValidationError('Email not found');
}
```

### Hash Password
```typescript
const hashedPassword = await passwordHasher.hash(plainPassword);
```

### Generate Token
```typescript
const otp = tokenService.generateOTP(); // 6 digits
const resetToken = tokenService.generateResetToken(); // Random
```

### Send Email
```typescript
await emailService.sendVerificationEmail(email, otp);
await emailService.sendPasswordResetEmail(email, token);
```

## Debugging

### Enable Debug Logging
```typescript
// In use case
console.log('[DEBUG] Authenticating user:', email);
const user = await this.userRepository.findByEmail(email);
console.log('[DEBUG] User found:', user?.getId());
```

### Mock Console in Tests
```typescript
jest.spyOn(console, 'log').mockImplementation();
// ... run test
console.log.mockRestore();
```

### Check Container Wiring
```typescript
// Verify adapters are properly injected
console.log(authContainer.registerUserUseCase);
```

## Performance Tips

✓ Use mocked adapters in tests  
✓ Cache user lookups if needed (add CacheService port)  
✓ Batch operations in use cases  
✓ Add rate limiting at adapter level  

## Migration Checklist

- [ ] Understand hexagonal architecture
- [ ] Review ARCHITECTURE.md
- [ ] Copy route-hexagonal.ts to route.ts
- [ ] Test all endpoints
- [ ] Create unit tests with mocks
- [ ] Replace email service implementation
- [ ] Add new features using use cases
- [ ] Monitor performance

---

Need help? Check:
- `src/auth/ARCHITECTURE.md` - Full documentation
- `src/auth/MIGRATION_GUIDE.md` - Migration steps
- `src/auth/ARCHITECTURE_DIAGRAM.md` - Visual diagrams
