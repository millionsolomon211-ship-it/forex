# 🏗️ HEXAGONAL ARCHITECTURE - VISUAL GUIDE

## File Structure Overview

```
src/auth/                                 ← NEW HEXAGONAL MODULE
│
├── 📁 core/                             ← BUSINESS LOGIC (No External Dependencies)
│   ├── 📁 domain/
│   │   ├── User.ts                      ← Domain model with rules
│   │   ├── VerificationToken.ts         ← Token domain model
│   │   └── 📁 errors/
│   │       ├── AuthenticationError.ts   ← Custom error types
│   │       ├── ValidationError.ts
│   │       └── NotFoundError.ts
│   │
│   └── 📁 usecases/                     ← Orchestrators
│       ├── AuthenticateUserUseCase.ts   ← Login logic
│       ├── RegisterUserUseCase.ts       ← Signup logic
│       ├── VerifyEmailUseCase.ts        ← Email verification
│       ├── InitiatePasswordResetUseCase.ts ← Forgot password
│       └── ResetPasswordUseCase.ts      ← Password reset
│
├── 📁 ports/                            ← INTERFACES (Contracts)
│   ├── UserRepository.ts                ← What we need from DB
│   ├── VerificationTokenRepository.ts   ← Token storage contract
│   ├── PasswordHasher.ts                ← Password hashing contract
│   ├── TokenService.ts                  ← Token generation contract
│   └── EmailService.ts                  ← Email sending contract
│
├── 📁 adapters/                         ← IMPLEMENTATIONS (Pluggable)
│   ├── 📁 repositories/
│   │   ├── MongoUserRepository.ts       ← MongoDB for users
│   │   └── MongoVerificationTokenRepository.ts ← MongoDB for tokens
│   │
│   └── 📁 services/
│       ├── BcryptPasswordHasher.ts      ← bcryptjs implementation
│       ├── DefaultTokenService.ts       ← Token generation
│       └── ConsoleEmailService.ts       ← Console logging (dev)
│
├── container.ts                         ← DEPENDENCY INJECTION
├── index.ts                             ← CLEAN EXPORTS
│
└── 📄 Documentation/
    ├── README.md                        ← Overview
    ├── ARCHITECTURE.md                  ← Full guide
    ├── ARCHITECTURE_DIAGRAM.md          ← Visual diagrams
    ├── MIGRATION_GUIDE.md               ← Step-by-step
    └── QUICK_REFERENCE.md               ← Developer guide


src/app/api/auth/                        ← API ROUTES
├── signup/
│   ├── route.ts                         ← OLD (keep backup)
│   └── route-hexagonal.ts               ← NEW ✨
├── verify-otp/
│   ├── route.ts                         ← OLD
│   └── route-hexagonal.ts               ← NEW ✨
├── forgot-password/
│   ├── route.ts                         ← OLD
│   └── route-hexagonal.ts               ← NEW ✨
├── reset-password/
│   ├── route.ts                         ← OLD
│   └── route-hexagonal.ts               ← NEW ✨
└── [...nextauth]/
    └── route.ts                         ← UPDATED ✨


src/auth.ts                              ← UPDATED
    └── Uses AuthenticateUserUseCase ✨
```

---

## 🔄 Data Flow Diagram

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     HTTP REQUEST                      ┃
┃     POST /api/auth/signup            ┃
┗━━━━━━━━━━━━┬━━━━━━━━━━━━━━━━━━━━━━━━┛
             │
             ▼
┌─────────────────────────────────────────────┐
│  route-hexagonal.ts (HTTP Adapter)         │
│                                             │
│  1. Parse request body                     │
│  2. Validate JSON format                   │
│  3. Call use case                          │
│  4. Return response                        │
└──────────────┬──────────────────────────────┘
               │
               ▼ authContainer.registerUserUseCase.execute()
