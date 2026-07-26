import { useState } from 'react';
import { useRouter } from 'next/router';
import { GothicButton } from '@/components/UI';

type UnlockResponse = {
  success?: boolean;
  error?: string;
  redirectTo?: string;
};

export default function VaultGate() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const redirectTo = typeof router.query.next === 'string' ? router.query.next : '/';

  const handleUnlock = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const response = await fetch('/api/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessCode: code }),
    });

    const result = (await response.json()) as UnlockResponse;

    if (response.ok && result.success) {
      router.push(result.redirectTo || redirectTo || '/');
    } else {
      setError(result.error || 'ACCESS DENIED');
      setCode('');
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-gray-300 flex flex-col items-center justify-center font-mono selection:bg-gray-700">
      <div className="max-w-md w-full px-6 space-y-8">
        <div className="text-center space-y-2">
          <p className="text-[10px] tracking-[0.4em] uppercase text-gray-500">Syndicate Access Required</p>
          <h1 className="text-2xl font-bold tracking-widest uppercase text-white break-words">Invidious Vault</h1>
          <p className="text-xs text-gray-500">Enter a valid drop token to unlock the archive edge.</p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4" autoComplete="off">
          <div>
            <input
              type="password"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-center text-white tracking-widest uppercase focus:outline-none focus:border-gray-500 transition-colors"
              placeholder="ENTER TOKEN"
              inputMode="text"
              autoComplete="off"
            />
          </div>

          {error ? (
            <p className="text-xs text-red-500 tracking-widest text-center break-words">[{error}]</p>
          ) : null}

          <GothicButton label="Authenticate" type="submit" />
          <p className="text-[10px] text-gray-600 text-center tracking-widest uppercase">Dev token: PROTO-100</p>
        </form>
      </div>
    </div>
  );
}
