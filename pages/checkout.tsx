import { useCart } from '@/components/CartProvider';
import { GothicButton } from '@/components/UI';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function CheckoutPage() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleCheckout = async () => {
    if (isSubmitting || !items.length) return;
    setIsSubmitting(true);
    setError(null);
    setErrors([]);

    try {
      const returnUrl = typeof window !== 'undefined' ? `${window.location.origin}/checkout/thank-you` : undefined;
      const res = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            merchandiseId: item.variantId || item.id,
            quantity: item.quantity,
          })),
          returnUrl,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data?.error) {
        const message = data?.error || data?.details || 'Failed to initialize secure transaction.';
        setError(typeof message === 'string' ? message : JSON.stringify(message));
        setIsSubmitting(false);
        return;
      }

      if (data?.errors && Array.isArray(data.errors) && data.errors.length) {
        setErrors(data.errors.map((e: any) => e?.message || 'Checkout error'));
        setIsSubmitting(false);
        return;
      }

      const checkoutUrl = data?.checkoutUrl;
      if (!checkoutUrl || typeof checkoutUrl !== 'string') {
        setError('Missing checkout URL.');
        setIsSubmitting(false);
        return;
      }

      clearCart();
      window.location.href = checkoutUrl;
    } catch (err: any) {
      setError(err?.message || 'Unexpected checkout failure.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl sm:text-4xl">Checkout</h1>

      {(error || errors.length > 0) && (
        <div className="mt-6 space-y-2 rounded-2xl border border-red-500/20 bg-gradient-to-br from-background to-red-500/5 p-6">
          {error && <p className="text-sm text-red-500">{error}</p>}
          {errors.map((e, i) => (
            <p key={i} className="text-sm text-red-500">{e}</p>
          ))}
        </div>
      )}

      <div className="mt-8 space-y-3">
        {items.length === 0 && (
          <p className="text-sm text-gray-500">Your cart is empty.</p>
        )}
        {items.map((item) => (
          <div key={item.id} className="flex flex-col gap-2 border border-invidious-border p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm">{item.title}</p>
                <p className="text-xs text-gray-500">Unit: {(item.price).toFixed(2)} {item.currency}</p>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-[10px] tracking-widest uppercase text-gray-500 hover:text-white">
                Remove
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GothicButton size="sm" label="-" onClick={() => updateQuantity(item.id, item.quantity - 1)} />
                <span className="text-sm w-8 text-center">{item.quantity}</span>
                <GothicButton size="sm" label="+" onClick={() => updateQuantity(item.id, item.quantity + 1)} />
              </div>
              <span className="text-sm font-display">{(item.price * item.quantity).toFixed(2)} {item.currency}</span>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="mt-8 border-t border-invidious-border pt-6">
          <div className="flex items-center justify-between text-sm">
            <span>Total</span>
            <span className="font-display text-lg">{totalPrice.toFixed(2)}</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <GothicButton
              label={isSubmitting ? 'Redirecting…' : 'Place order'}
              onClick={handleCheckout}
              disabled={isSubmitting || items.length === 0}
            />
            <GothicButton label="Return to archive" href="/products" variant="ghost" />
          </div>
        </div>
      )}
    </div>
  );
}
