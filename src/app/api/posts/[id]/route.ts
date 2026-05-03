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

// GET /api/posts/[id] - Get single post (increment views)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await db.post.update({
      where: { id },
      data: { views: { increment: 1 } },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true, bio: true },
        },
        _count: { select: { likes: true, comments: true, donations: true } },
        sponsorships: { where: { isActive: true }, take: 1 },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const postWithType = {
      ...post,
      isSponsored: (post.sponsorships?.length || 0) > 0,
      sponsorship: post.sponsorships?.[0] || null,
      postType: (post.videoUrl || post.category === 'Video') ? 'video' : 'article',
    };

    return NextResponse.json({ post: postWithType });
  } catch (error) {
    console.error('Get post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/posts/[id] - Update post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getAuthUser(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existingPost = await db.post.findUnique({ where: { id } });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (existingPost.authorId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { title, excerpt, content, thumbnail, published, readingTime, videoUrl, category } = body;

    const post = await db.post.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content !== undefined && { content }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(published !== undefined && { published }),
        ...(readingTime !== undefined && { readingTime }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(category !== undefined && { category }),
      },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true },
        },
      },
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Update post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/posts/[id] - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getAuthUser(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existingPost = await db.post.findUnique({ where: { id } });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (existingPost.authorId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.post.delete({ where: { id } });

    return NextResponse.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
