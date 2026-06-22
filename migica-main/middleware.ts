import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Add the routes you want to protect with admin verification
const adminProtectedRoutes = ['/allproduct', '/orders'];
const userProtectedRoutes = ['/checkout', '/my-orders'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if current route matches any of the admin protected routes or sub-routes
  const isAdminRoute = adminProtectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isUserRoute = userProtectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isAdminRoute || isUserRoute) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      
      const { payload } = await jwtVerify(token, secret);
      
      if (isAdminRoute && !payload.isAdmin) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      return NextResponse.next();
    } catch (error) {
      // Invalid token
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/allproduct/:path*', '/allproduct', '/checkout/:path*', '/checkout', '/orders/:path*', '/orders', '/my-orders/:path*', '/my-orders'],
};
