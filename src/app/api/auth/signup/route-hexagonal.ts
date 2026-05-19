import { NextResponse } from 'next/server';
import { authContainer } from '@/auth/container';
import { ValidationError, AuthenticationError } from '@/auth/core/domain/errors';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await authContainer.registerUserUseCase.execute(body);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
