import { NextResponse } from 'next/server';
import { client, PRODUCTS_QUERY } from '@/lib/shopify';

export const runtime = 'edge';

export async function GET() {
  try {
    const data = await client.request<{ products: { nodes: Array<{ id: string }> } }>(PRODUCTS_QUERY, {
      first: 1,
    });

    return NextResponse.json({
      ok: true,
      storefrontReachable: true,
      productCount: data.products.nodes.length,
      sampleId: data.products.nodes[0]?.id ?? null,
      nextSteps: 'Storefront API is working. You can expand products/variants fetching in lib/shopify.ts.',
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        storefrontReachable: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        likelyCauses: [
          'NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN is missing or invalid.',
          'NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is incorrect.',
          'Storefront API access token was not generated from Apps > API credentials > Storefront API.',
          'App install is required before token exchange; for storefront access, use a direct storefront token rather than oauth client_credentials.',
        ],
        nextSteps: 'Add NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN to .env.local, then redeploy.',
      },
      { status: 500 }
    );
  }
}
