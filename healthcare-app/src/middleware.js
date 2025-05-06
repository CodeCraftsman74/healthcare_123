import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server'; // Removed TypeScript type import

// Routes that require authentication
const protectedRoutes = [
  '/personalized',
  '/profile'
];

// Routes to explicitly exclude from middleware protection
const excludedRoutes = [
  '/personalized/direct'
];

// Removed TypeScript type annotation from request parameter
export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip middleware for excluded routes
  if (excludedRoutes.some(route => pathname.startsWith(route))) {
    console.log(`Skipping auth check for excluded route: ${pathname}`);
    return NextResponse.next();
  }

  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    console.log(`Checking auth for protected route: ${pathname}`);
    
    // Get the token from the cookies
    const token = request.cookies.get('auth-token')?.value;
    
    // Log all cookies for debugging
    console.log('All cookies:', [...request.cookies.getAll()].map(c => c.name + '=' + c.value.substring(0, 10) + '...'));
    
    if (!token) {
      console.log('No auth token found in middleware, redirecting to login');
      
      // Create the login URL with redirect parameter
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname === '/personalized' ? '/personalized/direct' : pathname);
      
      return NextResponse.redirect(loginUrl);
    }
    
    console.log('Auth token found in middleware, proceeding to:', pathname, 'with token prefix:', token.substring(0, 10) + '...');
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/personalized/:path*',
    '/profile/:path*',
  ],
}; 