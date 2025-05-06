// filepath: c:\Websites\NightChurch\app\api\admin\upload\route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Get secret key from environment variable
const SECRET_KEY = process.env.ADMIN_SECRET_KEY;
const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

// Check if environment variables are defined
if (!SECRET_KEY) {
  console.error('Missing environment variable: ADMIN_SECRET_KEY');
}

if (!IMGBB_API_KEY) {
  console.error('Missing environment variable: IMGBB_API_KEY');
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

// POST /api/admin/upload - Handle image uploads using imgBB
export async function POST(request: Request) {
  try {
    // Verify admin token
    if (!verifyAdminToken(request)) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!IMGBB_API_KEY) {
      return NextResponse.json(
        { message: 'Server configuration error: Missing imgBB API key' },
        { status: 500 }
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

    console.log('File received:', file.name, file.type, file.size);

    // Get file buffer
    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');
    
    // Use URL parameters instead of FormData (more reliable across environments)
    const params = new URLSearchParams();
    params.append('key', IMGBB_API_KEY);
    params.append('image', base64Image);
    
    console.log('Sending request to imgBB API...');

    // Upload to imgBB using URL parameters
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('ImgBB API error response:', errorText);
      throw new Error(`ImgBB upload failed: ${response.status} ${response.statusText}`);
    }
    
    const imgbbData = await response.json();
    console.log('ImgBB API response success:', imgbbData.success);
    
    if (!imgbbData.success) {
      console.error('ImgBB error:', imgbbData.error);
      throw new Error('ImgBB upload failed: ' + (imgbbData.error?.message || 'Unknown error'));
    }
    
    console.log('Image uploaded successfully. URL:', imgbbData.data.url);
    
    // Return the URL to the uploaded image
    return NextResponse.json({ 
      message: 'File uploaded successfully',
      url: imgbbData.data.url
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { message: 'Failed to upload file: ' + (error as Error).message },
      { status: 500 }
    );
  }
}