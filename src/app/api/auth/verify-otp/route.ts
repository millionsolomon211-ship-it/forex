import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import VerificationToken from '@/models/VerificationToken';

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json({ error: 'Missing email or token' }, { status: 400 });
    }

    await dbConnect();

    const verificationToken = await VerificationToken.findOne({ email, token });

    if (!verificationToken) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    if (new Date() > verificationToken.expires) {
      await VerificationToken.deleteOne({ _id: verificationToken._id });
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
    }

    // Verify User
    await User.updateOne({ email }, { emailVerified: new Date() });

    // Clean up token
    await VerificationToken.deleteOne({ _id: verificationToken._id });

    return NextResponse.json({ message: 'Email verified successfully' });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
