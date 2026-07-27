import Link from 'next/link';
import Image from 'next/image';
import { AnimatedLogo } from '@/components/UI/AnimatedLogo';

export default function About() {
  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-gray-700">
      <div className="fixed inset-0 -z-10 bg-metallic-wash" aria-hidden="true" />
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-12">
        <nav className="mb-10 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-widest uppercase text-white hover:text-gray-400 transition-colors">
            Invidious
          </Link>
          <Link href="/products" className="text-xs font-mono uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
            [ Return to Archive ]
          </Link>
        </nav>

        <header className="mb-16 border-l-4 border-white pl-6">
          <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2">Founder Statement</p>
          <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-white sm:text-5xl">
            About the Artist // JJ
          </h1>
          <p className="mt-3 text-xs font-mono uppercase tracking-widest text-gray-500">
            At the intersection of craft and code
          </p>
        </header>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] bg-zinc-900 border border-zinc-800 overflow-hidden">
              <Image
                src="/assets/founder-portrait.jpg"
                alt="JJ portrait at the studio desk"
                fill
                className="object-cover grayscale contrast-125"
                priority
              />
              <div className="absolute bottom-3 left-3 text-[10px] font-mono uppercase tracking-widest text-gray-400 bg-black/60 backdrop-blur px-2 py-1">
                FIG_01 // Studio
              </div>
            </div>
            <p className="mt-2 text-[10px] font-mono uppercase tracking-widest text-gray-600 text-center">
              Silver hardware / Canon 50mm / React build
            </p>
          </div>

          <article className="lg:col-span-7 space-y-10 font-mono text-sm leading-relaxed text-gray-400">
            <section className="space-y-4">
              <h2 className="text-base font-bold text-white uppercase tracking-widest">At the Intersection of Craft and Code</h2>
              <p>
                Invidious was founded by JJ, a solo designer, developer, and creative director operating at the boundary where physical luxury craftsmanship meets digital technology.
              </p>
              <p>
                Rather than relying on outsourced agencies, mass production templates, or traditional fashion pipelines, JJ engineered Invidious from the ground up—hand-crafting the physical prototypes, sculpting the sterling silver hardware, and writing every line of code behind the brand&rsquo;s digital flagship.
              </p>
            </section>

            <div className="w-full h-px bg-zinc-800" />

            <section className="space-y-4">
              <h2 className="text-base font-bold text-white uppercase tracking-widest">The Philosophy</h2>
              <p>
                Invidious was born from a desire to merge two distinct worlds:
              </p>
              <ol className="list-decimal pl-5 space-y-4 marker:text-gray-500">
                <li>
                  <span className="text-white">The Physical Permanence of Heavy Hardware:</span>
                  <span className="block mt-1">
                    Deeply inspired by gothic architecture, dark subcultures, and uncompromising physical quality, JJ designs garments and silver hardware built to last generations—utilizing custom .925 sterling silver castings, 14oz raw selvedge denim, and 450 GSM Japanese textiles.
                  </span>
                </li>
                <li>
                  <span className="text-white">The Deconstructive Logic of Modern Technology:</span>
                  <span className="block mt-1">
                    Influenced by modern design heuristics like the 3% rule, JJ treats fashion and software development as fluid, sampling-based mediums. Every piece begins as a familiar structural baseline that is systematically disrupted through raw seam details, bracketed typography, and precise metal interventions.
                  </span>
                </li>
              </ol>
            </section>

            <div className="w-full h-px bg-zinc-800" />

            <section className="space-y-4">
              <h2 className="text-base font-bold text-white uppercase tracking-widest">Beyond the Clothing</h2>
              <p>
                As a solo creator in the age of intelligent tools, JJ utilizes advanced workflows—combining custom 3D parametric modeling in Blender, machine learning trend forecasting, and custom React/Next.js codebases written directly inside VS Code—to build a modern, high-speed luxury ecosystem.
              </p>
              <p>
                Invidious is an ongoing experiment in modern creative autonomy: proving that a single vision, executed across both physical materials and digital systems, can define the next era of alternative luxury.
              </p>
              <blockquote className="border-l-2 border-gray-500 pl-4 italic text-gray-300">
                &ldquo;We do not build for mass consumption. We build permanent artifacts for those who view what they wear—and how it was made—as an extension of their personal identity.&rdquo;
                <span className="mt-2 block text-xs not-italic text-gray-500">— JJ</span>
              </blockquote>
            </section>
          </article>
        </div>

        <footer className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800 pt-8">
          <Link href="/" className="text-xs font-mono uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
            [ Back to Flagship ]
          </Link>
          <Link href="/products" className="text-xs font-mono uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
            [ View the Archive ]
          </Link>
        </footer>
      </div>
    </div>
  );
}
