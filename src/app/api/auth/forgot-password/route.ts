import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

// POST /api/auth/forgot-password
// Creates a password reset token and sends an email
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

    // Build reset link
    const origin = req.headers.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${origin}/reset-password?token=${token}`;

    // Attempt to send email
    const emailSent = await sendPasswordResetEmail({
      to: email.toLowerCase(),
      resetUrl,
    });

    return NextResponse.json({
      message: emailSent
        ? 'Password reset email sent to your inbox.'
        : 'Password reset link created successfully.',
      userExists: true,
      emailSent,
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
