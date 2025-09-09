import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parseAuthCookie, verifyJwt } from './utils/jwt';

export async function middleware(request: NextRequest) {
  const token = parseAuthCookie(request.headers.get('cookie'));
  const isProtectedRoute = !request.nextUrl.pathname.startsWith('/login');

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = verifyJwt(token);
    if (!payload) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('authToken');
      return response;
    }
  } else {
    if (token && verifyJwt(token)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
