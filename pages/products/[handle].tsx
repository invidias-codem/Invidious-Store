import { fetchProductByHandle } from '@/lib/shopify';
import { useState } from 'react';
import PDPGallery from '@/components/PDPGallery';
import { GothicButton } from '@/components/UI';
import { useCart } from '@/components/CartProvider';

type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
  selectedOptions?: { name: string; value: string }[];
  sku?: string;
};

type Product = {
  handle: string;
  title: string;
  description: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  featuredImage?: { url: string; altText?: string };
  images?: { nodes: { url: string; altText?: string }[] };
  variants?: { nodes: ProductVariant[] };
  metafields?: { key: string; value: string }[];
};

type ProductPageProps = {
  product: Product | null;
};

function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const images = (product.images?.nodes ?? []).map((node) => ({
    url: node.url,
    altText: node.altText ?? product.title,
  }));
  const variants = product.variants?.nodes ?? [];
  const [selectedVariantId, setSelectedVariantId] = useState<string>(variants[0]?.id ?? '');
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? variants[0];
  const sizeFromTitle = (title?: string) => title?.split('/')[0]?.trim();
  const colorFromTitle = (title?: string) => title?.split('/')[1]?.trim();
  const sizeGuideRaw = product.metafields?.find((m) => m.key === 'size_guide')?.value;

  let sizeGuide: Record<string, number | string> | null = null;
  try {
    sizeGuide = sizeGuideRaw ? JSON.parse(sizeGuideRaw) : null;
  } catch {
    sizeGuide = null;
  }

  const price = selectedVariant?.price ?? product.priceRange.minVariantPrice;

  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans px-4 py-12 md:px-12">
      <div className="mx-auto max-w-7xl grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-7">
          <PDPGallery images={images} title={product.title} />
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="border-b border-zinc-800 pb-6 space-y-2">
            <h1 className="font-gothic-ui text-2xl text-white uppercase tracking-[0.18em]">{product.title}</h1>
            <p className="font-mono text-sm text-gray-400">
              ${price.amount} {price.currencyCode}
            </p>
          </div>

          <p className="text-xs font-mono leading-relaxed text-gray-400 uppercase tracking-wider">
            {product.description}
          </p>

          <div className="space-y-3">
            {variants.length > 0 && (
              <div className="space-y-2">
                <p className="font-gothic-ui text-[11px] uppercase tracking-[0.18em] text-gray-500">Select</p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => {
                    const size = sizeFromTitle(variant.title);
                    const color = colorFromTitle(variant.title);
                    const selected = variant.id === selectedVariantId;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        disabled={!variant.availableForSale}
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`border px-3 py-2 text-[11px] font-mono uppercase tracking-widest transition-colors ${
                          selected ? 'border-white text-white' : 'border-zinc-700 text-gray-300 hover:border-gray-400'
                        } ${!variant.availableForSale ? 'opacity-40 cursor-not-allowed line-through' : ''}`}
                      >
                        {color ? `${size} · ${color}` : size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <GothicButton
                label={selectedVariant?.availableForSale !== false ? 'Add to cart' : 'Sold out'}
                onClick={() =>
                  selectedVariant &&
                  selectedVariant.availableForSale !== false &&
                  addItem({
                    id: selectedVariant.id,
                    title: `${product.title} - ${selectedVariant.title}`,
                    price: parseFloat(selectedVariant.price.amount),
                    currency: selectedVariant.price.currencyCode,
                    variantId: selectedVariant.id,
                  })
                }
                disabled={selectedVariant?.availableForSale === false}
              />
              <button
                type="button"
                onClick={() => setShowSizeGuide((v) => !v)}
                className="font-gothic-ui text-[11px] uppercase tracking-[0.18em] text-gray-500 hover:text-white underline underline-offset-4"
              >
                {showSizeGuide ? 'Hide Size Guide' : 'True to Size'}
              </button>
            </div>

            {showSizeGuide && sizeGuide && (
              <div className="border border-zinc-800 bg-zinc-900 p-4 space-y-2">
                <p className="text-xs font-mono text-gray-300 uppercase tracking-widest">Size Guide</p>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-gray-400">
                  {sizeGuide.chest != null && <div>Chest: {sizeGuide.chest}cm</div>}
                  {sizeGuide.length != null && <div>Length: {sizeGuide.length}cm</div>}
                  {sizeGuide.sleeve != null && <div>Sleeve: {sizeGuide.sleeve}cm</div>}
                  {sizeGuide.shoulder != null && <div>Shoulder: {sizeGuide.shoulder}cm</div>}
                </div>
                {sizeGuide.fitNote && <p className="text-[11px] font-mono text-gray-400 italic">{sizeGuide.fitNote}</p>}
              </div>
            )}

            <GothicButton label="Return to archive" href="/products" variant="ghost" />
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
    <ProductDetail product={product} />
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
