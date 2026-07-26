import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST() {
  try {
    const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const clientId = process.env.SHOPIFY_CLIENT_ID;
    const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

    if (!storeDomain || !clientId || !clientSecret) {
      return NextResponse.json({ ok: false, error: 'Missing Shopify client/env configuration.' }, { status: 500 });
    }

    const url = `https://${storeDomain}/admin/oauth/access_token`;
    const body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');
    body.set('client_id', clientId);
    body.set('client_secret', clientSecret);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ ok: false, status: response.status, error: data }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      accessToken: data.access_token,
      scope: data.scope,
      expiresIn: data.expires_in,
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
