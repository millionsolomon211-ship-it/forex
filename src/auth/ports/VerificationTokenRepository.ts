import { VerificationToken } from '@/auth/core/domain/VerificationToken';

export interface VerificationTokenRepository {
  create(email: string, token: string, expires: Date): Promise<void>;
  findByEmailAndToken(email: string, token: string): Promise<VerificationToken | null>;
  deleteByEmail(email: string): Promise<void>;
  deleteById(id: string): Promise<void>;
}
