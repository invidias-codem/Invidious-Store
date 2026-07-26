'use client';

import Image from 'next/image';
import Link from 'next/link';
import { GothicButton } from '@/components/UI';
import { useCart } from '@/components/CartProvider';

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

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const primaryImage = product.images?.[0]?.url ?? product.featuredImage?.url;
  const amount = product.priceRange.minVariantPrice.amount;
  const currency = product.priceRange.minVariantPrice.currencyCode;
  
  // Trigger scarcity UI if inventory drops below the threshold
  const isScarce = product.inventory !== undefined && product.inventory > 0 && product.inventory < 5;

  const handleAdd = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: parseFloat(amount),
      currency,
    });
  };

  return (
    <div className="group relative border border-invidious-border bg-invidious-bg flex flex-col h-full">
      {/* Scarcity Indicator */}
      {isScarce && (
        <div className="absolute top-4 left-4 z-20 bg-black border border-gray-500 px-2 py-1 pointer-events-none shadow-lg">
          <span className="text-[10px] uppercase tracking-widest text-gray-300 font-mono">
            [{product.inventory} Remaining]
          </span>
        </div>
      )}

      {/* Image Link Area */}
      <Link href={`/products/${product.handle}`} className="block overflow-hidden relative aspect-[4/5] bg-zinc-900">
        
        {/* Subtle Industrial Grid Overlay */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-20 pointer-events-none z-10">
          <div className="border-r border-b border-gray-500"></div>
          <div className="border-b border-gray-500"></div>
          <div className="border-r border-gray-500"></div>
          <div></div>
        </div>

        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.images?.[0]?.altText || product.title}
            fill
            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0 mix-blend-luminosity hover:mix-blend-normal"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-zinc-700 text-sm tracking-widest uppercase font-mono">Visual Asset</span>
          </div>
        )}
      </Link>

      {/* Content & Action Area */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-4">
        {/* Title & Description Link */}
        <Link href={`/products/${product.handle}`} className="block group/text">
          <h3 className="text-sm font-semibold tracking-wide uppercase group-hover/text:text-gray-400 transition-colors">
            {product.title}
          </h3>
          <p className="mt-2 text-xs text-gray-500 line-clamp-2 font-mono uppercase tracking-wider">
            {product.description}
          </p>
        </Link>
        
        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800 mt-auto">
          <span className="text-sm font-mono text-gray-300 tracking-widest">
            {currency} {amount}
          </span>
          {/* Button is now safely separated from the routing links */}
          <GothicButton size="sm" label="Secure" onClick={handleAdd} />
        </div>
      </div>
    </div>
  );
}
