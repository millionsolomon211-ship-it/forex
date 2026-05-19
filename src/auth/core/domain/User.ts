export interface UserEntity {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'BANK' | 'PRIVATE' | 'ADMIN';
  isAuthorized: boolean;
  emailVerified?: Date | null;
  phoneNumber?: string;
  country?: string;
  companyName?: string;
  registrationNumber?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  constructor(private entity: UserEntity) {}

  getId(): string {
    return this.entity.id;
  }

  getName(): string {
    return this.entity.name;
  }

  getEmail(): string {
    return this.entity.email;
  }

  getPassword(): string {
    return this.entity.password;
  }

  getRole(): UserEntity['role'] {
    return this.entity.role;
  }

  isEmailVerified(): boolean {
    return !!this.entity.emailVerified;
  }

  getStatus(): UserEntity['status'] {
    return this.entity.status;
  }

  isActive(): boolean {
    return this.entity.status === 'active';
  }

  isProviderAuthorized(): boolean {
    return this.entity.isAuthorized;
  }

  toJSON(): UserEntity {
    return this.entity;
  }

  static create(entity: UserEntity): User {
    return new User(entity);
  }
}
