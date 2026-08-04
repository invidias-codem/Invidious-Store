import { kv } from '@vercel/kv';

export type LedgerStatus = 'MESH_PENDING' | 'FORGED';

export type LedgerEntry = {
  votes: number;
  votedSessionCount: number;
  threshold: number;
  status: LedgerStatus;
  lastUpdatedAt?: string;
} & Record<string, unknown>;

const LEDGER_HASH_KEY = 'forge:ledger_hash';
const VOTE_COUNT_KEY_PREFIX = 'forge:votes:';
const FORGED_SET_KEY = 'forge:forged_artifacts';
const NOTIFY_SET_KEY = 'forge:notified';

type DevMemory = {
  ledgers: Map<string, LedgerEntry>;
  forged: Set<string>;
};

declare global {
  // eslint-disable-next-line no-var
  var __forgeDevMemory: DevMemory | undefined;
}

function ensureDevMemory(): DevMemory | null {
  if (process.env.NODE_ENV === 'production' || process.env.KV_REST_API_URL || process.env.KV_URL) {
    return null;
  }
  if (!globalThis.__forgeDevMemory) {
    globalThis.__forgeDevMemory = {
      ledgers: new Map<string, LedgerEntry>(),
      forged: new Set<string>(),
    };
  }
  return globalThis.__forgeDevMemory;
}

export function artifactLedgerKey(artifactId: string): string {
  return `forge:ledger:${artifactId}`;
}

export function getDevForgedIds(): string[] {
  const memory = ensureDevMemory();
  return memory ? Array.from(memory.forged) : [];
}

