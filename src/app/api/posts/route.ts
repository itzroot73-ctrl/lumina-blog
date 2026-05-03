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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// GET /api/posts - Get all published posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const postType = searchParams.get('postType') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      published: true,
      ...(search
        ? {
            OR: [
              { title: { contains: search } },
              { excerpt: { contains: search } },
            ],
          }
        : {}),
      ...(category ? { category } : {}),
    };

    let posts;
    let total;

    if (postType === 'video') {
      // Filter for video posts - posts that have videoUrl or category Video
      const videoWhere = { ...where, OR: [{ videoUrl: { not: null } }, { category: 'Video' }] };
      [posts, total] = await Promise.all([
        db.post.findMany({
          where: videoWhere,
          include: {
            author: { select: { id: true, name: true, username: true, avatar: true } },
            _count: { select: { likes: true, comments: true } },
            sponsorships: { where: { isActive: true }, take: 1 },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        db.post.count({ where: videoWhere }),
      ]);
    } else if (postType === 'article') {
      // Filter for article posts - no videoUrl and not Video category
      const articleWhere = { ...where, videoUrl: null, NOT: { category: 'Video' } };
      [posts, total] = await Promise.all([
        db.post.findMany({
          where: articleWhere,
          include: {
            author: { select: { id: true, name: true, username: true, avatar: true } },
            _count: { select: { likes: true, comments: true } },
            sponsorships: { where: { isActive: true }, take: 1 },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        db.post.count({ where: articleWhere }),
      ]);
    } else if (postType === 'sponsored') {
      // Filter for sponsored posts
      const sponsoredPosts = await db.sponsorship.findMany({
        where: { isActive: true },
        include: {
          post: {
            include: {
              author: { select: { id: true, name: true, username: true, avatar: true } },
              _count: { select: { likes: true, comments: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      posts = sponsoredPosts.map(s => ({
        ...s.post,
        isSponsored: true,
        sponsorship: { id: s.id, amount: s.amount, expiresAt: s.expiresAt, isActive: s.isActive },
      })).filter(p => p.id);
      total = posts.length;
    } else {
      [posts, total] = await Promise.all([
        db.post.findMany({
          where,
          include: {
            author: { select: { id: true, name: true, username: true, avatar: true } },
            _count: { select: { likes: true, comments: true } },
            sponsorships: { where: { isActive: true }, take: 1 },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        db.post.count({ where }),
      ]);
    }

    // Mark sponsored posts
    const postsWithSponsorFlag = posts.map((p: Record<string, unknown>) => ({
      ...p,
      isSponsored: (p.isSponsored as boolean) || ((p.sponsorships as unknown[])?.length > 0),
      sponsorship: p.sponsorship || ((p.sponsorships as unknown[])?.[0] || null),
      postType: (p.videoUrl || p.category === 'Video') ? 'video' : 'article',
    }));

    return NextResponse.json({
      posts: postsWithSponsorFlag,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const userId = getAuthUser(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, excerpt, content, thumbnail, category, published, readingTime, videoUrl, postType } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const slug = slugify(title) + '-' + Date.now().toString(36);
    const finalCategory = postType === 'video' ? (category || 'Video') : (category || 'Tech');

    const post = await db.post.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        thumbnail: thumbnail || null,
        videoUrl: videoUrl || null,
        category: finalCategory,
        published: published || false,
        readingTime: readingTime || Math.max(1, Math.ceil(content.split(/\s+/).length / 200)),
        authorId: userId,
      },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true },
        },
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
