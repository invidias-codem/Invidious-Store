import Link from 'next/link';
import { AnimatedLogo } from '@/components/UI/AnimatedLogo';

export default function Manifesto() {
  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-gray-700 p-6 md:p-12">
      <nav className="border-b border-zinc-800 pb-6 mb-12 flex justify-between items-center max-w-5xl mx-auto">
        <Link href="/" className="text-xl font-bold tracking-widest uppercase text-white hover:text-gray-400 transition-colors">
          Invidious
        </Link>
        <Link href="/products" className="text-xs font-mono uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
          [ Return to Archive ]
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto pb-24">
        <div className="flex flex-col items-center gap-8 mb-16">
          <div className="w-full flex justify-center">
            <AnimatedLogo />
          </div>
        </div>

        <header className="mb-16 border-l-4 border-white pl-6 max-w-3xl mx-auto text-left">
          <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
            DOCUMENT_REF: INV-001 // STATUS: IMMUTABLE
          </p>
          <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter text-white">
            The 3% Disruption
          </h1>
        </header>

        <article className="space-y-12 font-mono text-sm leading-relaxed text-gray-400 max-w-3xl mx-auto">
          <section className="space-y-6">
            <p>
              We exist in a state of psychological friction. The modern conscious is caught between the biological drive for novelty and the neurological demand for the familiar. We crave the future, yet we seek shelter in the past.
            </p>
            <p className="text-white font-bold tracking-wide">Invidious is engineered at this exact intersection.</p>
            <p>
              We operate on a strict architectural heuristic: ninety-seven percent heritage structural DNA, three percent calculated disruption. We do not reinvent the heavyweight loopwheel cotton hoodie. We do not compromise the integrity of tailored calfskin. We preserve the foundation.
            </p>
            <p className="border-l border-zinc-700 pl-4 text-gray-300 italic">The intervention happens in the margins.</p>
            <p>
              It is the exposed raw overlock stitching mapping the structural tension of a garment. It is a solid .925 sterling silver industrial split-pin driven through a gothic cross. It is the integration of heavy-gauge mechanical hardware into silhouettes historically reserved for soft luxury. We treat historical religious iconography and industrial architecture as an open-source sample pack—looping and distorting familiar codes to recontextualize them for a new era.
            </p>
          </section>

          <div className="w-full h-px bg-zinc-800 my-12" />

          <section className="space-y-6">
            <h2 className="text-lg font-bold text-white uppercase tracking-widest mb-6">[ Manufacturing Consensus ]</h2>
            <p>
              True luxury is no longer defined merely by price or artificial exclusion. It is defined by uncompromising physical craftsmanship combined with digital sovereignty.
            </p>
            <p>
              While our physical artifacts are strictly scarce—limited by the sheer capacity of our metal casting houses and textile mills—our operational architecture remains entirely transparent. The codes, the structural blueprints, and the data layers are open.
            </p>
            <p>
              You are currently navigating an agentic, edge-rendered matrix designed to test your conviction before granting access to our archives. We reject the monolithic, closed-door engines of mass commerce.
            </p>
            <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-2 mt-8">
              <p className="text-white uppercase tracking-widest font-bold">The syndicate does not follow trends; we manufacture consensus.</p>
              <p className="text-xs">Enter the Forge. Review the digital prototypes. Cast your vote.</p>
              <p className="text-xs">
                If the threshold is met, the artifact is forged in silver and cotton.
                <br />
                If not, it remains a phantom in the server.
              </p>
            </div>
            <p className="text-white uppercase tracking-widest pt-4">This is a new era.</p>
          </section>
        </article>
      </main>
    </div>
  );
}
