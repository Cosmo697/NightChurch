import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    // Test the connection to MongoDB
    const client = await clientPromise;
    
    // Get the admin database
    const db = client.db('admin');
    
    // Run a simple command to verify the connection
    await db.command({ ping: 1 });
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Connected to MongoDB successfully!' 
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to connect to MongoDB',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}