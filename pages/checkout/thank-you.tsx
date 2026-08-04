import { GothicButton } from '@/components/UI';
import { InvidiousLogo } from '@/components/UI';
import Link from 'next/link';

export default function CheckoutThankYouPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <InvidiousLogo className="mb-6 text-lg tracking-[0.25em]" />

        <div className="rounded-2xl border border-invidious-border bg-[#0a0a0a] p-8 shadow-2xl shadow-black/60">
          <div className="mx-auto mb-6 h-px w-24 bg-gradient-to-r from-transparent via-invidious-accent to-transparent" />

          <h1 className="font-display text-3xl sm:text-4xl tracking-wide text-white">
            Transaction Submitted
          </h1>

          <p className="mt-4 text-sm text-gray-400">
            Your order has been passed to Shopify for processing. If you were redirected back here,
            your purchase is complete or still awaiting confirmation.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <GothicButton label="Return to archive" href="/products" color="iron" />
            <Link
              href="/"
              className="rounded-xl border border-invidious-border px-4 py-2 text-[11px] tracking-[0.18em] uppercase text-gray-300 hover:border-gray-500 hover:text-white"
            >
              Back to Invidious
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
