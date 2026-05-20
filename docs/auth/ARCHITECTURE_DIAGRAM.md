# Hexagonal Architecture Diagram

## System Architecture

```
                          ┌─────────────────────────────────────────┐
                          │      EXTERNAL WORLD                     │
                          │  (HTTP, Databases, Email Services)      │
                          └──────────────┬──────────────────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
                    ▼                    ▼                    ▼
        ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
        │   HTTP Routes    │  │  NextAuth        │  │  Other APIs      │
        │  (API Adapters)  │  │  (Auth Adapter)  │  │  (Future)        │
        └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘
                 │                     │                     │
                 └─────────────────────┼─────────────────────┘
                                       │
         ╔═════════════════════════════╩═════════════════════════════╗
         ║                    PORTS (Interfaces)                     ║
         ║                                                           ║
         ║  UserRepository    VerificationTokenRepository            ║
         ║  PasswordHasher    TokenService        EmailService       ║
         ║                                                           ║
         ╚═════════════════════════════╦═════════════════════════════╝
                                       │
         ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━┓
         ┃                             │                          ┃
         ┃        CORE DOMAIN          │                          ┃
         ┃        (Business Logic)     │                          ┃
         ┃                             │                          ┃
         ┃  ┌─────────────────────────────────────────────────┐  ┃
         ┃  │          USE CASES (Orchestrators)              │  ┃
         ┃  │                                                 │  ┃
         ┃  │  • AuthenticateUserUseCase                      │  ┃
         ┃  │  • RegisterUserUseCase                          │  ┃
         ┃  │  • VerifyEmailUseCase                           │  ┃
         ┃  │  • InitiatePasswordResetUseCase                 │  ┃
         ┃  │  • ResetPasswordUseCase                         │  ┃
         ┃  │                                                 │  ┃
         ┃  └────────────┬─────────────────────────┬──────────┘  ┃
         ┃               │                         │              ┃
         ┃  ┌────────────▼──────────┐  ┌───────────▼────────────┐ ┃
         ┃  │  Domain Entities      │  │  Domain Errors         │ ┃
         ┃  │                       │  │                        │ ┃
         ┃  │  • User               │  │  • ValidationError     │ ┃
         ┃  │  • VerificationToken  │  │  • AuthenticationError │ ┃
         ┃  │                       │  │  • NotFoundError       │ ┃
         ┃  └───────────────────────┘  └────────────────────────┘ ┃
         ┃                                                         ┃
         ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━┛
                                       │
         ╔═════════════════════════════╩═════════════════════════════╗
         ║               ADAPTERS (Implementations)                  ║
         ║                                                           ║
         ║  ┌──────────────────────────────────────────────────┐   ║
         ║  │           Repositories                           │   ║
         ║  │  • MongoUserRepository                           │   ║
         ║  │  • MongoVerificationTokenRepository              │   ║
         ║  └──────────────────────────────────────────────────┘   ║
         ║                                                           ║
         ║  ┌──────────────────────────────────────────────────┐   ║
         ║  │           Services                               │   ║
         ║  │  • BcryptPasswordHasher                          │   ║
         ║  │  • DefaultTokenService                           │   ║
         ║  │  • ConsoleEmailService                           │   ║
         ║  └──────────────────────────────────────────────────┘   ║
         ║                                                           ║
         ║  ┌──────────────────────────────────────────────────┐   ║
         ║  │        Dependency Injection Container            │   ║
         ║  │  (Wires all adapters → use cases)                │   ║
         ║  └──────────────────────────────────────────────────┘   ║
         ║                                                           ║
         ╚═════════════════════════════╦═════════════════════════════╝
                                       │
         ╔═════════════════════════════╩═════════════════════════════╗
         ║             EXTERNAL SYSTEMS (Infrastructure)             ║
         ║                                                           ║
         ║  ┌──────────────┐  ┌─────────────┐  ┌──────────────┐    ║
         ║  │  MongoDB     │  │  bcryptjs   │  │  EmailAPI    │    ║
         ║  │  Database    │  │  Library    │  │  (Future)    │    ║
         ║  └──────────────┘  └─────────────┘  └──────────────┘    ║
         ║                                                           ║
         ╚═══════════════════════════════════════════════════════════╝
```

