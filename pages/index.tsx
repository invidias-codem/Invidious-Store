import { GothicButton, InvidiousLogo } from '@/components/UI';

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="max-w-3xl">
        <p className="text-[10px] tracking-widest uppercase text-gray-500">
          Gothic industrial luxury. Restricted drops.
        </p>
        <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl md:text-7xl">
          Invidious
        </h1>
        <p className="mt-6 text-sm text-gray-400 sm:text-base">
          Engineered for longevity, offline ownership, and controlled distribution.
          Clothing first. Retro sovereignty as side channel.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <GothicButton label="View the archive" href="/products" />
          <GothicButton label="Read the manifesto" href="/manifesto" variant="outline" />
          <GothicButton label="Enter the forge" href="/forge" variant="outline" />
        </div>
      </div>

      <div className="mt-16 border-t border-invidious-border pt-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-500">Primary Channel</p>
            <h2 className="mt-2 font-display text-2xl tracking-wide sm:text-3xl">Garments</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              Exposed seams, sharp edges, finite batches. Each piece is engineered for longevity
              and distributed through a restricted drop model.
            </p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-500">Side Cart</p>
            <h2 className="mt-2 font-display text-2xl tracking-wide sm:text-3xl">Retro Sovereignty</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              Offline retro games and physical media are catalogued beside the clothing line as sovereign artifacts.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
