import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role, companyName, registrationNumber, providerType } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData: any = {
      name,
      email,
      password: hashedPassword,
      role,
    };

    if (role === 'PROVIDER') {
      if (!companyName || !registrationNumber || !providerType) {
        return NextResponse.json({ error: 'Missing provider details' }, { status: 400 });
      }
      userData.companyName = companyName;
      userData.registrationNumber = registrationNumber;
      userData.providerType = providerType;
      userData.isAuthorized = false; // Providers wait for admin approval
    }

    const newUser = await User.create(userData);

    return NextResponse.json({ 
      message: 'Registration successful', 
      user: { id: newUser._id, email: newUser.email, role: newUser.role } 
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
