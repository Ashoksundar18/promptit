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

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return NextResponse.json({
        message: 'If an account with that email exists, a reset link has been generated.',
        // In production: send a real email here
      });
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

    // In production, send email with reset link:
    // const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
    // await sendEmail(email, resetUrl);

    return NextResponse.json({
      message: 'If an account with that email exists, a reset link has been generated.',
      // For demo purposes, return the token directly
      // Remove this in production and send via email instead
      token,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
