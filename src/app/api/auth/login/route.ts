import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/database';
import User from '@/lib/models/User';
import { loginSchema } from '@/lib/validators';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid input data', errors: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { email, password, rememberMe } = validationResult.data;

    // Connect to database
    await dbConnect();

    // Find user by email
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last active timestamp
    await User.findByIdAndUpdate(user._id, {
      'profile.lastActive': new Date()
    });

    // Create JWT token
    const tokenPayload = {
      userId: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    const expiresIn = rememberMe ? '30d' : '7d';
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn });

    // Get user profile (excluding password)
    const userProfile = user.getPublicProfile();

    // Create response with token in httpOnly cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: userProfile
      },
      { status: 200 }
    );

    // Set HTTP-only cookie with token
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60; // seconds
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAge,
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Handle logout by clearing the auth cookie
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );

    response.cookies.delete('auth-token');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}