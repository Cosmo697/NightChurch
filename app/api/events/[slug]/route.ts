import { NextResponse } from 'next/server';
import { getEventBySlug } from '@/lib/events';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const event = await getEventBySlug(params.slug);
    
    if (!event) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error getting event:', error);
    return NextResponse.json(
      { message: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}