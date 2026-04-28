import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './auth';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const path = request.nextUrl.pathname;

  // Protect dashboard routes
  if (path.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    const role = session.user?.role;
    
    // Role-based routing enforcements inside /dashboard
    if (path === '/dashboard') {
      if (role === 'ADMIN') return NextResponse.redirect(new URL('/dashboard/admin', request.url));
      if (role === 'BANK' || role === 'PRIVATE') return NextResponse.redirect(new URL('/dashboard/provider', request.url));
      return NextResponse.redirect(new URL('/dashboard/user', request.url));
    }
  }

  // If visiting root, redirect to login if no session, or dashboard if session exists
  if (path === '/') {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    } else {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Prevent logged in users from seeing auth pages
  if (path.startsWith('/auth') && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/auth/:path*'],
};
