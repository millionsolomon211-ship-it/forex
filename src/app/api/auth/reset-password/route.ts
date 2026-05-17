import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import VerificationToken from '@/models/VerificationToken';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, token, password } = await request.json();

    if (!email || !token || !password) {
      return NextResponse.json({ error: 'Missing email, token, or password' }, { status: 400 });
    }

    await dbConnect();

    // Find the verification token in DB
    const verificationToken = await VerificationToken.findOne({ email, token });

    if (!verificationToken) {
      return NextResponse.json({ error: 'Invalid or expired password reset link' }, { status: 400 });
    }

    // Check if token has expired
    if (new Date() > verificationToken.expires) {
      await VerificationToken.deleteOne({ _id: verificationToken._id });
      return NextResponse.json({ error: 'Password reset link has expired' }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    const userUpdate = await User.updateOne({ email }, { password: hashedPassword });

    if (userUpdate.matchedCount === 0) {
      return NextResponse.json({ error: 'User account not found' }, { status: 404 });
    }

    // Delete verification token
    await VerificationToken.deleteOne({ _id: verificationToken._id });

    return NextResponse.json({ message: 'Password reset successfully. You can now log in.' });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
