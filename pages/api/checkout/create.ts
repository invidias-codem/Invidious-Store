import { NextResponse } from 'next/server';
import { fetchProductByHandle } from '@/lib/shopify';

export const runtime = 'edge';

type CheckoutItem = {
  id: string;
  title: string;
  price: number;
  currency: string;
  variantId?: string;
};

function buildLineItems(items: CheckoutItem[]) {
  const uniqueVariants = new Map<string, CheckoutItem & { quantity: number }>();

  for (const item of items) {
    if (!item.variantId) continue;
    const existing = uniqueVariants.get(item.variantId);
    if (existing) {
      existing.quantity += 1;
      continue;
    }
    uniqueVariants.set(item.variantId, { ...item, quantity: 1 } as CheckoutItem & { quantity: number });
  }

  return Array.from(uniqueVariants.values()).map((item) => ({
    variantId: item.variantId,
    quantity: item.quantity || 1,
  }));
}

export default async function handler(request: Request) {
  try {
    const body = (await request.json().catch(() => ({ items: [] }))) as { items?: CheckoutItem[] };
    const items = body.items ?? [];

    if (!items.length) {
      return NextResponse.json({ ok: false, error: 'Cart is empty.' }, { status: 400 });
    }

    const lineItems = buildLineItems(items);
    if (!lineItems.length) {
      return NextResponse.json({ ok: false, error: 'No valid variants.' }, { status: 400 });
    }

    const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!storeDomain || !storefrontToken) {
      return NextResponse.json({ ok: false, error: 'Storefront is not configured.' }, { status: 500 });
    }

    const checkoutUrl = `https://${storeDomain}/api/2024-04/graphql.json`;

    const checkoutMutation = `#graphql
      mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout {
            id
            webUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const response = await fetch(checkoutUrl, {
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': storefrontToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: checkoutMutation,
        variables: {
          input: {
            lineItems,
          },
        },
      }),
    });

    const result = await response.json();

    if (!response.ok || result.errors || result.data?.checkoutCreate?.userErrors?.length) {
      return NextResponse.json(
        { ok: false, error: 'Checkout creation failed.', details: result },
        { status: 500 }
      );
    }

    const webUrl = result.data?.checkoutCreate?.checkout?.webUrl;
    if (!webUrl) {
      return NextResponse.json({ ok: false, error: 'Missing checkout URL.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, webUrl });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
