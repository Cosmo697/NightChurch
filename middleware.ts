import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Continue with the request
  return NextResponse.next();
}

// Apply middleware only to /api/admin/* routes
export const config = {
  matcher: '/api/admin/:path*',
};