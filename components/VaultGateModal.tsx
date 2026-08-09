'use client';

import { useState, useEffect } from 'react';
import { GothicButton } from '@/components/UI';

type VaultGateModalProps = {
  action: 'checkout' | 'add';
  next?: string;
  onClose: () => void;
  onUnlocked: () => void;
};

export function VaultGateModal({ action, next = '/', onClose, onUnlocked }: VaultGateModalProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setStatus('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/vault/request-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email || undefined, phone: phone || undefined, next }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || 'Failed to request access.');
        setSubmitting(false);
        return;
      }

      setStatus(`Access link generated for ${data.destination}. Check your inbox or messages.`);
      setSubmitting(false);
    } catch (err: any) {
      setError(err?.message || 'Unexpected failure.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md border border-invidious-border bg-invidious-bg p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg tracking-wide text-white">Restricted Access</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white">Close</button>
          </div>

          <p className="mt-3 text-xs text-gray-400 uppercase tracking-widest">
            {action === 'checkout'
              ? 'A valid drop token is required to complete checkout.'
              : 'A valid drop token is required to add items to your cart.'}
          </p>

          <form onSubmit={handleRequest} className="mt-4 space-y-3">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-center text-white tracking-wide focus:outline-none focus:border-gray-500 transition-colors"
              placeholder="Email address"
              inputMode="email"
              autoComplete="email"
            />
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-invidious-bg px-2 text-gray-600 uppercase tracking-widest">or</span>
              </div>
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-center text-white tracking-wide focus:outline-none focus:border-gray-500 transition-colors"
              placeholder="Phone number"
              inputMode="tel"
              autoComplete="tel"
            />

            {error ? <p className="text-xs text-red-500 tracking-widest text-center break-words">[{error}]</p> : null}
            {status ? <p className="text-xs text-gray-300 tracking-widest text-center break-words">[{status}]</p> : null}

            <GothicButton label={submitting ? 'Requesting…' : 'Request access link'} type="submit" disabled={submitting} />
          </form>

          <p className="mt-3 text-[10px] text-gray-600 text-center tracking-widest uppercase">
            Already have a token? Use the vault gate to authenticate.
          </p>
        </div>
      </div>
    </div>
  );
}
