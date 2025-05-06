import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findUserByEmail, validatePassword } from '@/models/User';

export async function POST(request) {
  try {
    console.log('Login attempt started');
    const { email, password } = await request.json();
    
    console.log(`Login attempt for email: ${email}`);

    // Validate input
    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    console.log('Attempting to find user in database');
    const user = await findUserByEmail(email);
    
    if (!user) {
      console.log('User not found');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    console.log('User found, validating password');

    // Validate password
    const isPasswordValid = await validatePassword(user, password);
    if (!isPasswordValid) {
      console.log('Invalid password');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    console.log('Password valid, creating session');

    // Create a simple session
    // We need to convert the ObjectId to string
    const userId = user._id.toString();
    console.log('User ID for cookie:', userId);
    
    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    // Create the response
    const response = NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword
    });
    
    // Set cookie on the response directly
    response.cookies.set({
      name: 'auth-token',
      value: userId,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    
    console.log('Cookie set directly on response, returning');
    
    return response;

  } catch (error) {
    console.error('Login error details:', error);
    return NextResponse.json(
      { error: `Login failed: ${error.message}` },
      { status: 500 }
    );
  }
} 