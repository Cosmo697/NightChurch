import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only apply admin route protection
  if (pathname.startsWith('/api/admin/')) {
    // Admin route protection logic can go here if needed
  }
  
  // Continue with the request for all paths
  return NextResponse.next();
}

// Apply middleware only to admin routes
export const config = {
  matcher: [
    '/api/admin/:path*'
  ],
};