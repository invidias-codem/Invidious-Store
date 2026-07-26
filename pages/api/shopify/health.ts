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
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        storefrontReachable: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
