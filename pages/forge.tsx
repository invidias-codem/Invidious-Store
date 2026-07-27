import { useState, useEffect } from 'react';
import { ArtifactViewer } from '@/components/ArtifactViewer';
import { GothicButton } from '@/components/UI';
import { mockForgeArtifacts, type ForgeArtifact } from '@/utils/forgeData';

type VoteState = Record<string, { votes: number; voted: boolean }>;

export default function ForgePage() {
  const [votes, setVotes] = useState<VoteState>({});

  useEffect(() => {
    const state: VoteState = {};
    mockForgeArtifacts.forEach((artifact) => {
      state[artifact.id] = { votes: 0, voted: false };
    });
    setVotes(state);
  }, []);

  const voteFor = async (artifactId: string) => {
    setVotes((prev) => {
      const current = prev[artifactId];
      if (!current || current.voted) return prev;
      return { ...prev, [artifactId]: { ...current, voted: true } };
    });

    try {
      const response = await fetch('/api/forge/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artifactId }),
      });
      const data = (await response.json()) as { success: boolean; votes?: number; error?: string };
      if (response.ok && data.success && typeof data.votes === 'number') {
        setVotes((prev) => ({
          ...prev,
          [artifactId]: { votes: data.votes ?? prev[artifactId]?.votes ?? 0, voted: true },
        }));
      } else {
        console.warn(data.error || 'Vote failed');
      }
    } catch {
      console.warn('Vote request failed');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="mb-12">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gray-500">Incubator</p>
        <h1 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">The Forge</h1>
        <p className="mt-4 text-sm text-gray-400 max-w-2xl">
          Review digital prototypes. If enough syndicate members vote to forge an artifact, it crosses the manufacturing threshold and enters the archive.
        </p>
      </div>

      <div className="space-y-16">
        {mockForgeArtifacts.map((artifact) => {
          const current = votes[artifact.id] ?? { votes: 0, voted: false };
          return (
            <div key={artifact.id} className="grid grid-cols-1 gap-10 lg:grid-cols-2">
              <div>
                <ArtifactViewer
                  glbSrc={artifact.glbUrl ?? undefined}
                  usdzSrc={artifact.usdzUrl ?? undefined}
                  posterSrc={artifact.images[0]?.url}
                  altText={artifact.title}
                />
                <p className="mt-2 text-[10px] font-mono uppercase tracking-widest text-gray-500">ID: {artifact.id}</p>
              </div>
              <div className="flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-2xl tracking-wide">{artifact.title}</h2>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
                      {artifact.voteThreshold} vote threshold
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-400">{artifact.description}</p>
                  <div className="border border-invidious-border bg-invidious-bg p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Current votes</span>
                      <span className="font-display">{current.votes}</span>
                    </div>
                    <div className="mt-2 h-1 w-full bg-zinc-800">
                      <div
                        className="h-1 bg-white transition-all"
                        style={{ width: `${Math.min((current.votes / artifact.voteThreshold) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
                <GothicButton
                  label={current.voted ? 'Vote Recorded' : 'Back This Artifact'}
                  onClick={() => voteFor(artifact.id)}
                  variant={current.voted ? 'ghost' : 'filled'}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
