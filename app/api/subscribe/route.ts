import { NextResponse } from 'next/server';
import { getSubscribersCollection } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    // Get the email and name from the request body
    const { email, name } = await request.json();

    // Validate the email and name
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get access to the subscribers collection
    const subscribers = await getSubscribersCollection();

    // Check if email already exists
    const existingSubscriber = await subscribers.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') } // Case-insensitive search
    });

    if (existingSubscriber) {
      return NextResponse.json(
        { message: 'You are already subscribed!' },
        { status: 409 }
      );
    }

    // Prepare the new subscriber
    const newSubscriber = {
      email,
      name: name || 'Anonymous',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert into MongoDB
    const result = await subscribers.insertOne(newSubscriber);

    console.log(`New subscriber added: ${email}, with ID: ${result.insertedId}`);

    // Return success response
    return NextResponse.json(
      { 
        message: 'Successfully subscribed!', 
        subscriber: {
          id: result.insertedId,
          email,
          name: name || 'Anonymous'
        } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in subscription handler:', error);
    return NextResponse.json(
      { message: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}