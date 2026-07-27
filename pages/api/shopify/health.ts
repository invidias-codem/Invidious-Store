import { NextResponse } from 'next/server';
import { client, PRODUCTS_QUERY } from '@/lib/shopify';

export const runtime = 'edge';

export default async function handler(request: Request) {
  try {
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    const diagnostics = {
      domainConfigured: Boolean(domain),
      domainPreview: domain
        ? `${domain.replace(/\/$/, '')}/api/2024-04/graphql.json`
        : null,
      tokenPreview: token
        ? `...${token.slice(-6)}`
        : null,
    };

    if (!domain || !token) {
      return NextResponse.json(
        {
          ok: false,
          storefrontReachable: false,
          diagnostics,
          error: 'Missing Shopify env vars.',
          nextSteps: 'Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN in Vercel, then redeploy.',
        },
        { status: 500 }
      );
    }

    const data = await client.request<{ products: { nodes: Array<{ id: string }> } }>(PRODUCTS_QUERY, {
      first: 1,
    });

    return NextResponse.json({
      ok: true,
      storefrontReachable: true,
      productCount: data.products.nodes.length,
      sampleId: data.products.nodes[0]?.id ?? null,
      nextSteps: 'Storefront API is working. Expand fetching/products in lib/shopify.ts.',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const response = (error as any)?.response;
    const safeStatus = response?.status ?? null;
    const safeBody = response?.body ?? null;

    return NextResponse.json(
      {
        ok: false,
        storefrontReachable: false,
        error: message,
        diagnostics: {
          domainConfigured: Boolean(process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN),
          tokenPreview: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
            ? `...${process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN.slice(-6)}`
            : null,
        },
        likelyCauses: [
          'Storefront token is invalid or revoked.',
          'NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN format is wrong.',
          'Storefront API not enabled for this token.',
        ],
        nextSteps: 'Verify Vercel env vars, then redeploy.',
        transportStatus: safeStatus,
        transportBodyPreview: typeof safeBody === 'string' ? safeBody.slice(0, 200) : safeBody,
      },
      { status: 500 }
    );
  }
}
