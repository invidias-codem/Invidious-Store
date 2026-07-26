import { fetchProducts } from '@/lib/shopify';
import { ProductCard } from '@/components/ProductCard';

export const revalidate = 60;

type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage?: { url: string };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images?: { url: string; altText?: string }[];
  inventory?: number;
};

type ProductsPageProps = {
  products: Product[];
};

export default function ProductsPage({ products }: ProductsPageProps) {
  return (
    <div className="min-h-screen border-b border-invidious-border mt-14">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-500">Archive</p>
            <h1 className="font-display text-3xl tracking-tight sm:text-4xl">All Drops</h1>
          </div>
          <p className="text-sm text-gray-500">Static archive refreshed every 60 seconds.</p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.handle} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="mt-10 text-sm text-gray-500">No drops are available right now.</div>
        )}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const products = await fetchProducts();

  return {
    props: {
      products,
    },
    revalidate: 60,
  };
}
