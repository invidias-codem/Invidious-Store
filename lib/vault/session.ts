import { kv } from '@vercel/kv';

function randomId() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function createVaultSession({ code, destination, channel, next }: { code: string; destination: string; channel: 'email' | 'phone'; next: string }) {
  const sessionId = randomId();
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  await kv.set(`vault:session:${sessionId}`, {
    code,
    destination,
    channel,
    next,
    createdAt: new Date().toISOString(),
    expiresAt,
    used: false,
  });

  return { sessionId, expiresAt };
}

export async function consumeVaultSession(sessionId: string, code: string) {
  const key = `vault:session:${sessionId}`;
  const session = (await kv.get<Record<string, any>>(key)) ?? null;

  if (!session) {
    return { ok: false, error: 'Session not found' } as const;
  }

  if (session.used) {
    return { ok: false, error: 'Session already used' } as const;
  }

  if (new Date(session.expiresAt).getTime() < Date.now()) {
    return { ok: false, error: 'Session expired' } as const;
  }

  if (session.code !== code) {
    return { ok: false, error: 'Invalid code for this session' } as const;
  }

  await kv.set(key, { ...session, used: true });

  return { ok: true, next: typeof session.next === 'string' ? session.next : '/', destination: session.destination } as const;
}
