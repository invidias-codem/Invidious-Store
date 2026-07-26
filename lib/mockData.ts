export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: { amount: string; currencyCode: string };
  images: { url: string; altText?: string }[];
  inventory: number;
};

export const mockProducts: Product[] = [
  {
    id: '1',
    handle: 'chrome-spun-hoodie',
    title: 'CHROME-SPUN HOODIE',
    description: '450 GSM Japanese loopwheel cotton. Exposed raw overlocking.',
    price: { amount: '120.00', currencyCode: 'USD' },
    images: [{ url: '/assets/placeholder-hoodie.jpg', altText: 'Chrome-Spun Hoodie Front' }],
    inventory: 14,
  },
  {
    id: '2',
    handle: 'sacred-rebar-jacket',
    title: 'SACRED REBAR JACKET',
    description: 'Vegetable-tanned calfskin with .925 silver daggers.',
    price: { amount: '850.00', currencyCode: 'USD' },
    images: [{ url: '/assets/placeholder-jacket.jpg', altText: 'Sacred Rebar Jacket' }],
    inventory: 3,
  },
];

export async function fetchProducts(): Promise<Product[]> {
  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return mockProducts;
  }
  // Future: real Shopify GraphQL fetch logic here
  return mockProducts;
}

export async function fetchProductByHandle(handle: string): Promise<Product | null> {
  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return mockProducts.find((p) => p.handle === handle) || null;
  }
  // Future: real Shopify fetch
  return null;
}
