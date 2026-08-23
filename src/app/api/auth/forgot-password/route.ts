import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

// POST /api/auth/forgot-password
// Creates a password reset token and returns it
// In production, this would send an email
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: 'No account found with this email address.',
          userExists: false,
        },
        { status: 404 }
      );
    }

    // Invalidate existing tokens for this email
    await prisma.passwordReset.updateMany({
      where: { email: email.toLowerCase(), used: false },
      data: { used: true },
    });

    // Generate a secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    // Save token to database
    await prisma.passwordReset.create({
      data: {
        token,
        email: email.toLowerCase(),
        expiresAt,
      },
    });

    return NextResponse.json({
      message: 'Password reset link created successfully.',
      userExists: true,
      token,
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    const errMessage = error?.message || 'Database error occurred. Please try again.';
    return NextResponse.json(
      { message: errMessage },
      { status: 500 }
    );
  }
}
