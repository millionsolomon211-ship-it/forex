import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import VerificationToken from '@/models/VerificationToken';

function generateToken() {
  return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      // Return 200 even if user not found for security purposes
      return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });
    }

    // Clean up existing tokens for this email
    await VerificationToken.deleteMany({ email });

    const resetToken = generateToken();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await VerificationToken.create({
      email,
      token: resetToken,
      expires
    });

    // In a real application, send this token via email in a link.
    // For development, we return the token in the response or console.
    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(`Reset link: http://localhost:3002/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`);

    return NextResponse.json({ 
      message: 'If an account exists, a reset link has been sent.',
      devToken: resetToken // Only for development convenience
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
