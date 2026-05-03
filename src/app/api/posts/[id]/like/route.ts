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

function getAuthUser(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  return payload ? payload.userId : null;
}

// POST /api/posts/[id]/like - Toggle like
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getAuthUser(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const post = await db.post.findUnique({ where: { id } });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const existingLike = await db.like.findUnique({
      where: { postId_userId: { postId: id, userId } },
    });

    if (existingLike) {
      await db.like.delete({ where: { id: existingLike.id } });
      const likeCount = await db.like.count({ where: { postId: id } });
      return NextResponse.json({ liked: false, likeCount });
    } else {
      await db.like.create({ data: { postId: id, userId } });
      const likeCount = await db.like.count({ where: { postId: id } });
      return NextResponse.json({ liked: true, likeCount });
    }
  } catch (error) {
    console.error('Toggle like error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
