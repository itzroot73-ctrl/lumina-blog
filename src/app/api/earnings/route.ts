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

// GET /api/earnings - Get earnings data for current user
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

    const user = await db.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Donation income (artist receives 80%)
    const artistDonations = await db.donation.findMany({
      where: { artistId: payload.userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    const totalDonationIncome = artistDonations.reduce((sum, d) => sum + d.artistAmount, 0);

    // Platform commission from donations (20%)
    const platformDonations = await db.donation.findMany({
      where: { artistId: payload.userId },
    });
    const platformCommission = platformDonations.reduce((sum, d) => sum + d.platformFee, 0);

    // Sponsorship income (100% to platform admin)
    const sponsorships = await db.sponsorship.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    const totalSponsorshipIncome = sponsorships.reduce((sum, s) => sum + s.amount, 0);

    // Build recent transactions
    const recentTransactions = [
      ...artistDonations.map(d => ({
        id: d.id,
        type: 'donation',
        amount: d.artistAmount,
        description: `Donation for post`,
        createdAt: d.createdAt.toISOString(),
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 20);

    return NextResponse.json({
      totalDonationIncome: parseFloat(totalDonationIncome.toFixed(2)),
      totalSponsorshipIncome: parseFloat(totalSponsorshipIncome.toFixed(2)),
      platformCommission: parseFloat(platformCommission.toFixed(2)),
      walletBalance: user.walletBalance,
      recentTransactions,
    });
  } catch (error) {
    console.error('Get earnings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
