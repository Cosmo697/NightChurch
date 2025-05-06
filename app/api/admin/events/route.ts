import { NextResponse } from 'next/server';
import { saveEvent, deleteEvent, getAllEvents } from '@/lib/events';
import crypto from 'crypto';

// Get secret key from environment variable
const SECRET_KEY = process.env.ADMIN_SECRET_KEY;

// Check if environment variable is defined
if (!SECRET_KEY) {
  console.error('Missing environment variable: ADMIN_SECRET_KEY');
}

// Verify admin token helper function
function verifyAdminToken(request: Request) {
  // Get the authorization header
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  // Extract the token
  const token = authHeader.substring(7);
  const tokenParts = token.split('.');
  if (tokenParts.length !== 2) {
    return false;
  }

  const [signature, expirationStr] = tokenParts;
  const expiration = parseInt(expirationStr, 10);

  // Check if token has expired
  if (isNaN(expiration) || Date.now() > expiration) {
    return false;
  }

  // Verify the token
  const dataToSign = `admin-access-${expiration}`;
  const expectedSignature = crypto
    .createHmac('sha256', SECRET_KEY || '')
    .update(dataToSign)
    .digest('hex');

  return signature === expectedSignature;
}

// GET /api/admin/events - Get all events for admin
export async function GET(request: Request) {
  try {
    // Verify admin token
    if (!verifyAdminToken(request)) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all events
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

// POST /api/admin/events - Create or update an event
export async function POST(request: Request) {
  try {
    // Verify admin token
    if (!verifyAdminToken(request)) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get event data from request body
    const eventData = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'slug', 'date', 'time', 'location', 'summary', 'presentedBy'];
    for (const field of requiredFields) {
      if (!eventData[field]) {
        return NextResponse.json(
          { message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Ensure slug is URL-friendly
    eventData.slug = eventData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    
    // If no ID is provided, generate one from the slug
    if (!eventData.id) {
      eventData.id = eventData.slug;
    }

    // Set default values if not provided
    if (eventData.badgeText === undefined) eventData.badgeText = "Event";
    if (eventData.badgeColor === undefined) eventData.badgeColor = "bg-purple-600 hover:bg-purple-700";
    if (eventData.featured === undefined) eventData.featured = false;
    if (eventData.ticketsAvailable === undefined) eventData.ticketsAvailable = false;
    
    // Save the event
    const success = await saveEvent(eventData);
    
    if (success) {
      return NextResponse.json({ 
        message: 'Event saved successfully',
        event: eventData
      });
    } else {
      return NextResponse.json(
        { message: 'Failed to save event' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error saving event:', error);
    return NextResponse.json(
      { message: 'Failed to save event' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/events - Delete an event
export async function DELETE(request: Request) {
  try {
    // Verify admin token
    if (!verifyAdminToken(request)) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get slug from request body
    const { slug } = await request.json();
    
    if (!slug) {
      return NextResponse.json(
        { message: 'Missing required field: slug' },
        { status: 400 }
      );
    }
    
    // Delete the event
    const success = await deleteEvent(slug);
    
    if (success) {
      return NextResponse.json({ 
        message: 'Event deleted successfully',
        slug
      });
    } else {
      return NextResponse.json(
        { message: 'Failed to delete event' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { message: 'Failed to delete event' },
      { status: 500 }
    );
  }
}