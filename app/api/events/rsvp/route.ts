import { NextResponse } from 'next/server';
import supabase, { getAdminSupabase } from '@/lib/supabase';
import { getEventBySlug } from '@/lib/events';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventSlug, name, email, guests = 1, notes = '' } = body;
    
    // Add better logging
    console.log(`Processing RSVP for event slug: "${eventSlug}"`);
    
    // Validate required fields
    if (!eventSlug || !name || !email) {
      console.log('Validation failed: Missing required fields');
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get the event to make sure it exists and to get the id
    const event = await getEventBySlug(eventSlug);
    
    if (!event) {
      console.log(`Event not found for slug: "${eventSlug}"`);
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      );
    }
    
    console.log('RSVP submission - Event data:', { 
      slug: eventSlug, 
      id: event.id, 
      title: event.title 
    });
    
    // Check if tickets are available for this event
    if (!event.ticketsAvailable) {
      console.log(`RSVP not available for event: "${eventSlug}"`);
      return NextResponse.json(
        { message: 'RSVP is not available for this event yet' },
        { status: 400 }
      );
    }
    
    // Use the admin Supabase client to bypass RLS
    const adminSupabase = getAdminSupabase();
    
    // Use the event slug as event_id since that's what's stored in the database
    // IMPORTANT FIX: Make sure we're using the actual slug, not the event ID
    const event_id = eventSlug;
    
    console.log(`Using event_id: "${event_id}" for database operations`);
    
    try {
      // Check if email has already RSVP'd for this event
      console.log(`Checking if ${email} has already RSVP'd for event: ${event_id}`);
      const { data: existingRsvps, error: checkError } = await adminSupabase
        .from('rsvps')
        .select('id')
        .eq('event_id', event_id)
        .eq('email', email)
        .limit(1);
      
      if (checkError) {
        console.error('Error checking RSVP:', checkError);
        console.error('Error details:', checkError.code, checkError.message, checkError.details);
        
        // If the error is a table doesn't exist error, it means the RSVP table is not created yet
        if (checkError.code === '42P01') { // PostgreSQL error code for undefined_table
          return NextResponse.json(
            { message: 'RSVP system is not fully set up yet. Please contact the administrator.' },
            { status: 500 }
          );
        }
        
        return NextResponse.json(
          { message: 'Error checking RSVP' },
          { status: 500 }
        );
      }
      
      if (existingRsvps && existingRsvps.length > 0) {
        console.log(`Email ${email} has already RSVP'd for event: ${event_id}`);
        return NextResponse.json(
          { message: 'You have already RSVP\'d for this event' },
          { status: 400 }
        );
      }
      
      // Prepare the RSVP data with proper validation
      const rsvpData = {
        event_id: event_id,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        guests: Math.max(1, Math.min(10, guests)), // Ensure guests is between 1 and 10
        notes: (notes || '').trim(),
        status: 'confirmed'
      };
      
      console.log('Inserting RSVP data:', rsvpData);
      
      // Insert the RSVP using the event slug as event_id and the admin client to bypass RLS
      const { data, error } = await adminSupabase
        .from('rsvps')
        .insert([rsvpData])
        .select();
      
      if (error) {
        console.error('Error creating RSVP:', error);
        console.error('Error details:', error.code, error.message, error.details);
        
        // If the error is a table doesn't exist error, it means the RSVP table is not created yet
        if (error.code === '42P01') { // PostgreSQL error code for undefined_table
          return NextResponse.json(
            { message: 'RSVP system is not fully set up yet. Please contact the administrator.' },
            { status: 500 }
          );
        }
        
        // Handle foreign key constraint error
        if (error.code === '23503') { // PostgreSQL error code for foreign_key_violation
          return NextResponse.json(
            { message: 'This event is not configured properly for RSVPs. Please contact the administrator.' },
            { status: 500 }
          );
        }
        
        return NextResponse.json(
          { message: 'Failed to create RSVP' },
          { status: 500 }
        );
      }
      
      // Get the current RSVP count for this specific event
      const { count, error: countError } = await adminSupabase
        .from('rsvps')
        .select('*', { count: 'exact', head: false })
        .eq('event_id', event_id)
        .eq('status', 'confirmed');
      
      if (countError) {
        console.error('Error getting RSVP count:', countError);
      }
      
      console.log(`Found ${count || 0} RSVPs for event ${event_id}`);
      
      return NextResponse.json({ 
        message: 'RSVP successful',
        rsvpCount: count || 0
      });
    } catch (dbError) {
      console.error('Database error in RSVP handler:', dbError);
      return NextResponse.json(
        { message: 'Database error occurred. Please try again later.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing RSVP:', error);
    return NextResponse.json(
      { message: 'Failed to process RSVP' },
      { status: 500 }
    );
  }
}

// GET method to check RSVP count and debug RSVPs for an event
export async function GET(request: Request) {
  try {
    // Get the event slug from the URL
    const url = new URL(request.url);
    const eventSlug = url.searchParams.get('eventSlug');
    const debug = url.searchParams.get('debug') === 'true';
    
    // Get token if available (for admin debug functions)
    const authHeader = request.headers.get('authorization');
    const isAdmin = authHeader && authHeader.startsWith('Bearer ');
    
    // Use admin client if authorized, otherwise use regular client
    const dbClient = isAdmin ? getAdminSupabase() : supabase;
    
    if (!eventSlug && !debug) {
      return NextResponse.json(
        { message: 'Missing eventSlug parameter' },
        { status: 400 }
      );
    }
    
    // Special debug mode to see all RSVPs
    if (debug) {
      // Get all RSVPs for debugging - this should only work for admins
      if (!isAdmin) {
        return NextResponse.json(
          { message: 'Unauthorized for debug mode' },
          { status: 403 }
        );
      }
      
      // Get all RSVPs for debugging
      const { data: allRsvps, error: allRsvpsError } = await dbClient
        .from('rsvps')
        .select('*');
        
      if (allRsvpsError) {
        console.error('Error getting all RSVPs:', allRsvpsError);
        return NextResponse.json(
          { message: 'Error retrieving all RSVPs' },
          { status: 500 }
        );
      }
      
      // Get unique event IDs
      const eventIds = [...new Set(allRsvps?.map(rsvp => rsvp.event_id) || [])];
      
      return NextResponse.json({
        totalCount: allRsvps?.length || 0,
        rsvps: allRsvps || [],
        eventIds
      });
    }
    
    // Regular mode - get RSVPs for a specific event
    const event = await getEventBySlug(eventSlug);
    
    if (!event) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Use the event slug as event_id
    const event_id = eventSlug;
    
    // Get all RSVPs for the event
    const { data: rsvps, error, count } = await dbClient
      .from('rsvps')
      .select('*', { count: 'exact' })
      .eq('event_id', event_id);
    
    if (error) {
      console.error('Error getting RSVPs:', error);
      return NextResponse.json(
        { message: 'Error retrieving RSVPs' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      count: rsvps?.length || 0,
      rsvps: rsvps || [],
      event: {
        id: event.id,
        slug: event.slug,
        title: event.title
      }
    });
    
  } catch (error) {
    console.error('Error checking RSVPs:', error);
    return NextResponse.json(
      { message: 'Failed to check RSVPs' },
      { status: 500 }
    );
  }
}