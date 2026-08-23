import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

// POST /api/auth/reset-password
// Validates token and resets the password
export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: 'Token and new password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Find the reset token
    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!resetRecord) {
      return NextResponse.json(
        { message: 'Invalid or expired reset link' },
        { status: 400 }
      );
    }

    // Check if token is expired or used
    if (resetRecord.used || resetRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { message: 'This reset link has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: resetRecord.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { email: resetRecord.email },
      data: { password: hashedPassword },
    });

    // Mark token as used
    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { used: true },
    });

    return NextResponse.json({
      message: 'Password has been reset successfully. You can now sign in.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
