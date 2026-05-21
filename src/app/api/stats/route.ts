// ═══════════════════════════════════════════════
//  PROMPT IT — Stats API
//  GET: Fetch aggregated statistics
// ═══════════════════════════════════════════════

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/stats — Fetch dashboard statistics
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;
    const today = new Date().toISOString().split('T')[0];

    // Run all queries in parallel
    const [
      totalPrompts,
      promptsToday,
      platformCounts,
      categoryCounts,
      userStats,
    ] = await Promise.all([
      // Total prompts
      prisma.promptHistory.count({ where: { userId } }),

      // Prompts today
      prisma.promptHistory.count({
        where: {
          userId,
          createdAt: {
            gte: new Date(`${today}T00:00:00.000Z`),
          },
        },
      }),

      // Platform breakdown
      prisma.promptHistory.groupBy({
        by: ['platform'],
        where: { userId },
        _count: { platform: true },
        orderBy: { _count: { platform: 'desc' } },
      }),

      // Category breakdown
      prisma.promptHistory.groupBy({
        by: ['category'],
        where: { userId },
        _count: { category: true },
        orderBy: { _count: { category: 'desc' } },
      }),

      // User stats (streak)
      prisma.userStats.findUnique({ where: { userId } }),
    ]);

    const favoritePlatform = platformCounts.length > 0
      ? platformCounts[0].platform
      : null;

    const mostUsedCategory = categoryCounts.length > 0
      ? categoryCounts[0].category
      : null;

    return NextResponse.json({
      totalPrompts,
      promptsToday,
      favoritePlatform,
      mostUsedCategory,
      dailyStreak: userStats?.dailyStreak ?? 0,
      platformBreakdown: platformCounts.map((p: any) => ({
        platform: p.platform,
        count: p._count.platform,
      })),
      categoryBreakdown: categoryCounts.map((c: any) => ({
        category: c.category,
        count: c._count.category,
      })),
    });
  } catch (error) {
    console.error('[API] GET /api/stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
