export class VerificationToken {
  constructor(
    private email: string,
    private token: string,
    private expires: Date
  ) {}

  getEmail(): string {
    return this.email;
  }

  getToken(): string {
    return this.token;
  }

  isExpired(): boolean {
    return new Date() > this.expires;
  }

  getExpiresAt(): Date {
    return this.expires;
  }

  static create(email: string, token: string, expiresInMinutes: number = 15): VerificationToken {
    const expires = new Date(Date.now() + expiresInMinutes * 60 * 1000);
    return new VerificationToken(email, token, expires);
  }
}
