import { NextResponse } from "next/server";


const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/register',
  '/auth/otp-verification'
];

export async function middleware(request) {
  const token = request.cookies.get('authToken')?.value;
  const { pathname } = request.nextUrl;

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );
  if (isPublicRoute) {
    // If user is already logged in and tries to visit a public/auth page ? redirect to dashboard
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }
  if (request.nextUrl.pathname.startsWith('/api')) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true'); // If you need to send cookies/credentials
    return response;
  }
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
	'/api/:path*',
    "/account",
    "/attachment/:path*",
    "/attribute/:path*",
    "/auth/:path*",
    "/blog/:path*",
    "/category/:path*",
    "/checkout",
    "/commission_history",
    "/coupon/:path*",
    "/currency/:path*",
    "/dasboard",
    "/dashboard/:path*",
    "/faq/:path*",
    "/notification/:path*",
    "/order/:path*",
    "/page/:path*",
    "/payment_account/:path*",
    "/point/:path*",
    "/product/:path*",
    "/refund",
    "/review/:path*",
    "/role/",
    "/setting/:path*",
    "/shipping/:path*",
    "/store/:path*",
    "/tag/:path*",
    "/tax/:path*",
    "/theme/:path*",
    "/theme_option/:path*",
    "/user/:path*",
    "/vendore_wallet/:path*",
    "/wallet/:path*",
    "/withdraw_request/:path*",
    "/vendor_wallet/:path*",
    "/theme/denver",
    "/notifications",
    "/qna",
  ],
};