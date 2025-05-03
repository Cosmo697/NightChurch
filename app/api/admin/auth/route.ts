import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Get admin password and secret key from environment variables
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SECRET_KEY = process.env.ADMIN_SECRET_KEY;

// Check if environment variables are defined
if (!ADMIN_PASSWORD || !SECRET_KEY) {
  console.error('Missing environment variables: ADMIN_PASSWORD or ADMIN_SECRET_KEY');
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { message: 'Invalid password' },
        { status: 401 }
      );
    }

    // Generate a simple token with expiration
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
    const dataToSign = `admin-access-${expiresAt}`;
    const token = crypto
      .createHmac('sha256', SECRET_KEY || '')
      .update(dataToSign)
      .digest('hex');

    // Return the token with expiration
    return NextResponse.json(
      { 
        message: 'Authentication successful',
        token: `${token}.${expiresAt}` 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { message: 'Authentication failed' },
      { status: 500 }
    );
  }
}