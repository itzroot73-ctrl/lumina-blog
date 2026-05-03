import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { createHash, createHmac } from 'crypto';

function verifyPassword(password: string, storedPassword: string): boolean {
  const [salt, hash] = storedPassword.split(':');
  const computedHash = createHash('sha256')
    .update(salt + password)
    .digest('hex');
  return hash === computedHash;
}

function generateToken(userId: string): string {
  const payload = JSON.stringify({
    userId,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  const base64Payload = Buffer.from(payload).toString('base64');
  const signature = createHmac('sha256', 'artisan-blog-secret-key')
    .update(base64Payload)
    .digest('hex');
  return `${base64Payload}.${signature}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!verifyPassword(password, user.password)) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = generateToken(user.id);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
