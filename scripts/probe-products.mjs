import { readFileSync } from 'fs';
import { GraphQLClient } from 'graphql-request';

const env = {};
const envText = readFileSync('.env.local', 'utf8');
for (const line of envText.split(/\r?\n/)) {
  const m = line.match(/^([A-Za-z0-9_]+)=(.*)/);
  if (!m) continue;
  env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
}

const domain = env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!domain || !token) {
  console.log('missing env');
  process.exit(1);
}

let host = domain.trim().replace(/https?:\/\//, '').replace(/\/$/, '');
if (!host.includes('.myshopify.com')) host += '.myshopify.com';

const client = new GraphQLClient(`https://${host}/api/2024-04/graphql.json`, {
  headers: { 'X-Shopify-Storefront-Access-Token': token },
});

const q = `query { productByHandle(handle: "invidious-tee") { id handle title description featuredImage { url altText } images(first: 10) { nodes { url altText } } priceRange { minVariantPrice { amount currencyCode } } variants(first: 20) { nodes { id title price { amount currencyCode } selectedOptions { name value } } } } }`;

client.request(q).then((data) => {
  console.log(JSON.stringify(data, null, 2));
}).catch((e) => {
  console.error('err', e.message);
});
