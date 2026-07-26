import { NextResponse } from 'next/server';

export const runtime = 'edge';

async function getAccessToken() {
  const shop = process.env.SHOPIFY_SHOP;
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

  if (!shop || !clientId || !clientSecret) {
    throw new Error('Missing SHOPIFY_SHOP, SHOPIFY_CLIENT_ID, or SHOPIFY_CLIENT_SECRET.');
  }

  const url = `https://${shop}.myshopify.com/admin/oauth/access_token`;
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
    throw new Error(JSON.stringify({ status: response.status, error: data }));
  }

  return data;
}

export async function POST() {
  try {
    const token = await getAccessToken();

    return NextResponse.json({
      ok: true,
      accessToken: token.access_token,
      scope: token.scope,
      expiresIn: token.expires_in,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    let parsed: any = { message };

    try {
      parsed = JSON.parse(message);
    } catch {
      // keep raw message
    }

    return NextResponse.json(
      {
        ok: false,
        error: parsed.error || parsed.message || 'Token exchange failed.',
        status: parsed.status,
        help: [
          'Make sure the app is installed on the store.',
          'Confirm the app and store are in the same Shopify org in the Dev Dashboard.',
          'Ensure SHOPIFY_SHOP is just the subdomain, e.g., wzixpi-x3',
        ],
      },
      { status: 500 }
    );
  }
}
