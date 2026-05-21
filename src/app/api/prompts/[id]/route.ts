// ═══════════════════════════════════════════════
//  PROMPT IT — Single Prompt API
//  PATCH: Toggle favorite | DELETE: Remove prompt
// ═══════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

type RouteParams = { params: Promise<{ id: string }> };

// PATCH /api/prompts/[id] — Toggle favorite
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    const existing = await prisma.promptHistory.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }

    const prompt = await prisma.promptHistory.update({
      where: { id },
      data: {
        isFavorite: body.isFavorite,
      },
    });

    return NextResponse.json(prompt);
  } catch (error) {
    console.error(`[API] PATCH /api/prompts/${(await params).id} error:`, error);
    return NextResponse.json(
      { error: 'Failed to update prompt' },
      { status: 500 }
    );
  }
}

// DELETE /api/prompts/[id] — Delete a prompt
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const { id } = await params;

    // Verify ownership
    const existing = await prisma.promptHistory.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }

    await prisma.promptHistory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[API] DELETE /api/prompts/${(await params).id} error:`, error);
    return NextResponse.json(
      { error: 'Failed to delete prompt' },
      { status: 500 }
    );
  }
}
