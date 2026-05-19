import { NextResponse } from 'next/server';
import { authContainer } from '@/auth/container';
import { ValidationError } from '@/auth/core/domain/errors';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const result = await authContainer.initiatePasswordResetUseCase.execute({ email });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
