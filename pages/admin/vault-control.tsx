import { useState, useEffect } from 'react';
import { RefreshCw, Plus, Key, Download, Copy, Check } from 'lucide-react';

interface TokenData {
  code: string;
  used: boolean;
  email: string;
}

export default function VaultControl() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/tokens');
      if (res.ok) {
        const data = (await res.json()) as TokenData[];
        setTokens(data);
      }
    } catch {
      // ignore fetch errors in admin view
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const generateTokens = async (count: number) => {
    const res = await fetch('/api/admin/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count }),
    });
    if (res.ok) fetchTokens();
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportCSV = () => {
    const headers = ['Token Code', 'Status', 'Assigned Email'];
    const csvContent = [
      headers.join(','),
      ...tokens.map((t) => `${t.code},${t.used ? 'Consumed' : 'Active'},${t.email}`),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `invidious_syndicate_tokens_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const unusedCount = tokens.filter((t) => !t.used).length;

  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono p-8">
      <header className="flex flex-col gap-4 border-b border-zinc-800 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-widest uppercase text-white">Vault Override</h1>
          <p className="text-xs text-gray-500 mt-2">Active Drop Matrix</p>
        </div>
        <div className="text-right">
          <p className="text-xl text-white">[{unusedCount}/{tokens.length}]</p>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Valid Tokens</p>
        </div>
      </header>

      <div className="flex flex-wrap gap-3 mt-6">
        <button
          onClick={() => generateTokens(10)}
          className="flex items-center gap-2 border border-gray-500 bg-black px-4 py-2 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
        >
          <Plus size={14} /> Generate [10] Keys
        </button>

        <button
          onClick={exportCSV}
          disabled={tokens.length === 0}
          className="flex items-center gap-2 border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs uppercase tracking-widest hover:text-white transition-colors disabled:opacity-50"
        >
          <Download size={14} /> Export Manifest
        </button>

        <button
          onClick={fetchTokens}
          className="flex items-center gap-2 border border-zinc-800 px-4 py-2 text-xs uppercase tracking-widest hover:text-white transition-colors ml-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tokens.map((token) => (
          <div
            key={token.code}
            className={`border p-4 flex justify-between items-center group transition-colors ${
              token.used ? 'border-zinc-900 bg-zinc-950 opacity-50' : 'border-zinc-700 bg-zinc-900 hover:border-gray-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <Key size={16} className={token.used ? 'text-zinc-700' : 'text-gray-400'} />
              <div>
                <p className={`text-sm font-bold tracking-widest ${token.used ? 'line-through text-zinc-600' : 'text-white'}`}>
                  {token.code}
                </p>
                <p className="text-[10px] text-gray-500 uppercase mt-1">{token.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!token.used && (
                <button
                  onClick={() => copyToClipboard(token.code)}
                  className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Copy to clipboard"
                >
                  {copiedId === token.code ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              )}
              <div
                className={`text-[10px] uppercase tracking-widest px-2 py-1 ${
                  token.used ? 'text-red-500 border border-red-900' : 'text-green-500 border border-green-900'
                }`}
              >
                {token.used ? 'Consumed' : 'Active'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
