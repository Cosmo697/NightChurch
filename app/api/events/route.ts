import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAllEvents, getEventBySlug } from '@/lib/events';

// Get events - public endpoint, no auth required
export async function GET(request: Request) {
  try {
    const events = await getAllEvents();
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { message: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}