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
          metafields(identifiers: [
            { namespace: "custom", key: "size_guide" }
            { namespace: "custom", key: "glbSrc" }
            { namespace: "custom", key: "usdzSrc" }
          ]) {
            key
            value
            type
          }
        }
      }
      metafields(identifiers: [{ namespace: "custom", key: "size_guide" }]) {
        key
        value
      }
    }
  }
`;

export const PRODUCT_RECOMMENDATIONS_QUERY = `#graphql
  query ProductRecommendations($productId: ID!, $first: Int!) {
    productRecommendations(productId: $productId, first: $first) {
      id
      handle
      title
      featuredImage {
        url
        altText
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
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
      availableForSale: boolean;
      price: { amount: string; currencyCode: string };
      selectedOptions: { name: string; value: string }[];
      sku?: string;
      metafields?: { key: string; value: string; type: string }[];
    }[];
  };
  metafields?: { key: string; value: string }[];
  productRecommendations?: Array<{
    id: string;
    handle: string;
    title: string;
    featuredImage?: { url: string; altText?: string };
    priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  }>;
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

  if (!handle || typeof handle !== 'string') {
    return null;
  }

  try {
    const data = await client.request<{ productByHandle: ShopifyProduct | null }>(PRODUCT_BY_HANDLE_QUERY, {
      handle,
    });
    return data.productByHandle ?? null;
  } catch {
    return null;
  }
}

export async function fetchProductRecommendations(productId: string, first = 4): Promise<ShopifyProduct['productRecommendations']> {
  if (!productId || !process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return [];
  }

  try {
    const data = await client.request<{ productRecommendations: ShopifyProduct['productRecommendations'] }>(
      PRODUCT_RECOMMENDATIONS_QUERY,
      { productId, first }
    );
    return data.productRecommendations ?? [];
  } catch {
    return [];
  }
}

export type ShopifyCheckoutInput = {
  merchandiseId: string;
  quantity?: number;
};

export type ShopifyCheckoutResult = {
  checkoutUrl: string;
};

export type ShopifyCheckoutError = {
  message?: string;
  userErrors?: Array<{ message?: string }>;
};

export async function createCheckout(
  items: ShopifyCheckoutInput[],
  returnUrl?: string
): Promise<ShopifyCheckoutResult> {
  if (!items.length) {
    throw new Error('Cart manifest is empty.');
  }

  const mutation = `#graphql
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        userErrors {
          message
        }
      }
    }
  `;

  const input: any = {
    lineItems: items.map((item) => ({
      variantId: item.merchandiseId,
      quantity: item.quantity ?? 1,
    })),
  };

  if (returnUrl) {
    input.returnUrl = returnUrl;
  }

  const data = await client.request<{
    checkoutCreate: {
      checkout?: { id: string; webUrl: string };
      userErrors: ShopifyCheckoutError['userErrors'];
    };
  }>(mutation, { input });

  const checkout = data.checkoutCreate?.checkout;
  const errors = data.checkoutCreate?.userErrors ?? [];

  if (!checkout?.webUrl) {
    const message = errors[0]?.message || 'Failed to initialize secure transaction.';
    throw new Error(message);
  }

  return { checkoutUrl: checkout.webUrl };
}
