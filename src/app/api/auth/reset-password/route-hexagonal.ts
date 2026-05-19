import { NextResponse } from 'next/server';
import { authContainer } from '@/auth/container';
import { ValidationError } from '@/auth/core/domain/errors';

export async function POST(request: Request) {
  try {
    const { email, token, newPassword } = await request.json();
    const result = await authContainer.resetPasswordUseCase.execute({
      email,
      token,
      newPassword
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
