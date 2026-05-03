import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';

function verifyToken(token: string): { userId: string; exp: number } | null {
  try {
    const [base64Payload, signature] = token.split('.');
    const expectedSignature = createHmac('sha256', 'artisan-blog-secret-key')
      .update(base64Payload)
      .digest('hex');
    if (signature !== expectedSignature) return null;
    const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString());
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

// GET /api/users/me/posts - Get current user's posts (including drafts)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const posts = await db.post.findMany({
      where: { authorId: payload.userId },
      include: {
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
    const totalLikes = posts.reduce(
      (sum, post) => sum + post._count.likes,
      0
    );

    return NextResponse.json({
      posts,
      stats: {
        totalPosts: posts.length,
        publishedPosts: posts.filter((p) => p.published).length,
        draftPosts: posts.filter((p) => !p.published).length,
        totalViews,
        totalLikes,
      },
    });
  } catch (error) {
    console.error('Get my posts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
