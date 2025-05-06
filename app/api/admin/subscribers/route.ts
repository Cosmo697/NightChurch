import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import crypto from 'crypto';

// Get secret key from environment variable
const SECRET_KEY = process.env.ADMIN_SECRET_KEY;

// Check if environment variable is defined
if (!SECRET_KEY) {
  console.error('Missing environment variable: ADMIN_SECRET_KEY');
}

export async function GET(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Extract the token
    const token = authHeader.substring(7);
    const tokenParts = token.split('.');
    if (tokenParts.length !== 2) {
      return NextResponse.json(
        { message: 'Invalid token format' },
        { status: 401 }
      );
    }

    const [signature, expirationStr] = tokenParts;
    const expiration = parseInt(expirationStr, 10);

    // Check if token has expired
    if (isNaN(expiration) || Date.now() > expiration) {
      return NextResponse.json(
        { message: 'Token expired' },
        { status: 401 }
      );
    }

    // Verify the token
    const dataToSign = `admin-access-${expiration}`;
    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY || '')
      .update(dataToSign)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Token is valid, fetch subscribers from Supabase
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching subscribers:', error);
      return NextResponse.json(
        { message: 'Failed to fetch subscribers' },
        { status: 500 }
      );
    }

    // Map Supabase data to the format expected by the frontend
    const formattedSubscribers = subscribers.map(sub => ({
      _id: sub.id,
      email: sub.email,
      name: sub.name || 'Anonymous',
      createdAt: sub.created_at
    }));

    return NextResponse.json({ subscribers: formattedSubscribers });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { message: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}