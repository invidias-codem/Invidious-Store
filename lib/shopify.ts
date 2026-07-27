import { GraphQLClient } from 'graphql-request';

function normalizeStoreDomain(domain?: string) {
  if (!domain) return 'your-store.myshopify.com';
  const trimmed = domain.trim().replace(/https?:\/\//, '').replace(/\/$/, '');
  if (trimmed.includes('.myshopify.com')) return trimmed;
  return `${trimmed}.myshopify.com`;
}

export const client = new GraphQLClient(
  `https://${normalizeStoreDomain(process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN)}/api/2024-04/graphql.json`,
  {
    headers: {
      'X-Shopify-Storefront-Access-Token':
        process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'your-storefront-access-token',
    },
  }
);

export const PRODUCTS_QUERY = `#graphql
  query Products($first: Int!) {
    products(first: $first) {
      nodes {
        id
        handle
        title
        description
        featuredImage {
          url
          altText
        }
        images(first: 8) {
          nodes {
            url
            altText
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 20) {
          nodes {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            sku
          }
        }
        metafields(identifiers: [{namespace: "custom", key: "size_guide"}]) {
          key
          value
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `#graphql
  query ProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      handle
      title
      description
      featuredImage {
        url
        altText
      }
      images(first: 10) {
        nodes {
          url
          altText
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 20) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          sku
        }
      }
      metafields(identifiers: [{namespace: "custom", key: "size_guide"}]) {
        key
        value
      }
    }
  }
`;

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage?: { url: string; altText?: string };
  images?: { nodes: { url: string; altText?: string }[] };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  variants?: {
    nodes: {
      id: string;
      title: string;
      availableForSale: boolean;
      price: { amount: string; currencyCode: string };
      selectedOptions: { name: string; value: string }[];
      sku?: string;
    }[];
  };
  metafields?: { key: string; value: string }[];
};

export async function fetchProducts(first = 24): Promise<ShopifyProduct[]> {
  if (!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return [];
  }

  try {
    const data = await client.request<{ products: { nodes: ShopifyProduct[] } }>(PRODUCTS_QUERY, {
      first,
    });
    return data.products.nodes;
  } catch {
    return [];
  }
}

export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  if (!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return null;
  }

  try {
    const data = await client.request<{ productByHandle: ShopifyProduct }>(PRODUCT_BY_HANDLE_QUERY, {
      handle,
    });
    return data.productByHandle ?? null;
  } catch {
    return null;
  }
}
