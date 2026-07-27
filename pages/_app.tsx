// @ts-ignore
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Link from 'next/link';

import { CartProvider } from '@/components/CartProvider';
import { CartIsland } from '@/components/CartIsland';
import { InvidiousLogo } from '@/components/UI';
import { GothicButton } from '@/components/UI';

function CartButton() {
  return (
    <GothicButton label="Cart" href="/checkout" color="iron" size="sm" />
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
            <nav className="hidden gap-6 md:flex">
              <GothicButton label="Archive" href="/products" color="iron" size="sm" />
              <GothicButton label="Manifesto" href="/manifesto" color="oxide" size="sm" />
              <GothicButton label="Forge" href="/forge" color="iron" size="sm" />
              <GothicButton label="Contact" href="/contact" color="coal" size="sm" />
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

      <CartIsland />
    </CartProvider>
  );
}
