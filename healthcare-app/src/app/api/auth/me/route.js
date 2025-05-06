import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findUserById } from '@/models/User';
import { ObjectId } from 'mongodb';

// Helper function to check if a string is a valid MongoDB ObjectId
const isValidObjectId = (id) => {
  try {
    return ObjectId.isValid(id) && (new ObjectId(id)).toString() === id;
  } catch (e) {
    return false;
  }
};

// Helper to extract user ID from either a JWT token or direct ID
const extractUserId = (token) => {
  // Check if it's already a valid ObjectId
  if (isValidObjectId(token)) {
    console.log('Token is a valid MongoDB ObjectId');
    return token;
  }
  
  // If token appears to be a JWT (contains periods)
  if (token.includes('.')) {
    try {
      // Try to decode the JWT payload (middle part)
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString());
      console.log('Extracted user ID from JWT:', decodedPayload.id);
      return decodedPayload.id; // Return the user ID from payload
    } catch (e) {
      console.error('Failed to extract user ID from JWT:', e);
      return null;
    }
  }
  
  // If not a valid format
  console.log('Token is not in a recognized format');
  return null;
};

export async function GET() {
  try {
    console.log('GET /api/auth/me called');
    // Get auth token from cookies
    const token = cookies().get('auth-token')?.value;
    
    if (!token) {
      console.log('No auth-token found');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Extract the user ID from the token
    const userId = extractUserId(token);
    
    if (!userId) {
      console.log('Could not extract a valid user ID from token');
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }
    
    try {
      console.log('Finding user with ID:', userId);
      // Get user from database directly using the ID
      const user = await findUserById(userId);
      
      if (!user) {
        console.log('User not found in database');
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      console.log('User found, returning data');
      // Return user data without password
      const { password, ...userWithoutPassword } = user;
      
      return NextResponse.json({ user: userWithoutPassword });
    } catch (error) {
      console.error('Error finding user:', error.message);
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    );
  }
} 