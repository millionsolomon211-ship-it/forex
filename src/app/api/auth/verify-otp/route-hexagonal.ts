import { NextResponse } from 'next/server';
import { authContainer } from '@/auth/container';
import { ValidationError } from '@/auth/core/domain/errors';

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json();
    const result = await authContainer.verifyEmailUseCase.execute({ email, token });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Verify OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
