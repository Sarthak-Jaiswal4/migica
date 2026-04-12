import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Add the routes you want to protect with admin verification
const protectedRoutes = ['/allproduct'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if current route matches any of the protected routes or sub-routes
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      
      const { payload } = await jwtVerify(token, secret);
      
      if (!payload.isAdmin) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      return NextResponse.next();
    } catch (error) {
      // Invalid token
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/allproduct/:path*', '/allproduct'],
};
