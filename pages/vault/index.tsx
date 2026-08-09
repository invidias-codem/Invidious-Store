import { useState } from 'react';
import { useRouter } from 'next/router';
import { GothicButton } from '@/components/UI';

type UnlockResponse = {
  success?: boolean;
  error?: string;
  redirectTo?: string;
};

type RequestResponse = {
  ok?: boolean;
  error?: string;
  status?: string;
  magicLink?: string;
  next?: string;
  destination?: string;
};

export default function VaultGate() {
  const router = useRouter();
  const redirectTo = typeof router.query.next === 'string' ? router.query.next : '/';
  const mode = typeof router.query.mode === 'string' ? router.query.mode : 'token';

  const [accessCode, setAccessCode] = useState('');
  const [accessError, setAccessError] = useState('');

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [requestError, setRequestError] = useState('');
  const [requestStatus, setRequestStatus] = useState('');

  const handleUnlock = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAccessError('');

    const response = await fetch('/api/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessCode }),
    });

    const result = (await response.json()) as UnlockResponse;

    if (response.ok && result.success) {
      router.push(result.redirectTo || redirectTo || '/');
    } else {
      setAccessError(result.error || 'ACCESS DENIED');
      setAccessCode('');
    }
  };

  const handleRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRequestError('');
    setRequestStatus('');

    const response = await fetch('/api/vault/request-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email || undefined, phone: phone || undefined, next: redirectTo }),
    });

    const result = (await response.json()) as RequestResponse;

    if (response.ok && result.ok) {
      setRequestStatus(`Access link generated for ${result.destination}. Check your inbox or messages.`);
      setEmail('');
      setPhone('');
    } else {
      setRequestError(result.error || 'Failed to generate access link.');
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-gray-300 flex flex-col items-center justify-center font-mono selection:bg-gray-700">
      <div className="max-w-md w-full px-6 space-y-8">
        <div className="text-center space-y-2">
          <p className="text-[10px] tracking-[0.4em] uppercase text-gray-500">Syndicate Access Required</p>
          <h1 className="text-2xl font-bold tracking-widest uppercase text-white break-words">Invidious Vault</h1>
          <p className="text-xs text-gray-500">Authenticate to access the archive edge.</p>
        </div>

        {mode === 'token' ? (
          <form onSubmit={handleUnlock} className="space-y-4" autoComplete="off">
            <div>
              <input
                type="password"
                value={accessCode}
                onChange={(event) => setAccessCode(event.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-center text-white tracking-widest uppercase focus:outline-none focus:border-gray-500 transition-colors"
                placeholder="ENTER TOKEN"
                inputMode="text"
                autoComplete="off"
              />
            </div>

            {accessError ? (
              <p className="text-xs text-red-500 tracking-widest text-center break-words">[{accessError}]</p>
            ) : null}

            <GothicButton label="Authenticate" type="submit" />
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push({ pathname: '/vault', query: { next: redirectTo, mode: 'request' } })}
                className="text-[10px] tracking-[0.18em] uppercase text-gray-500 hover:text-white underline underline-offset-4"
              >
                Need access? Request token
              </button>
            </div>
            <p className="text-[10px] text-gray-600 text-center tracking-widest uppercase">Dev token: PROTO-100</p>
          </form>
        ) : (
          <form onSubmit={handleRequest} className="space-y-4" autoComplete="off">
            <div className="space-y-2">
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
                  <span className="bg-black px-2 text-gray-600 uppercase tracking-widest">or</span>
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
            </div>

            {requestError ? (
              <p className="text-xs text-red-500 tracking-widest text-center break-words">[{requestError}]</p>
            ) : null}
            {requestStatus ? (
              <p className="text-xs text-gray-300 tracking-widest text-center break-words">[{requestStatus}]</p>
            ) : null}

            <GothicButton label="Request access link" type="submit" />
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push({ pathname: '/vault', query: { next: redirectTo, mode: 'token' } })}
                className="text-[10px] tracking-[0.18em] uppercase text-gray-500 hover:text-white underline underline-offset-4"
              >
                Have a token? Enter it
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
