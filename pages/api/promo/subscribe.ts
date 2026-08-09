import { NextResponse } from 'next/server';

export const runtime = 'edge';

export default async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as { email?: string; phone?: string; source?: string };
    const email = body.email?.trim();
    const phone = body.phone?.trim();
    const source = body.source?.trim() || 'unknown';

    if (!email && !phone) {
      return NextResponse.json({ ok: false, error: 'Email or phone is required.' }, { status: 400 });
    }

    const store = process.env.PROMO_LIST_STORE;
    const signingSecret = process.env.PROMO_LIST_SIGNING_SECRET;

    if (!store || !signingSecret) {
      return NextResponse.json({ ok: false, error: 'Promo list is not configured yet.' }, { status: 500 });
    }

    const record = {
      email: email || null,
      phone: phone || null,
      source,
      subscribedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      ok: true,
      status: 'pending_integration',
      record,
      nextSteps: 'Wire store write here once Resend/Twilio + KV are configured.',
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
