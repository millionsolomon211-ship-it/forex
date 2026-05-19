import dbConnect from '@/lib/db';
import VerificationTokenModel from '@/models/VerificationToken';
import { VerificationTokenRepository } from '@/auth/ports/VerificationTokenRepository';
import { VerificationToken } from '@/auth/core/domain/VerificationToken';

export class MongoVerificationTokenRepository implements VerificationTokenRepository {
  async create(email: string, token: string, expires: Date): Promise<void> {
    await dbConnect();
    await VerificationTokenModel.create({
      email,
      token,
      expires
    });
  }

  async findByEmailAndToken(email: string, token: string): Promise<VerificationToken | null> {
    await dbConnect();
    const tokenDoc = await VerificationTokenModel.findOne({ email, token });
    
    if (!tokenDoc) return null;
    
    return new VerificationToken(email, token, tokenDoc.expires);
  }

  async deleteByEmail(email: string): Promise<void> {
    await dbConnect();
    await VerificationTokenModel.deleteMany({ email });
  }

  async deleteById(id: string): Promise<void> {
    await dbConnect();
    await VerificationTokenModel.deleteOne({ _id: id });
  }
}
