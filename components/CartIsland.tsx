'use client';

import { useState, useEffect } from 'react';
import { useCart } from './CartProvider';
import { GothicButton } from '@/components/UI';
import { VaultGateModal } from '@/components/VaultGateModal';

export function CartIsland() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCart();
  const [showVaultGate, setShowVaultGate] = useState(false);
  const [vaultGateAction, setVaultGateAction] = useState<'checkout' | 'add'>('checkout');
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setHasAccess(document.cookie.includes('invidious_vault_access='));
  }, []);

  const handleCheckoutClick = () => {
    if (!hasAccess) {
      setVaultGateAction('checkout');
      setShowVaultGate(true);
      return;
    }
    window.location.href = '/checkout';
  };

  const handleAddToCart = () => {
    if (!hasAccess) {
      setVaultGateAction('add');
      setShowVaultGate(true);
      return;
    }
    setIsOpen(true);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm border-l border-invidious-border bg-invidious-bg p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg tracking-wide">Your Cart</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
                Close
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {items.length === 0 && (
                <p className="text-sm text-gray-500">Your cart is empty.</p>
              )}
              {items.map((item) => (
                <div key={item.id} className="flex flex-col gap-2 border border-invidious-border p-3">
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
              <div className="mt-6 border-t border-invidious-border pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Total</span>
                  <span className="font-display">{totalPrice.toFixed(2)}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <GothicButton label="Checkout" onClick={handleCheckoutClick} />
                  <GothicButton variant="ghost" label="Clear" onClick={clearCart} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showVaultGate && (
        <VaultGateModal
          action={vaultGateAction}
          onClose={() => setShowVaultGate(false)}
          onUnlocked={() => {
            setHasAccess(true);
            setShowVaultGate(false);
            if (vaultGateAction === 'checkout') {
              window.location.href = '/checkout';
            }
            setIsOpen(true);
          }}
        />
      )}
    </>
  );
}
