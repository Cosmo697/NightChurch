import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const token = request.headers.get('Authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Very simple token validation - in a real app, consider using a proper auth system
    const tokenParts = token.split('.');
    if (tokenParts.length !== 2) {
      return NextResponse.json({ message: 'Invalid token format' }, { status: 401 });
    }
    
    const expiresAt = parseInt(tokenParts[1], 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      return NextResponse.json({ message: 'Token expired' }, { status: 401 });
    }
    
    // Get event ID from query param
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const getAll = searchParams.get('all') === 'true';
    
    // Use admin Supabase client to bypass RLS policies
    const supabase = getAdminSupabase();
    
    // If getAll is true, return all RSVPs regardless of event
    if (getAll) {
      console.log('Fetching ALL RSVPs from the database using admin client');
      
      // Fetch from rsvps table
      const { data: allRsvps, error: rsvpsError } = await supabase
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (rsvpsError) {
        console.error('Error fetching RSVPs:', rsvpsError);
        return NextResponse.json({ 
          message: 'Failed to fetch RSVPs', 
          error: rsvpsError 
        }, { status: 500 });
      }
      
      // Get unique event IDs from RSVPs
      const eventIds = [...new Set(allRsvps?.map(r => r.event_id) || [])];
      console.log('Unique event IDs in RSVPs:', eventIds);
      
      return NextResponse.json({ 
        rsvps: allRsvps || [],
        eventIds
      });
    }
    
    if (!eventId) {
      return NextResponse.json({ message: 'Event ID is required' }, { status: 400 });
    }
    
    console.log('Fetching RSVPs for event ID:', eventId);
    
    // First try with exact match
    const { data: rsvps, error } = await supabase
      .from('rsvps')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching RSVPs:', error);
      return NextResponse.json({ 
        message: 'Failed to fetch RSVPs', 
        error 
      }, { status: 500 });
    }
    
    if (rsvps && rsvps.length > 0) {
      console.log(`Found ${rsvps.length} RSVPs for event ID: ${eventId}`);
      return NextResponse.json({ rsvps });
    }
    
    // If no results, try with ILIKE for case-insensitive partial match
    console.log('No exact matches found, trying case-insensitive search');
    const { data: flexRsvps, error: flexError } = await supabase
      .from('rsvps')
      .select('*')
      .ilike('event_id', `%${eventId}%`)
      .order('created_at', { ascending: false });
    
    if (flexError) {
      console.error('Error in flexible RSVPs search:', flexError);
      return NextResponse.json({ rsvps: [] });
    }
    
    console.log(`Found ${flexRsvps?.length || 0} RSVPs with flexible matching for event ID: ${eventId}`);
    return NextResponse.json({ rsvps: flexRsvps || [] });
    
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}