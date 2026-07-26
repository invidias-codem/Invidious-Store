import { ArtifactViewer } from '@/components/ArtifactViewer';
import { ForgeVoting } from '@/components/ForgeVoting';
import { mockForgeArtifacts } from '@/utils/forgeData';

export default function ForgePage() {
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
        {mockForgeArtifacts.map((artifact) => (
          <div key={artifact.id} className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <ArtifactViewer
                glbSrc={artifact.modelUrl}
                usdzSrc={artifact.modelUrl ? artifact.modelUrl.replace('.glb', '.usdz') : ''}
                altText={artifact.title}
                fallbackImage={artifact.images[0]}
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
              </div>
              <ForgeVoting artifactId={artifact.id} voteThreshold={artifact.voteThreshold} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
