#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function loadEnv(p) {
  const envPath = path.resolve(p);
  if (!fs.existsSync(envPath)) {
    console.error(`Missing .env.local at ${envPath}`);
    
  }
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  const out = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    out[key] = val.replace(/^['"]|['"]$/g, '');
  }
  return out;
}

const env = loadEnv('.env.local');
const shop = env.SHOPIFY_SHOP || env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN?.replace('.myshopify.com', '');
const clientId = env.SHOPIFY_CLIENT_ID;
const clientSecret = env.SHOPIFY_CLIENT_SECRET;
const storefrontToken = env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const storeDomain = env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;

console.log('Loaded env from .env.local');

if (!shop) {
  console.error('Missing SHOPIFY_SHOP or NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN in .env.local');
  
}

if (clientId && clientSecret) {
  console.log(`Exchange token for shop=${shop}`);
  const params = new URLSearchParams();
  params.set('grant_type', 'client_credentials');
  params.set('client_id', clientId);
  params.set('client_secret', clientSecret);

  const tokenRes = await fetch(`https://${shop}.myshopify.com/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  const tokenData = await tokenRes.json();
  console.log('Token status:', tokenRes.status);
  console.log('Token response:', tokenData);
} else {
  console.warn('Skipping token exchange: SHOPIFY_CLIENT_ID/SHOPIFY_CLIENT_SECRET not set.');
}

if (storeDomain && storefrontToken) {
  console.log(`Verify Storefront API access for domain=${storeDomain}`);
  const query = `query { products(first: 1) { nodes { id } } }`;
  const res = await fetch(`https://${storeDomain}/api/2024-04/graphql.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token': storefrontToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const data = await res.json();
  console.log('Storefront status:', res.status);
  console.log('Storefront response:', data);
} else {
  console.warn('Skipping Storefront verification: NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN/NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN not set.');
}
