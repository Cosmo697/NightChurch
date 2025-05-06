// filepath: c:\Websites\NightChurch\app\api\admin\upload\route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
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

// Helper to ensure upload directory exists
async function ensureUploadDirectoryExists() {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'events');
  await fs.mkdir(uploadDir, { recursive: true });
  return uploadDir;
}

// POST /api/admin/upload - Handle image uploads
export async function POST(request: Request) {
  try {
    // Verify admin token
    if (!verifyAdminToken(request)) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { message: 'File must be an image' },
        { status: 400 }
      );
    }

    // Get file buffer
    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    // Generate a unique filename
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    // Save the file
    const uploadDir = await ensureUploadDirectoryExists();
    const filePath = path.join(uploadDir, fileName);
    
    await fs.writeFile(filePath, fileBuffer);
    
    // Return the URL to the uploaded file
    const fileUrl = `/uploads/events/${fileName}`;
    
    return NextResponse.json({ 
      message: 'File uploaded successfully',
      url: fileUrl
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { message: 'Failed to upload file' },
      { status: 500 }
    );
  }
}