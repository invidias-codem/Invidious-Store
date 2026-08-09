import { NextResponse } from 'next/server';

function normalizeStoreDomain(domain?: string) {
  if (!domain) return 'your-store.myshopify.com';
  const trimmed = domain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
  if (trimmed.includes('.myshopify.com')) return trimmed;
  return `${trimmed}.myshopify.com`;
}

export async function getShopifyAdminToken(): Promise<string> {
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
  if (!response.ok || !data.access_token) {
    const message = data?.error_description || data?.error || 'Token exchange failed.';
    throw new Error(message);
  }

  return data.access_token as string;
}

export function createAdminClient(accessToken: string) {
  const shopDomain = normalizeStoreDomain(process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN);
  const endpoint = `https://${shopDomain}/admin/api/2024-04/graphql.json`;

  return {
    async request<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken,
        },
        body: JSON.stringify({ query, variables }),
      });

      const result = await response.json();
      if (!response.ok || result.errors?.length) {
        const message = result.errors?.[0]?.message || `Admin request failed: ${response.status}`;
        throw new Error(message);
      }

      return result.data as T;
    },
  };
}
