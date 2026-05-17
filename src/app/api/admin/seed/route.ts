import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await dbConnect();

    // 1. Create Admin
    const adminEmail = 'admin@forex.com';
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'ADMIN',
      });
    }

    // 2. Create a mock Provider
    const providerEmail = 'cbe@bank.com';
    const providerPassword = await bcrypt.hash('provider123', 10);

    let provider = await User.findOne({ email: providerEmail });
    if (!provider) {
      provider = await User.create({
        name: 'Commercial Bank of Ethiopia',
        email: providerEmail,
        password: providerPassword,
        role: 'BANK',
        companyName: 'CBE',
        registrationNumber: 'CBE-001',
        isAuthorized: true, // Auto-authorize for testing
      });
    }

    // 3. Create a mock User
    const userEmail = 'traveler@tour.com';
    const userPassword = await bcrypt.hash('user123', 10);

    let user = await User.findOne({ email: userEmail });
    if (!user) {
      user = await User.create({
        name: 'John Doe',
        email: userEmail,
        password: userPassword,
        role: 'USER',
      });
    }

    return NextResponse.json({ 
      message: 'Database seeded successfully',
      users: {
        admin: admin.email,
        provider: provider.email,
        user: user.email
      }
    });

  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
