# Migration: Old Routes → Hexagonal Architecture

## Quick Start

To activate the hexagonal architecture routes:

### Option A: Replace Existing Routes (Recommended)

Rename each `route-hexagonal.ts` to `route.ts`:

```bash
# Signup
mv src/app/api/auth/signup/route-hexagonal.ts src/app/api/auth/signup/route.ts

# Verify OTP
mv src/app/api/auth/verify-otp/route-hexagonal.ts src/app/api/auth/verify-otp/route.ts

# Forgot Password
mv src/app/api/auth/forgot-password/route-hexagonal.ts src/app/api/auth/forgot-password/route.ts

# Reset Password
mv src/app/api/auth/reset-password/route-hexagonal.ts src/app/api/auth/reset-password/route.ts

# Optionally backup old routes
mv src/app/api/auth/signup/route.ts src/app/api/auth/signup/route.old.ts
```

### Option B: Keep Both (For Testing)

Keep both versions and test the new hexagonal routes first:
- Existing routes: `route.ts`
- Hexagonal routes: `route-hexagonal.ts`

New endpoints for testing:
```
Old: POST /api/auth/signup
New: POST /api/auth/signup-hexagonal (if you keep naming)
```

## What Changed

### Before (Monolithic)
```typescript
// src/app/api/auth/signup/route.ts (OLD)
import dbConnect from '@/lib/db';
import User from '@/models/User';
import VerificationToken from '@/models/VerificationToken';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    // Direct DB calls
    await dbConnect();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, role });

    // Token generation embedded in route
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await VerificationToken.create({ email, token: otp, expires: ... });

    return NextResponse.json({ message: 'Registration successful', ... });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### After (Hexagonal)
```typescript
// src/app/api/auth/signup/route-hexagonal.ts (NEW)
import { NextResponse } from 'next/server';
import { authContainer } from '@/auth/container';
import { ValidationError } from '@/auth/core/domain/errors';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // All business logic delegated to use case
    const result = await authContainer.registerUserUseCase.execute(body);
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## API Contracts (No Changes)

The API endpoints remain the same - request/response contracts haven't changed!

### POST /api/auth/signup
```json
// Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword",
  "role": "USER",
  "phoneNumber": "+1234567890",
  "country": "US"
}

// Response
{
  "message": "Registration successful. Please verify your email.",
  "email": "john@example.com",
  "redirectUrl": "/auth/verify-otp?email=john@example.com"
}
```

### POST /api/auth/verify-otp
```json
// Request
{
  "email": "john@example.com",
  "token": "123456"
}

// Response
{
  "message": "Email verified successfully",
  "email": "john@example.com"
}
```

### POST /api/auth/forgot-password
```json
// Request
{ "email": "john@example.com" }

// Response
{
  "message": "If an account exists with this email, a password reset link has been sent."
}
```

### POST /api/auth/reset-password
```json
// Request
{
  "email": "john@example.com",
  "token": "reset-token-here",
  "newPassword": "newSecurePassword"
}

// Response
{
  "message": "Password reset successfully",
  "email": "john@example.com"
}
```

## Error Handling

### Old Error Handling
```typescript
if (!credentials?.email) {
  return null; // Silent failure
}
```

### New Error Handling
```typescript
if (!credentials?.email) {
  throw new ValidationError('Email is required');
}
```

Error types:
- `ValidationError` - Invalid input (400)
- `AuthenticationError` - Auth failed (401)
- `NotFoundError` - Resource missing (404)

## Key Improvements

| Aspect | Before | After |
|--------|--------|-------|
| **Code Location** | Mixed in routes | Organized by layer |
| **Testing** | Hard to mock DB | Easy to mock ports |
| **Dependencies** | Routes depend on everything | Routes only depend on use cases |
| **Business Logic** | Scattered across routes | Centralized in use cases |
| **Adding Features** | Modify multiple routes | Add new use case/adapter |
| **Changing Tech** | Find all references | Update adapter only |

## Common Issues & Solutions

### Issue: "Cannot find module '@/auth/container'"
**Solution**: Ensure all files in `/src/auth/` directory exist before importing

### Issue: TypeScript errors in routes
**Solution**: Run `npm run build` to check for type errors

### Issue: Database connection fails
**Solution**: Check `MongoUserRepository` - it calls `dbConnect()` automatically

### Issue: "ValidationError not exported"
**Solution**: Import from `@/auth/core/domain/errors`

## Rollback Plan

If you need to revert:
```bash
# Rename hexagonal routes back
mv src/app/api/auth/signup/route-hexagonal.ts src/app/api/auth/signup/route-temp.ts

# Restore old routes
mv src/app/api/auth/signup/route.old.ts src/app/api/auth/signup/route.ts
```

## Testing the New Routes

```bash
# Test user registration
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "USER"
  }'

# Test email verification
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "token": "123456"
  }'
```

## Next: Implement Full Hexagonal Design

Once routes are migrated, consider:
1. **Create test suite** using Jest and mock ports
2. **Add admin use cases** for provider authorization
3. **Implement real email service** (SendGrid, AWS SES)
4. **Add rate limiting** in use cases
5. **Add audit logging** at use case level
