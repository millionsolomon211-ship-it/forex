# Implementation Checklist

## Phase 1: Understand the Architecture ✅ COMPLETED
- [x] Domain entities created (User, VerificationToken)
- [x] Domain errors defined (ValidationError, AuthenticationError, NotFoundError)
- [x] Use cases created (5 core auth use cases)
- [x] Ports (interfaces) defined
- [x] Adapters (implementations) created
- [x] Dependency container wired
- [x] New API routes created

## Phase 2: Activate & Test the New Architecture
- [ ] **Read Documentation** (15 min)
  - [ ] Review `src/auth/README.md` (overview)
  - [ ] Review `src/auth/QUICK_REFERENCE.md` (developer guide)
  - [ ] Review `src/auth/ARCHITECTURE.md` (full details)

- [ ] **Replace Old Routes** (5 min - Choose ONE option)
  
  Option A: Direct Replace (Recommended)
  ```bash
  # Run these commands:
  mv src/app/api/auth/signup/route-hexagonal.ts src/app/api/auth/signup/route.ts
  mv src/app/api/auth/verify-otp/route-hexagonal.ts src/app/api/auth/verify-otp/route.ts
  mv src/app/api/auth/forgot-password/route-hexagonal.ts src/app/api/auth/forgot-password/route.ts
  mv src/app/api/auth/reset-password/route-hexagonal.ts src/app/api/auth/reset-password/route.ts
  ```
  
  Option B: Test Both (Parallel Testing)
  - Keep `route.ts` (old)
  - Keep `route-hexagonal.ts` (new)
  - Test new endpoints at same URLs (they'll override old ones)

- [ ] **Backup Old Routes** (Optional, 2 min)
  ```bash
  # Before replacing, backup old implementations
  mv src/app/api/auth/signup/route.ts src/app/api/auth/signup/route.old.ts
  mv src/app/api/auth/verify-otp/route.ts src/app/api/auth/verify-otp/route.old.ts
  mv src/app/api/auth/forgot-password/route.ts src/app/api/auth/forgot-password/route.old.ts
  mv src/app/api/auth/reset-password/route.ts src/app/api/auth/reset-password/route.old.ts
  ```

- [ ] **Start Dev Server** (2 min)
  ```bash
  npm run dev
  # Server should start without errors
  ```

- [ ] **Test Endpoints** (10 min)
  Use Postman, curl, or Thunder Client to test:
  
  ```bash
  # Test 1: User Registration
  curl -X POST http://localhost:3000/api/auth/signup \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Test User",
      "email": "test@example.com",
      "password": "password123",
      "role": "USER",
      "phoneNumber": "+1234567890",
      "country": "US"
    }'
  
  # Expected: 201 status, redirectUrl in response
  # Check console for OTP (dev-only ConsoleEmailService)
  
  # Test 2: Email Verification (OTP)
  curl -X POST http://localhost:3000/api/auth/verify-otp \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com",
      "token": "123456"  # Use OTP from console
    }'
  
  # Expected: 200 status, success message
  
  # Test 3: Forgot Password
  curl -X POST http://localhost:3000/api/auth/forgot-password \
    -H "Content-Type: application/json" \
    -d '{"email": "test@example.com"}'
  
  # Expected: 200 status
  # Check console for reset token (dev-only)
  
  # Test 4: Reset Password
  curl -X POST http://localhost:3000/api/auth/reset-password \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com",
      "token": "reset-token-from-console",
      "newPassword": "newPassword456"
    }'
  
  # Expected: 200 status, success message
  ```

- [ ] **Verify Build** (5 min)
  ```bash
  npm run build
  # Should complete without TypeScript errors
  ```

## Phase 3: Add Unit Tests (Optional but Recommended)
- [ ] Create `src/auth/__tests__/` directory
- [ ] Create mock ports for testing
- [ ] Write tests for each use case
- [ ] Test error scenarios
- [ ] Achieve >80% code coverage

Example test file:
```typescript
// src/auth/__tests__/RegisterUserUseCase.test.ts
import { RegisterUserUseCase } from '../core/usecases/RegisterUserUseCase';
import { ValidationError } from '@/auth';

describe('RegisterUserUseCase', () => {
  // Create mocks
  // Test valid registration
  // Test duplicate email
  // Test missing fields
  // Test password validation
});
```

## Phase 4: Implement Real Email Service
- [ ] Choose email provider:
  - [ ] SendGrid
  - [ ] AWS SES
  - [ ] Mailgun
  - [ ] Your provider

- [ ] Create adapter: `src/auth/adapters/services/SendGridEmailService.ts`
- [ ] Implement `EmailService` interface
- [ ] Update `container.ts` to use new adapter
- [ ] Test email delivery
- [ ] Add API keys to `.env.local`

Example:
```typescript
// src/auth/adapters/services/SendGridEmailService.ts
import { EmailService } from '@/auth/ports/EmailService';
import sgMail from '@sendgrid/mail';

export class SendGridEmailService implements EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  }

  async sendVerificationEmail(email: string, otp: string): Promise<void> {
    await sgMail.send({
      to: email,
      from: 'noreply@example.com',
      subject: 'Verify your email',
      text: `Your OTP is: ${otp}`,
      html: `<p>Your OTP is: <strong>${otp}</strong></p>`
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    // Similar implementation
  }
}
```

Then update container:
```typescript
import { SendGridEmailService } from '@/auth/adapters/services/SendGridEmailService';

const emailService = new SendGridEmailService();
```

## Phase 5: Add New Use Cases
- [ ] Create `LogoutUseCase` (invalidate session)
- [ ] Create `RefreshTokenUseCase` (refresh JWT)
- [ ] Create `UpdateProfileUseCase` (update user info)
- [ ] Create `ListUsersUseCase` (for admin)
- [ ] Create `AuthorizeProviderUseCase` (for admin approval)

Example:
```typescript
// src/auth/core/usecases/UpdateProfileUseCase.ts
export class UpdateProfileUseCase {
  // ...
}
```

## Phase 6: Database Migration (if switching from MongoDB)
- [ ] Create new repository adapter (e.g., `PostgresUserRepository`)
- [ ] Implement `UserRepository` interface
- [ ] Test with real database
- [ ] Update container to use new adapter
- [ ] Run data migration
- [ ] Verify all endpoints work

## Phase 7: Production Deployment
- [ ] Set environment variables
- [ ] Run production build
- [ ] Test all auth flows
- [ ] Monitor error logs
- [ ] Set up alerts
- [ ] Document production setup

## Troubleshooting

### Error: "Cannot find module '@/auth/container'"
**Solution**: Ensure all files in `src/auth/` exist. Check file paths.

### Error: "ValidationError is not exported"
**Solution**: Import from full path: `@/auth/core/domain/errors/ValidationError`

### Error: "dbConnect is not defined"
**Solution**: Check `MongoUserRepository.ts` - should import `dbConnect` from `@/lib/db`

### Error: "401 Unauthorized after login"
**Solution**: Check NextAuth callbacks in `src/auth.ts` - ensure JWT strategy is configured

### Routes return 500 error
**Solution**: Check browser console and server logs for detailed error messages

## Success Criteria

Your refactoring is complete when:

✅ All tests pass  
✅ All endpoints return correct responses  
✅ Build completes without errors  
✅ No TypeScript errors  
✅ Documentation is updated  
✅ Code is deployed successfully  

## Quick Reference Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Check TypeScript
npx tsc --noEmit

# Format code
npm run format

# Lint code
npm run lint

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## File Locations Quick Reference

| What | Where |
|------|-------|
| Business logic | `src/auth/core/usecases/*.ts` |
| Domain models | `src/auth/core/domain/*.ts` |
| Port interfaces | `src/auth/ports/*.ts` |
| Service adapters | `src/auth/adapters/services/*.ts` |
| Repository adapters | `src/auth/adapters/repositories/*.ts` |
| API routes | `src/app/api/auth/*/route-hexagonal.ts` |
| DI container | `src/auth/container.ts` |

## Getting Help

1. **Architecture Questions** → `src/auth/ARCHITECTURE.md`
2. **How to Use** → `src/auth/QUICK_REFERENCE.md`
3. **Migration Steps** → `src/auth/MIGRATION_GUIDE.md`
4. **Visual Diagrams** → `src/auth/ARCHITECTURE_DIAGRAM.md`
5. **Overview** → `src/auth/README.md`

---

**Status**: ⚠️ PENDING ACTIVATION  
**Next Step**: Read Phase 2 checklist and activate routes