## Request Flow Example: User Registration

```
        HTTP Request
        POST /api/auth/signup
             │
             ▼
    ┌────────────────────┐
    │   Route Handler    │
    │ (route-hexagonal)  │
    └────────┬───────────┘
             │
             │ Delegates to
             ▼
    ┌────────────────────────────────┐
    │   RegisterUserUseCase          │
    │  (Business Logic)              │
    │                                │
    │  1. Validate input             │
    │  2. Check email uniqueness     │─── calls ──▶  UserRepository
    │  3. Hash password              │─── calls ──▶  PasswordHasher
    │  4. Create user                │─── calls ──▶  UserRepository
    │  5. Generate OTP               │─── calls ──▶  TokenService
    │  6. Save token                 │─── calls ──▶  VerificationTokenRepository
    │  7. Send email                 │─── calls ──▶  EmailService
    │                                │
    └────────┬───────────────────────┘
             │
             │ Via Adapters
             │
    ┌────────┴───────────────────────────────────────────┐
    │                                                    │
    ▼                    ▼                    ▼         ▼
┌─────────────┐  ┌──────────────┐  ┌──────────────┐ ┌─────────┐
│MongoUserRep │  │BcryptHasher  │  │TokenService  │ │ConsoleES│
└──────┬──────┘  └──────┬───────┘  └──────┬───────┘ └────┬────┘
       │                │                 │              │
       ▼                ▼                 ▼              ▼
   MongoDB           bcryptjs        Math.random()    Console.log()
   Database          Library         Generator        (Dev Only)
```

## Dependency Direction

```
Routes/APIs
    ↓
Use Cases ◀─── Ports (Interfaces)
    ↑
    └──── Adapters (Implementations)
            ↓
        External Systems
```

**Key Principle**: Outer layers (adapters, routes) depend on inner layers (use cases, domain), NEVER the reverse.

## Adding New Features

### Current: Add SMS Notifications

```
1. Create Port
   └─ SMS Service Interface

2. Create Adapter
   └─ TwilioSMSService

3. Inject into Use Case
   └─ RegisterUserUseCase receives SMSService

4. Update Use Case Logic
   └─ Call SMS service when OTP generated

✓ No changes to routes
✓ No changes to other adapters
✓ Business logic stays clean
```

## Testing Architecture

```
┌──────────────────────────────────────┐
│    Unit Test                         │
│                                      │
│  ┌────────────────────────────┐     │
│  │  RegisterUserUseCase       │     │
│  │  with Mock Adapters        │     │
│  │                            │     │
│  │  - MockUserRepository      │     │
│  │  - MockPasswordHasher      │     │
│  │  - MockTokenService        │     │
│  │  - MockEmailService        │     │
│  │                            │     │
│  │  ✓ Tests business logic    │     │
│  │  ✓ No DB calls             │     │
│  │  ✓ Fast & isolated         │     │
│  └────────────────────────────┘     │
└──────────────────────────────────────┘
```

## Comparison: Before vs After

```
BEFORE (Monolithic)               AFTER (Hexagonal)
─────────────────                ─────────────────

Routes                            Routes
 │                                 │
 ├─ Direct DB calls                ├─ Call Use Cases
 ├─ bcrypt calls                   │
 ├─ Business logic mixed           Use Cases
 ├─ Hard to test                    │
 └─ Tightly coupled                 ├─ All business logic
                                    ├─ Easy to test
                                    └─ Loosely coupled
                                    
                                   Adapters
                                    │
                                    ├─ Database
                                    ├─ Password Hashing
                                    └─ Email Service
```

## Layer Independence

```
✓ Core Domain        - Zero external dependencies
✓ Use Cases          - Only depend on ports (abstractions)
✓ Adapters           - Only implement specific port
✓ Routes             - Only call use cases
✓ Ports              - Define contracts

❌ Avoid:
   - Routes calling adapters
   - Use cases importing models
   - Adapters depending on other adapters
   - Domain depending on external libs
```