export async function getProdForgedIds(): Promise<string[]> {
  try {
    const ids = await kv.smembers(FORGED_SET_KEY);
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

export async function getForgedIds(): Promise<string[]> {
  const memory = ensureDevMemory();
  return memory ? getDevForgedIds() : getProdForgedIds();
}

export function getDevLedgerMemory() {
  return ensureDevMemory();
}

export function setDevForged(artifactId: string, status: LedgerStatus = 'FORGED') {
  const memory = ensureDevMemory();
  if (!memory) return;
  memory.forged.add(artifactId);
  memory.ledgers.set(artifactId, {
    votes: 25,
    votedSessionCount: 1,
    threshold: 25,
    status,
    lastUpdatedAt: new Date().toISOString(),
  });
}

export async function setForged(artifactId: string, status: LedgerStatus = 'FORGED') {
  const memory = ensureDevMemory();
  if (memory) {
    setDevForged(artifactId, status);
    return;
  }

  const pipeline = kv.pipeline();
  pipeline.sadd(FORGED_SET_KEY, artifactId);
  pipeline.set(`${NOTIFY_SET_KEY}:${artifactId}`, true);
  await pipeline.exec();
}

export async function isNotified(artifactId: string): Promise<boolean> {
  const memory = ensureDevMemory();
  if (memory) {
    return memory.forged.has(artifactId);
  }

  try {
    const flag = await kv.get<boolean>(`${NOTIFY_SET_KEY}:${artifactId}`);
    return flag === true;
  } catch {
    return false;
  }
}

export async function writeLedger(artifactId: string, entry: LedgerEntry) {
  const memory = ensureDevMemory();
  if (memory) {
    memory.ledgers.set(artifactId, entry);
    memory.forged.add(artifactId);
    return;
  }

  await kv.set(artifactLedgerKey(artifactId), entry);
  await kv.set(`${VOTE_COUNT_KEY_PREFIX}${artifactId}`, entry.votes);
}

export async function rehydrateLedger() {
  const memory = ensureDevMemory();
  if (memory) {
    return;
  }

  const voteCountKeys = (await kv.keys(`${VOTE_COUNT_KEY_PREFIX}*`)) ?? [];
  const notifyKeys = (await kv.keys(`${NOTIFY_SET_KEY}:*`)) ?? [];
  if (!voteCountKeys.length && !notifyKeys.length) {
    return;
  }

  const entries: LedgerEntry[] = [];
  const pipeline = kv.pipeline();
  for (const key of voteCountKeys) {
    const id = key.replace(VOTE_COUNT_KEY_PREFIX, '');
    pipeline.get<LedgerEntry>(artifactLedgerKey(id));
    pipeline.get<number>(`${VOTE_COUNT_KEY_PREFIX}${id}`);
  }

  const results = await pipeline.exec();
  for (let i = 0; i < voteCountKeys.length; i++) {
    const id = voteCountKeys[i].replace(VOTE_COUNT_KEY_PREFIX, '');
    const [ledger, votes] = [results[i * 2], results[i * 2 + 1]] as [LedgerEntry | null, number | null];
    const safeVotes = votes ?? 0;
    const threshold = 25;
    const status: LedgerStatus = safeVotes >= threshold ? 'FORGED' : 'MESH_PENDING';
    const entry: LedgerEntry = {
      votes: safeVotes,
      votedSessionCount: 0,
      threshold,
      status,
      lastUpdatedAt: ledger?.lastUpdatedAt,
    };
    entries.push(entry);
  }

  if (entries.length) {
    await kv.set(LEDGER_HASH_KEY, String(Date.now()));
  }
}

export async function readLedger(artifactId: string): Promise<LedgerEntry | null> {
  const memory = ensureDevMemory();
  if (memory) {
    return memory.ledgers.get(artifactId) ?? null;
  }

  try {
    return (await kv.get<LedgerEntry>(artifactLedgerKey(artifactId))) ?? null;
  } catch {
    return null;
  }
}

export async function singleArtifactState(artifactId: string) {
  const memory = ensureDevMemory();
  if (memory) {
    const entry = memory.ledgers.get(artifactId) ?? null;
    return { ledger: entry, votes: entry?.votes ?? 0 };
  }

  const [ledger, votes] = await Promise.all([
    kv.get<LedgerEntry>(artifactLedgerKey(artifactId)),
    kv.get<number>(`${VOTE_COUNT_KEY_PREFIX}${artifactId}`),
  ]);

  return { ledger, votes: votes ?? 0 };
}

export async function forgeStateMatrix() {
  const memory = ensureDevMemory();
  if (memory) {
    const items: Array<{ artifactId: string; votes: number; ledger: LedgerEntry | null }> = [];
    for (const [key, entry] of memory.ledgers.entries()) {
      items.push({ artifactId: key, votes: entry.votes, ledger: entry });
    }

    return {
      items,
      persistedHash: String(items.length),
      forgedArtifactIds: getDevForgedIds(),
    };
  }

  const countKeys = (await kv.keys(`${VOTE_COUNT_KEY_PREFIX}*`)) ?? [];
  const items: Array<{ artifactId: string; votes: number; ledger: LedgerEntry | null }> = [];
  const pipeline = kv.pipeline();
  for (const key of countKeys) {
    const id = key.replace(VOTE_COUNT_KEY_PREFIX, '');
    pipeline.get<LedgerEntry>(artifactLedgerKey(id));
    pipeline.get<number>(`${VOTE_COUNT_KEY_PREFIX}${id}`);
  }
  const results = await pipeline.exec();
  for (let i = 0; i < countKeys.length; i++) {
    const id = countKeys[i].replace(VOTE_COUNT_KEY_PREFIX, '');
    const [ledger, votes] = [results[i * 2], results[i * 2 + 1]] as [LedgerEntry | null, number | null];
    items.push({ artifactId: id, votes: votes ?? 0, ledger });
  }

  const persistedHash = (await kv.get<string>(LEDGER_HASH_KEY)) ?? null;
  const forgedArtifactIds = (await kv.smembers(FORGED_SET_KEY)) ?? [];
  return { items, persistedHash, forgedArtifactIds };
}

export async function getLedger(artifactId: string) {
  return readLedger(artifactId);
}