┌─────────────────────────────────────────────┐
│  RegisterUserUseCase (Orchestrator)         │
│                                             │
│  1. ✓ Validate input (email, password)    │
│  2. ✓ Check email uniqueness              │
│  3. ✓ Hash password                       │
│  4. ✓ Create user                         │
│  5. ✓ Generate OTP                        │
│  6. ✓ Save token                          │
│  7. ✓ Send email                          │
│  8. Return result                         │
└──────────┬─────────┬──────────┬──────────┬─┘
           │         │          │          │
   Uses ports        │          │          │
           │         │          │          │
    ┌──────▼─────┐   │    ┌─────▼──────┐  │
    │UserRepository  │    │TokenService│  │
    └──────┬─────┘   │    └─────┬──────┘  │
           │         │          │        │
    ┌──────▼──────────▼──────────▼────┬──▼────────────┐
    │  Adapters (Implementations)      │               │
    │                                   │               │
    │  ┌─────────────────────────────┐ │               │
    │  │MongoUserRepository          │ │               │
    │  │ - findByEmail()             │ │               │
    │  │ - create()                  │ │               │
    │  └──────────────┬──────────────┘ │               │
    │                 │                 │               │
    │  ┌──────────────▼──┐    ┌─────────▼────────┐   │
    │  │DefaultTokenService  │PasswordHasher  │    │
    │  │ - generateOTP()    │ - hash()        │    │
    │  └────────┬───────────┘ └────────┬─────┘    │
    │           │                      │           │
    │           │  ┌────────────────────▼────┐    │
    │           │  │ConsoleEmailService      │    │
    │           │  │ - sendVerificationEmail │    │
    │           │  └─────────────────────────┘    │
    └───────────┼──────────────────────────────────┘
                │
                ▼
       External Systems
       └─ MongoDB Database
       └─ bcryptjs Library
       └─ Console Output
```

---

## 🚀 Quick Activation Guide

### BEFORE (Current State)
```
src/app/api/auth/signup/route.ts
src/app/api/auth/verify-otp/route.ts
src/app/api/auth/forgot-password/route.ts
src/app/api/auth/reset-password/route.ts
└─ All routes have route-hexagonal.ts versions ready
```

### AFTER (Activate)
```bash
# Simply rename hexagonal routes to be primary:
mv src/app/api/auth/signup/route-hexagonal.ts src/app/api/auth/signup/route.ts
mv src/app/api/auth/verify-otp/route-hexagonal.ts src/app/api/auth/verify-otp/route.ts
mv src/app/api/auth/forgot-password/route-hexagonal.ts src/app/api/auth/forgot-password/route.ts
mv src/app/api/auth/reset-password/route-hexagonal.ts src/app/api/auth/reset-password/route.ts

# Optional: Backup old routes
mv src/app/api/auth/signup/route.ts src/app/api/auth/signup/route.old.ts
# ... repeat for others

# Test
npm run dev

# Build
npm run build
```

---

## 📊 Component Relationship Diagram

```
                    EXTERNAL WORLD
                         │
                  ┌──────┼──────┐
                  │      │      │
            ┌─────▼─┐ ┌──▼──┐ ┌─▼────┐
            │Routes │ │Next │ │Other │
            │       │ │Auth │ │APIs  │
            └─────┬─┘ └──┬──┘ └─┬────┘
                  │      │      │
                  └──────┼──────┘
                         │
        ╔════════════════╩════════════════╗
        ║        USE CASES (Core)        ║
        ║  - Authenticate                ║
        ║  - Register                    ║
        ║  - VerifyEmail                 ║
        ║  - ResetPassword               ║
        ╚════════════════╦════════════════╝
                         │
        ╔════════════════╩════════════════╗
        ║   DOMAIN (Business Rules)      ║
        ║  - User entity                 ║
        ║  - Token entity                ║
        ║  - Error types                 ║
        ╚════════════════╦════════════════╝
                         │
        ╔════════════════╩════════════════╗
        ║        PORTS (Contracts)       ║
        ║  - UserRepository              ║
        ║  - PasswordHasher              ║
        ║  - EmailService                ║
        ║  - TokenService                ║
        ╚════════════════╦════════════════╝
                         │
        ╔════════════════╩════════════════╗
        ║    ADAPTERS (Implementations)  ║
        ║  - MongoUserRepository         ║
        ║  - BcryptPasswordHasher        ║
        ║  - ConsoleEmailService         ║
        ║  - DefaultTokenService         ║
        ╚════════════════╦════════════════╝
                         │
        ╔════════════════╩════════════════╗
        ║  INFRASTRUCTURE & Libraries    ║
        ║  - MongoDB                     ║
        ║  - bcryptjs                    ║
        ║  - NodeJS                      ║
        ╚════════════════════════════════╝
