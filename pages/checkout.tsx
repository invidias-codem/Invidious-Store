import { useCart } from '@/components/CartProvider';
import { GothicButton } from '@/components/UI';

export default function CheckoutPage() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl sm:text-4xl">Checkout</h1>
      <p className="mt-3 text-sm text-gray-500">Secure checkout is not active yet. Use this view to validate cart flow.</p>

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
            <GothicButton label="Place order" onClick={clearCart} />
            <GothicButton label="Return to archive" href="/products" variant="ghost" />
          </div>
        </div>
      )}
    </div>
  );
}
