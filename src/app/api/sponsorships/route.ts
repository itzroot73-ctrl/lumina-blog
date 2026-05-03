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

// POST /api/sponsorships - Create a sponsorship (100% to platform)
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { postId, amount, duration } = body;

    if (!postId || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Post ID and valid amount are required' }, { status: 400 });
    }

    const sponsorAmount = Math.min(Math.max(parseFloat(amount), 1), 1000);
    if (isNaN(sponsorAmount)) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const sponsorDuration = Math.min(Math.max(parseInt(duration) || 24, 1), 168); // 1h to 7 days

    const post = await db.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const expiresAt = new Date(Date.now() + sponsorDuration * 60 * 60 * 1000);

    const sponsorship = await db.sponsorship.create({
      data: {
        postId,
        userId: payload.userId,
        amount: sponsorAmount,
        duration: sponsorDuration,
        expiresAt,
        isActive: true,
      },
    });

    return NextResponse.json({ sponsorship }, { status: 201 });
  } catch (error) {
    console.error('Create sponsorship error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/sponsorships?active=true - Get sponsored posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active') === 'true';

    // Deactivate expired sponsorships
    await db.sponsorship.updateMany({
      where: { expiresAt: { lt: new Date() }, isActive: true },
      data: { isActive: false },
    });

    const where = active ? { isActive: true } : {};
    const sponsorships = await db.sponsorship.findMany({
      where,
      include: {
        post: {
          include: {
            author: { select: { id: true, name: true, username: true, avatar: true } },
          },
        },
        user: { select: { id: true, name: true, username: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const posts = sponsorships
      .filter(s => s.post)
      .map(s => ({
        ...s.post,
        isSponsored: true,
        sponsorship: {
          id: s.id,
          amount: s.amount,
          duration: s.duration,
          expiresAt: s.expiresAt,
          isActive: s.isActive,
          createdAt: s.createdAt,
          user: s.user,
        },
      }));

    return NextResponse.json({ posts, sponsorships });
  } catch (error) {
    console.error('Get sponsorships error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
