import { GraphQLClient } from 'graphql-request';

export const client = new GraphQLClient(
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
    ? `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-04/graphql.json`
    : 'https://your-store.myshopify.com/api/2024-04/graphql.json',
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
            available
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
        metafields(first: 20, namespace: "custom") {
          nodes {
            key
            value
          }
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
          available
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
      metafields(first: 20, namespace: "custom") {
        nodes {
          key
          value
        }
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
      available: boolean;
      price: { amount: string; currencyCode: string };
      selectedOptions: { name: string; value: string }[];
      sku?: string;
    }[];
  };
  metafields?: { nodes: { key: string; value: string }[] };
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
