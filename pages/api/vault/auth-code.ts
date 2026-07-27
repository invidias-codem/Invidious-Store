import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as { email?: string; phone?: string };
    const email = body.email?.trim();
    const phone = body.phone?.trim();

    if (!email && !phone) {
      return NextResponse.json({ ok: false, error: 'Email or phone is required.' }, { status: 400 });
    }

    const store = process.env.AUTH_CODE_STORE;
    const signingSecret = process.env.AUTH_CODE_SIGNING_SECRET;

    if (!store || !signingSecret) {
      return NextResponse.json({ ok: false, error: 'Auth code workflow is not configured yet.' }, { status: 500 });
    }

    const destination = email || phone;

    return NextResponse.json({
      ok: true,
      status: 'pending_integration',
      destination,
      nextSteps: 'Wire auth-code generation + email/SMS delivery here once messaging provider is configured.',
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
