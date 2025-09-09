import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parseAuthCookie, verifyJwt } from './utils/jwt';

export async function middleware(request: NextRequest) {
  const token = parseAuthCookie(request.headers.get('cookie'));
  const isProtectedRoute = !request.nextUrl.pathname.startsWith('/login');
  const res = NextResponse.next();
  // add the CORS headers to the response
    res.headers.append('Access-Control-Allow-Credentials', "true")
    res.headers.append('Access-Control-Allow-Origin', '*') // replace this your actual origin
    res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS')
    res.headers.append(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
