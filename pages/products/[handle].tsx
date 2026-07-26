import { fetchProductByHandle } from '@/lib/shopify';
import PDPGallery from '@/components/PDPGallery';
import { GothicButton } from '@/components/UI';
import { useCart } from '@/components/CartProvider';
import { AuthGate } from '@/components/AuthGate';

type Product = {
  handle: string;
  title: string;
  description: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  featuredImage?: { url: string; altText?: string };
  images?: { nodes: { url: string; altText?: string }[] };
};

type ProductPageProps = {
  product: Product | null;
};

function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans px-4 py-12 md:px-12">
      <div className="mx-auto max-w-7xl grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-7">
          <PDPGallery
            images={(product.images?.nodes ?? []).map((node) => ({
              url: node.url,
              altText: node.altText ?? product.title,
            }))}
            title={product.title}
          />
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="border-b border-zinc-800 pb-6 space-y-2">
            <h1 className="text-2xl font-bold uppercase tracking-widest text-white">{product.title}</h1>
            <p className="font-mono text-sm text-gray-400">
              ${product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
            </p>
          </div>

          <p className="text-xs font-mono leading-relaxed text-gray-400 uppercase tracking-wider">
            {product.description}
          </p>

          <div className="space-y-3">
            <div className="border border-invidious-border bg-invidious-bg p-4">
              <p className="text-xs text-gray-500">Live inventory view is inactive without Shopify credentials.</p>
            </div>
            <GothicButton
              label="Add to cart"
              onClick={() =>
                addItem({
                  id: product.handle,
                  title: product.title,
                  price: parseFloat(product.priceRange.minVariantPrice.amount),
                  currency: product.priceRange.minVariantPrice.currencyCode,
                })
              }
            />
            <GothicButton label="Return to archive" href="/products" variant="outline" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductPage({ product }: ProductPageProps) {
  if (!product) {
    return (
      <div className="min-h-screen bg-black text-gray-400 flex items-center justify-center font-mono text-xs uppercase tracking-widest">
        [Artifact Not Found in Archive]
      </div>
    );
  }

  return (
    <AuthGate>
      <ProductDetail product={product} />
    </AuthGate>
  );
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ params }: { params: { handle: string } }) {
  const handle = Array.isArray(params?.handle) ? params.handle[0] : params?.handle;
  const product = await fetchProductByHandle(handle ?? '');
  return {
    props: {
      product,
    },
    revalidate: 60,
  };
}
