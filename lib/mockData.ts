export type ProductVariant = {
  id: string;
  title: string;
  price: { amount: string; currencyCode: string };
  available: boolean;
  size?: string;
  color?: string;
  fit?: 'regular' | 'oversize' | 'slim';
  sku?: string;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: { amount: string; currencyCode: string };
  images: { url: string; altText?: string }[];
  inventory: number;
  variants: ProductVariant[];
  sizeGuide?: {
    chest?: number;
    length?: number;
    sleeve?: number;
    shoulder?: number;
    fitNote?: string;
  };
};

export const mockProducts: Product[] = [
  {
    id: '1',
    handle: 'chrome-spun-hoodie',
    title: 'CHROME-SPUN HOODIE',
    description: '450 GSM Japanese loopwheel cotton. Exposed raw overlocking. Heavy rib cuff and bonded neck tape.',
    price: { amount: '120.00', currencyCode: 'USD' },
    images: [
      { url: '/assets/placeholder-hoodie-1.jpg', altText: 'Hoodie front' },
      { url: '/assets/placeholder-hoodie-2.jpg', altText: 'Hoodie back' },
      { url: '/assets/placeholder-hoodie-detail.jpg', altText: 'Overlock detail' },
    ],
    inventory: 14,
    variants: [
      { id: '1-s-black', title: 'S / Black', price: { amount: '120.00', currencyCode: 'USD' }, available: true, size: 'S', color: 'Black', fit: 'regular', sku: 'CSH-BLK-S' },
      { id: '1-m-black', title: 'M / Black', price: { amount: '120.00', currencyCode: 'USD' }, available: true, size: 'M', color: 'Black', fit: 'regular', sku: 'CSH-BLK-M' },
      { id: '1-l-black', title: 'L / Black', price: { amount: '120.00', currencyCode: 'USD' }, available: true, size: 'L', color: 'Black', fit: 'regular', sku: 'CSH-BLK-L' },
      { id: '1-xl-black', title: 'XL / Black', price: { amount: '120.00', currencyCode: 'USD' }, available: false, size: 'XL', color: 'Black', fit: 'regular', sku: 'CSH-BLK-XL' },
      { id: '1-m-iron', title: 'M / Iron', price: { amount: '120.00', currencyCode: 'USD' }, available: true, size: 'M', color: 'Iron', fit: 'regular', sku: 'CSH-IRN-M' },
    ],
    sizeGuide: {
      chest: 56,
      length: 70,
      sleeve: 63,
      shoulder: 48,
      fitNote: 'Relaxed block. True to size. Size up for layering.',
    },
  },
  {
    id: '2',
    handle: 'sacred-rebar-jacket',
    title: 'SACRED REBAR JACKET',
    description: 'Vegetable-tanned calfskin with .925 silver split-pin closure. Made to order.',
    price: { amount: '850.00', currencyCode: 'USD' },
    images: [
      { url: '/assets/placeholder-jacket-1.jpg', altText: 'Jacket front' },
      { url: '/assets/placeholder-jacket-2.jpg', altText: 'Jacket back' },
      { url: '/assets/placeholder-jacket-detail.jpg', altText: 'Hardware detail' },
    ],
    inventory: 3,
    variants: [
      { id: '2-m-black', title: 'M / Black', price: { amount: '850.00', currencyCode: 'USD' }, available: true, size: 'M', color: 'Black', fit: 'slim', sku: 'SRJ-BLK-M' },
      { id: '2-l-black', title: 'L / Black', price: { amount: '850.00', currencyCode: 'USD' }, available: true, size: 'L', color: 'Black', fit: 'slim', sku: 'SRJ-BLK-L' },
      { id: '2-xl-black', title: 'XL / Black', price: { amount: '850.00', currencyCode: 'USD' }, available: false, size: 'XL', color: 'Black', fit: 'slim', sku: 'SRJ-BLK-XL' },
    ],
    sizeGuide: {
      chest: 52,
      length: 68,
      sleeve: 62,
      shoulder: 44,
      fitNote: 'Slim articulated cut. True to size.',
    },
  },
];

export async function fetchProducts(): Promise<Product[]> {
  if (!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return mockProducts;
  }
  return [];
}

export async function fetchProductByHandle(handle: string): Promise<Product | null> {
  if (!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return mockProducts.find((p) => p.handle === handle) || null;
  }
  return null;
}
