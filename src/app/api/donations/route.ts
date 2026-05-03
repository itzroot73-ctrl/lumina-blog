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

// POST /api/donations - Create a donation (80/20 split)
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
    const { postId, amount, message } = body;

    if (!postId || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Post ID and valid amount are required' }, { status: 400 });
    }

    // Cap donation between $1 and $500
    const donationAmount = Math.min(Math.max(parseFloat(amount), 1), 500);
    if (isNaN(donationAmount)) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Get the post to find the artist
    const post = await db.post.findUnique({
      where: { id: postId },
      include: { author: true },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Cannot donate to own post
    if (post.authorId === payload.userId) {
      return NextResponse.json({ error: 'Cannot donate to your own post' }, { status: 400 });
    }

    // 80/20 split calculation
    const artistAmount = parseFloat((donationAmount * 0.80).toFixed(2));
    const platformFee = parseFloat((donationAmount * 0.20).toFixed(2));

    const donation = await db.donation.create({
      data: {
        amount: donationAmount,
        artistAmount,
        platformFee,
        postId,
        donorId: payload.userId,
        artistId: post.authorId,
        message: message || null,
      },
      include: {
        donor: { select: { id: true, name: true, username: true, avatar: true } },
        artist: { select: { id: true, name: true, username: true, avatar: true } },
      },
    });

    return NextResponse.json({ donation }, { status: 201 });
  } catch (error) {
    console.error('Create donation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/donations?postId=xxx - Get donations for a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }

    const donations = await db.donation.findMany({
      where: { postId },
      include: {
        donor: { select: { id: true, name: true, username: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
    const totalArtistEarnings = donations.reduce((sum, d) => sum + d.artistAmount, 0);

    return NextResponse.json({
      donations,
      totalDonated: parseFloat(totalDonated.toFixed(2)),
      totalArtistEarnings: parseFloat(totalArtistEarnings.toFixed(2)),
      donationCount: donations.length,
    });
  } catch (error) {
    console.error('Get donations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
