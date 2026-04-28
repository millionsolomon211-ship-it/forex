import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import VerificationToken from '@/models/VerificationToken';
import bcrypt from 'bcryptjs';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role, companyName, registrationNumber, phoneNumber, country } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

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
      phoneNumber,
      country,
      status: 'active'
    };

    if (role === 'BANK' || role === 'PRIVATE') {
      if (!companyName || !registrationNumber) {
        return NextResponse.json({ error: 'Missing provider details' }, { status: 400 });
      }
      userData.companyName = companyName;
      userData.registrationNumber = registrationNumber;
      userData.isAuthorized = false; // Must be authorized by ADMIN
    }

    const newUser = await User.create(userData);

    // Generate Verification Token (OTP)
    const otp = generateOTP();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await VerificationToken.create({
      email: newUser.email,
      token: otp,
      expires
    });

    // In a real app, send email here. For now we will return it for development.
    console.log(`OTP for ${email}: ${otp}`);

    return NextResponse.json({ 
      message: 'Registration successful. Please verify your email.',
      redirectUrl: `/auth/verify-otp?email=${encodeURIComponent(email)}`
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
