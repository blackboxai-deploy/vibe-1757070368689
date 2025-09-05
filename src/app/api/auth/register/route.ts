import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import User from '@/lib/models/User';
import { registerSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid input data', errors: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, password, role, graduationYear, department } = validationResult.data;

    // Connect to database
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password: password, // Will be hashed by pre-save middleware
      name: `${firstName} ${lastName}`,
      role: role,
      profile: {
        firstName,
        lastName,
        graduationYear,
        department,
        isPublic: true,
        lastActive: new Date()
      }
    });

    await user.save();

    // Return success response (exclude password)
    const userResponse = user.getPublicProfile();
    
    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: userResponse
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof Error && error.message.includes('E11000')) {
      return NextResponse.json(
        { success: false, message: 'User already exists with this email' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}