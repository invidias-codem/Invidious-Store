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
            Invidious: The Manifesto
          </h1>
        </header>

        <article className="space-y-12 font-mono text-sm leading-relaxed text-gray-400 max-w-3xl mx-auto">
          <section className="space-y-6">
            <h2 className="font-gothic-ui text-lg text-white uppercase tracking-[0.18em]">I. The Genesis of Cognitive Harvesting</h2>
            <p>
              We grew up in the digital panopticon, watching other lives unfold in hyper-saturated pixels. What began as admiration for the lifestyles represented on our screens evolved into a deeper understanding of the modern human condition: we were not just consumers; we were the crop. Our attention was harvested to feed a global machine designed to cultivate constant, quiet envy.
            </p>
          </section>

          <div className="w-full h-px bg-zinc-800 my-12" />

          <section className="space-y-6">
            <h2 className="font-gothic-ui text-lg text-white uppercase tracking-[0.18em]">II. Weight, Hardware, and Permanence</h2>
            <p>
              In a world consumed by ephemeral digital noise, we build physical artifacts engineered to endure. We measure value in weight, grain, and density:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-400 marker:text-gray-500">
              <li>450 GSM Japanese loopwheel cotton.</li>
              <li>14oz raw selvedge denim.</li>
              <li>Solid .925 sterling silver cast in heavy-gauge industrial motifs.</li>
            </ul>
            <p>
              We reject disposable trends. Every garment, button, and chain link is built as a permanent testament to high craftsmanship, designed to age, distress, and acquire character through wear.
            </p>
          </section>

          <div className="w-full h-px bg-zinc-800 my-12" />

          <section className="space-y-6">
            <h2 className="font-gothic-ui text-lg text-white uppercase tracking-[0.18em]">III. Architecture of Desire</h2>
            <p>
              <span className="italic text-gray-300">Invidious</span>—born from the human psychological drive toward the rare, the sacred, and the unattainable. We do not ask for attention through loud logos or artificial hype; we demand it through uncompromising structural integrity and subcultural authenticity. We build for the discerning few who view their wardrobe as cultural armor.
            </p>
          </section>

          <div className="w-full h-px bg-zinc-800 my-12" />

          <section className="space-y-6">
            <h2 className="font-gothic-ui text-lg text-white uppercase tracking-[0.18em]">IV. Open Code, Closed Scarcity</h2>
            <p>
              Our methodology is open source; our physical drops are uncompromisingly scarce. We share the blueprint, the code, and the intellectual process behind our creation, while strictly limiting the physical yield. Once a prototype phase closes, it returns to the archive.
            </p>
            <p className="text-white font-bold tracking-widest uppercase">No restocks. No compromise. Hardware for the new era.</p>
          </section>
        </article>
      </main>
    </div>
  );
}
