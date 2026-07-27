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
            Decoding the panopticon
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
              <h2 className="text-base font-bold text-white uppercase tracking-widest">Decoding the Panopticon</h2>
              <p>
                Growing up in the digital era, I spent years watching other people&rsquo;s lives unfold on my screen. Naturally, I developed a quiet admiration for the curated lifestyles they projected. But as that admiration deepened, it evolved into a sobering realization about the modern human condition: my attention was being harvested. I realized that the very machinery of modern social algorithms is engineered to cultivate constant, quiet envy—turning our natural curiosity into a product and using us to harvest attention for others.
              </p>
              <p>
                I chose to call my brand <span className="text-white">Invidious</span>—the Latin root for the sin of Envy. For me, this &ldquo;sin&rdquo; is not a moral failing; it is a raw, creative catalyst. I treat Invidious as an ongoing experiment in modern creative autonomy. By stepping out from behind the screen and building this ecosystem, I am proving that a single, uncompromising vision can bridge raw physical materials and complex digital systems to define the next era of alternative luxury. I am transmuting the envy of the spectator into the armor of the creator.
              </p>
            </section>

            <div className="w-full h-px bg-zinc-800" />

            <section className="space-y-4">
              <h2 className="text-base font-bold text-white uppercase tracking-widest">My Essence: Craft &amp; Code</h2>
              <p>
                My personal aesthetic is the living blueprint for everything I design for Invidious. When you look at me, you see the exact tension that drives my brand:
              </p>
              <ul className="list-disc pl-5 space-y-3 marker:text-gray-500">
                <li>
                  <span className="text-white">The Sharp Monochromatic Tailoring:</span>
                  <span className="block mt-1">
                    I align myself with stark, structured black tailoring—sharp suits, dark dress shirts, and textured ties that command a presence without begging for attention.
                  </span>
                </li>
                <li>
                  <span className="text-white">The Handcrafted Metal Core:</span>
                  <span className="block mt-1">
                    I anchor my look with the heavy, raw weight of subcultural metal, represented by the signature dangling silver gothic cross earring I wear in my left ear. This is the exact same commitment to heavy-gauge, solid .925 sterling silver hardware that I build into my jewelry and accessory drops.
                  </span>
                </li>
                <li>
                  <span className="text-white">The Industrial Backdrop:</span>
                  <span className="block mt-1">
                    The concrete-textured, gritty gray backdrop behind me represents the architectural, industrial baseline of the world I construct.
                  </span>
                </li>
              </ul>
            </section>

            <div className="w-full h-px bg-zinc-800" />

            <section className="space-y-4">
              <h2 className="text-base font-bold text-white uppercase tracking-widest">Modern Autonomy</h2>
              <p>
                I do not believe in traditional fashion pipelines, mass-market templates, or outsourcing my vision to creative agencies.
              </p>
              <p>
                I engineered Invidious from the ground up by myself. I sculpt our custom sterling silver jewelry molds in Blender, source our premium 14oz Japanese raw selvedge denim and 450 GSM heavyweight cotton, and write every single line of code behind our headless Next.js storefront inside VS Code. By leveraging advanced AI workflows to accelerate my engineering, I am establishing a new model of creative independence.
              </p>
              <p className="text-white font-bold tracking-wider uppercase">
                They harvested our attention to make us envious. I harvested their systems to make us free.
              </p>
              <blockquote className="border-l-2 border-gray-500 pl-4 italic text-gray-300">
                &ldquo;I don&rsquo;t build for mass consumption. I build permanent artifacts for those who view what they wear—and the code behind how it was made—as a declaration of personal sovereignty.&rdquo;
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
