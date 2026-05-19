import dbConnect from '@/lib/db';
import UserModel from '@/models/User';
import { UserRepository } from '@/auth/ports/UserRepository';
import { User, UserEntity } from '@/auth/core/domain/User';

export class MongoUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    await dbConnect();
    const userDoc = await UserModel.findOne({ email });
    
    if (!userDoc) return null;
    
    const entity = this.toEntity(userDoc);
    return User.create(entity);
  }

  async findById(id: string): Promise<User | null> {
    await dbConnect();
    const userDoc = await UserModel.findById(id);
    
    if (!userDoc) return null;
    
    const entity = this.toEntity(userDoc);
    return User.create(entity);
  }

  async create(user: User): Promise<User> {
    await dbConnect();
    const entity = user.toJSON();
    
    const newUserDoc = await UserModel.create({
      name: entity.name,
      email: entity.email,
      password: entity.password,
      role: entity.role,
      phoneNumber: entity.phoneNumber,
      country: entity.country,
      companyName: entity.companyName,
      registrationNumber: entity.registrationNumber,
      status: entity.status,
      isAuthorized: entity.isAuthorized,
      emailVerified: entity.emailVerified
    });

    const newEntity = this.toEntity(newUserDoc);
    return User.create(newEntity);
  }

  async update(id: string, updates: Partial<any>): Promise<User> {
    await dbConnect();
    const userDoc = await UserModel.findByIdAndUpdate(id, updates, { new: true });
    
    if (!userDoc) {
      throw new Error(`User with id ${id} not found`);
    }

    const entity = this.toEntity(userDoc);
    return User.create(entity);
  }

  async exists(email: string): Promise<boolean> {
    await dbConnect();
    const user = await UserModel.findOne({ email });
    return !!user;
  }

  private toEntity(userDoc: any): UserEntity {
    return {
      id: userDoc._id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      password: userDoc.password,
      role: userDoc.role,
      isAuthorized: userDoc.isAuthorized,
      emailVerified: userDoc.emailVerified,
      phoneNumber: userDoc.phoneNumber,
      country: userDoc.country,
      companyName: userDoc.companyName,
      registrationNumber: userDoc.registrationNumber,
      status: userDoc.status,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt
    };
  }
}
