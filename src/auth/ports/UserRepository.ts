import { User } from '@/auth/core/domain/User';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(id: string, updates: Partial<any>): Promise<User>;
  exists(email: string): Promise<boolean>;
}
