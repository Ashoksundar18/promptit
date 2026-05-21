// ═══════════════════════════════════════════════
//  PROMPT IT — Prompts API
//  GET: Fetch history | POST: Save new prompt
// ═══════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/prompts — Fetch prompt history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const category = searchParams.get('category');
    const favorites = searchParams.get('favorites');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build filter
    const where: any = { userId };

    if (platform && platform !== 'all') {
      where.platform = platform;
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    if (favorites === 'true') {
      where.isFavorite = true;
    }

    if (search) {
      where.OR = [
        { userInput: { contains: search, mode: 'insensitive' } },
        { optimizedPrompt: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [prompts, total] = await Promise.all([
      prisma.promptHistory.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.promptHistory.count({ where }),
    ]);

    return NextResponse.json({ prompts, total });
  } catch (error) {
    console.error('[API] GET /api/prompts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompts' },
      { status: 500 }
    );
  }
}

// POST /api/prompts — Save a new prompt
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await request.json();
    const { userInput, optimizedPrompt, platform, category, qualityScore } = body;

    if (!userInput || !optimizedPrompt || !platform || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prompt = await prisma.promptHistory.create({
      data: {
        userInput,
        optimizedPrompt,
        platform,
        category,
        qualityScore: qualityScore ?? 0,
        isFavorite: false,
        userId,
      },
    });

    // Update streak
    await updateStreak(userId);

    return NextResponse.json(prompt, { status: 201 });
  } catch (error) {
    console.error('[API] POST /api/prompts error:', error);
    return NextResponse.json(
      { error: 'Failed to save prompt' },
      { status: 500 }
    );
  }
}

// ─── Streak helper ───
async function updateStreak(userId: string) {
  const today = new Date().toISOString().split('T')[0];

  const stats = await prisma.userStats.findUnique({ where: { userId } });

  if (!stats) {
    await prisma.userStats.create({
      data: { userId, dailyStreak: 1, lastActiveDay: today },
    });
    return;
  }

  if (stats.lastActiveDay === today) return; // Already active today

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const newStreak = stats.lastActiveDay === yesterdayStr
    ? stats.dailyStreak + 1
    : 1;

  await prisma.userStats.update({
    where: { userId },
    data: { dailyStreak: newStreak, lastActiveDay: today },
  });
}