```

---

## 🎯 Use Case Dependency Map

```
┌─────────────────────────────────────────────────────────────┐
│              Dependency Container                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  userRepository ──┐                                          │
│                  ├─► AuthenticateUserUseCase                │
│  passwordHasher ─┘                                          │
│                                                              │
│  userRepository ──┬─► RegisterUserUseCase                   │
│  passwordHasher ──┤                                          │
│  tokenService ────┤                                          │
│  verificationTokenRepository ┤                               │
│  emailService ────┘                                          │
│                                                              │
│  verificationTokenRepository ┬─► VerifyEmailUseCase         │
│  userRepository ──────────────┘                              │
│                                                              │
│  userRepository ──┬─► InitiatePasswordResetUseCase          │
│  tokenService ────┤                                          │
│  verificationTokenRepository ┤                               │
│  emailService ────┘                                          │
│                                                              │
│  userRepository ──┬─► ResetPasswordUseCase                  │
│  passwordHasher ──┤                                          │
│  verificationTokenRepository ┘                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📈 Scalability Path

### Today (Current)
```
✅ 5 Use Cases
✅ 5 Ports
✅ 5 Adapters
✅ 4 API Routes
```

### Tomorrow (Easy Additions)
```
+ AddMoreUseCase     (Create new file, wire in container)
+ AddMoreAdapter     (Create service, implement port)
+ AddMorePort        (Define interface, create adapter)
+ AddMoreRoute       (Call use case from container)
```

### Next Week
```
+ Admin Use Cases    (AuthorizeProvider, SuspendUser, etc.)
+ Real Email Service (SendGrid, AWS SES)
+ Caching Layer     (Create CacheService port + adapter)
+ Rate Limiting     (Add to use cases)
+ Audit Logging     (Add to use cases)
+ Multi-factor Auth (New use case + adapter)
```

### All Without Modifying Existing Code! 🎉

---

## 🧪 Testing Strategy

### Unit Tests
```
Mock all ports → Test use case logic → ✅ Fast & Isolated

No DB calls, no external services, just business logic
```

### Integration Tests
```
Use real adapters → Test ports → ✅ Real behavior

Real MongoDB, real bcryptjs, test port contracts
```

### E2E Tests
```
Real API routes → Full workflow → ✅ Complete validation

Test entire signup → verify → login flow
```

---

## 🔌 How to Extend

### Add New Use Case

```typescript
// 1. Create use case
// src/auth/core/usecases/MyUseCase.ts
export class MyUseCase {
  constructor(private userRepository: UserRepository) {}
  async execute(input: Input): Promise<Output> { ... }
}

// 2. Wire in container
// src/auth/container.ts
export const authContainer = {
  myUseCase: new MyUseCase(userRepository)
}

// 3. Use in route
// src/app/api/myroute/route.ts
const result = await authContainer.myUseCase.execute(input);
```

### Add New Adapter

```typescript
// 1. Create port (if needed)
// src/auth/ports/NewService.ts
export interface NewService { ... }

// 2. Create adapter
// src/auth/adapters/services/ConcreteService.ts
export class ConcreteService implements NewService { ... }

// 3. Inject in container
// src/auth/container.ts
const newService = new ConcreteService();
```

---

## ✨ Benefits at a Glance

| Benefit | How |
|---------|-----|
| **Easy Testing** | Mock ports, test use cases in isolation |
| **Easy to Change** | Swap adapters in container, one place |
| **Easy to Add** | Create use case, wire in container, done |
| **Easy to Understand** | Clear layer separation, logical flow |
| **Reusable Logic** | Use cases work with any adapter |
| **Testable Logic** | Business logic independent of framework |
| **Future-Proof** | Change tech stack without business logic changes |

---

## 📝 Documentation Links

Inside `src/auth/`:

| Doc | What | Time |
|-----|------|------|
| README.md | Overview & summary | 5 min |
| QUICK_REFERENCE.md | How to use | 10 min |
| ARCHITECTURE.md | Deep dive | 15 min |
| ARCHITECTURE_DIAGRAM.md | Visual | 10 min |
| MIGRATION_GUIDE.md | Step by step | 10 min |

**At project root**: `HEXAGONAL_IMPLEMENTATION_CHECKLIST.md`

---

## 🚀 Ready to Go?

1. ✅ Architecture implemented
2. ✅ Use cases created
3. ✅ Adapters built
4. ✅ Routes ready
5. ✅ Documentation complete
6. ⏳ **Waiting for you to activate!**

See: `HEXAGONAL_IMPLEMENTATION_CHECKLIST.md` → Phase 2

---

**Status**: ✅ COMPLETE  
**Next**: Rename `route-hexagonal.ts` files to `route.ts`
