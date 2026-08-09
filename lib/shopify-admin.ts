import { getShopifyAdminToken, createAdminClient } from './shopify-auth';

export type AdminMetafieldInput = {
  id: string;
  namespace: string;
  key: string;
  value: string;
  type?: string;
};

export type AdminProductVariant = {
  id: string;
  metafields?: Array<{
    id: string;
    namespace: string;
    key: string;
    value: string;
    type: string;
  }>;
};

export type AdminProduct = {
  id: string;
  productRecommendations?: Array<{
    id: string;
    handle: string;
    title: string;
    featuredImage?: { url: string };
    priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  }>;
};

export class ShopifyAdminClient {
  private client: ReturnType<typeof createAdminClient> = {
    request: async () => {
      throw new Error('Admin client not initialized.');
    },
  };

  private async ensureClient() {
    const token = await getShopifyAdminToken();
    this.client = createAdminClient(token);
  }

  async updateVariantMetafields(variantId: string, metafields: AdminMetafieldInput[]) {
    await this.ensureClient();

    const mutation = `#graphql
      mutation UpdateVariantMetafields($input: [MetafieldInput!]!, $id: ID!) {
        productVariantUpdate(input: { id: $id, metafields: $input }) {
          productVariant {
            id
            metafields(first: 20) {
              nodes {
                id
                namespace
                key
                value
                type
              }
            }
          }
          userErrors {
            message
          }
        }
      }
    `;

    const result = await this.client.request<{
      productVariantUpdate: {
        productVariant: AdminProductVariant;
        userErrors: Array<{ message?: string }>;
      };
    }>(mutation, {
      id: variantId,
      input: metafields.map((m) => ({
        namespace: m.namespace,
        key: m.key,
        value: m.value,
        type: m.type || 'single_line_text_field',
      })),
    });

    const errors = result.productVariantUpdate.userErrors.filter((e) => e.message);
    if (errors.length) {
      throw new Error(errors.map((e) => e.message).join(', '));
    }

    return result.productVariantUpdate.productVariant;
  }

  async setVariantModelMetafields(variantId: string, glbSrc: string, usdzSrc: string) {
    const metafields = [
      { id: variantId, namespace: 'custom', key: 'glbSrc', value: glbSrc, type: 'url' },
      { id: variantId, namespace: 'custom', key: 'usdzSrc', value: usdzSrc, type: 'url' },
    ];

    return this.updateVariantMetafields(variantId, metafields);
  }

  async fetchProductRecommendations(productId: string, first = 4) {
    await this.ensureClient();

    const query = `#graphql
      query ProductRecommendations($id: ID!, $first: Int!) {
        productRecommendations(productId: $id, first: $first) {
          id
          handle
          title
          featuredImage {
            url
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

    const result = await this.client.request<{
      productRecommendations: AdminProduct['productRecommendations'];
    }>(query, { id: productId, first });

    return result.productRecommendations ?? [];
  }
}
