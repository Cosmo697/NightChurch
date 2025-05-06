import { NextResponse } from 'next/server';
import supabase, { getAdminSupabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    console.log('Subscription request started');

    // Get the email and name from the request body
    const { email, name } = await request.json();
    console.log(`Received subscription request for: ${email}`);

    // Validate the email and name
    if (!email) {
      console.log('Validation failed: Email is required');
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      console.log('Validation failed: Invalid email format');
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    try {
      // Use the admin client to bypass RLS policies
      const adminSupabase = getAdminSupabase();
      console.log('Using admin Supabase client to bypass RLS policies');
      
      // Check if email already exists in Supabase
      console.log('Checking for existing subscriber...');
      const { data: existingSubscribers, error: queryError } = await adminSupabase
        .from('subscribers')
        .select('*')
        .ilike('email', email)
        .limit(1);

      if (queryError) {
        console.error('Error checking for existing subscriber:', queryError);
        return NextResponse.json(
          { message: 'Database operation failed. Please try again later.' },
          { status: 503 }
        );
      }

      if (existingSubscribers && existingSubscribers.length > 0) {
        console.log(`Email already exists: ${email}`);
        return NextResponse.json(
          { message: 'You are already subscribed!' },
          { status: 409 }
        );
      }

      // Prepare the new subscriber
      const newSubscriber = {
        email,
        name: name || 'Anonymous',
        created_at: new Date().toISOString()
      };

      // Insert into Supabase using admin client
      console.log('Inserting new subscriber...');
      const { data: insertResult, error: insertError } = await adminSupabase
        .from('subscribers')
        .insert([newSubscriber])
        .select();

      if (insertError) {
        console.error('Error inserting new subscriber:', insertError);
        return NextResponse.json(
          { message: 'Failed to subscribe. Please try again later.' },
          { status: 503 }
        );
      }

      console.log(`New subscriber added: ${email}`);

      // Return success response
      return NextResponse.json(
        { 
          message: 'Successfully subscribed!', 
          subscriber: {
            id: insertResult[0]?.id,
            email,
            name: name || 'Anonymous'
          } 
        },
        { status: 201 }
      );
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      return NextResponse.json(
        { message: 'Database connection or operation failed. Please try again later.' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('General error in subscription handler:', error);
    return NextResponse.json(
      { message: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}