import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/users/[username] - Get public profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const user = await db.user.findUnique({
      where: { username },
      include: {
        posts: {
          where: { published: true },
          include: {
            _count: { select: { likes: true, comments: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { posts: true, likes: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    const totalViews = user.posts.reduce((sum, post) => sum + post.views, 0);
    const totalLikes = user.posts.reduce(
      (sum, post) => sum + post._count.likes,
      0
    );

    return NextResponse.json({
      user: userWithoutPassword,
      stats: {
        totalPosts: user.posts.length,
        totalViews,
        totalLikes,
        estimatedRevenue: parseFloat((totalViews * 0.02 * 0.20).toFixed(2)),
      },
      posts: user.posts,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
