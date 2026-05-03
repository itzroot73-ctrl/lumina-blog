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

// POST /api/premium/activate - Activate premium for user
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

    const user = await db.user.update({
      where: { id: payload.userId },
      data: { isPremium: true },
    });

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Premium activation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
