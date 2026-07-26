// @ts-ignore
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Link from 'next/link';

import { CartProvider } from '@/components/CartProvider';
import { CartIsland } from '@/components/CartIsland';
import { InvidiousLogo } from '@/components/UI';

function CartButton() {
  return (
    <Link
      href="/checkout"
      className="hidden sm:inline-flex border border-invidious-border bg-invidious-bg px-3 py-1.5 text-xs tracking-wide hover:text-white transition-colors"
    >
      Cart
    </Link>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 border-b border-invidious-border bg-[#0a0a0a]/90 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
            <Link href="/" aria-label="Invidious Home">
              <InvidiousLogo />
            </Link>
            <nav className="hidden gap-8 text-[11px] tracking-[0.2em] uppercase text-gray-400 md:flex">
              <Link href="/products" className="hover:text-white transition-colors">Archive</Link>
              <Link href="/manifesto" className="hover:text-white transition-colors">Manifesto</Link>
              <Link href="/forge" className="hover:text-white transition-colors">Forge</Link>
              {/* Replaced '#' with a designated route */}
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </nav>
            <CartButton />
          </div>
        </header>
        
        <main className="flex-1">
          <Component {...pageProps} />
        </main>
        
        <footer className="border-t border-invidious-border py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col gap-2 text-[11px] tracking-[0.15em] uppercase text-gray-500 md:flex-row md:items-center md:justify-between">
              <p>© Invidious. All rights reserved.</p>
              <p>Physical ownership and offline sovereignty.</p>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Global Cart UI injected outside the main flow */}
      <CartIsland />
    </CartProvider>
  );
}