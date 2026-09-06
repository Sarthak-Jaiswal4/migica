import Link from "next/link";
import { AppImage as Image } from "@/components/AppImage";
import { Instagram, Mail } from "lucide-react";

export function AboutCTA() {
  return (
    <section className="w-full md:px-4 pb-16 bg-background" aria-labelledby="cta-heading">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden md:rounded-[3rem] bg-neutral-900 text-white px-8 py-16 md:px-16 md:py-20">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="/Gemini_Generated_Image_m8m2atm8m2atm8m2.png"
              alt="Silver Star candles"
              fill
              className="object-cover opacity-20"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/90 via-neutral-900/70 to-amber-950/80" />
          </div>

          {/* Grain */}
          <div
            className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
            style={{ backgroundImage: "url('/gaussian-noise.png')", backgroundRepeat: "repeat" }}
          />

          {/* Glow blobs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[120px] rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-700/10 blur-[100px] rounded-full -ml-16 -mb-16" />

          <div className="relative z-10 flex flex-col items-center text-center gap-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-300/80">
              Let's connect
            </p>
            <h2
              id="cta-heading"
              className="font-[style] text-4xl font-semibold tracking-tight text-white sm:text-5xl max-w-2xl leading-[1.1]"
            >
              Every Silver Star story begins with a single question
            </h2>
            <p className="text-base text-white/65 max-w-lg leading-relaxed">
              Curious about a product, a custom order, or just want to know what went into a
              particular scent blend? Write to us. Priya reads every message.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
              <Link
                href="/shop/all"
                className="inline-flex h-12 items-center rounded-full bg-[#C9956C] px-8 text-sm font-semibold text-white hover:bg-[#B8845A] transition-colors shadow-lg"
              >
                Shop the collection
              </Link>
              <a
                href="mailto:hello@silverstar.live"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-8 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                <Mail size={15} />
                Say hello
              </a>
              <a
                href="https://instagram.com/silverstar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
                aria-label="Follow on Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>

            {/* Stats row */}
            <div className="mt-6 w-full grid grid-cols-2 gap-px rounded-2xl overflow-hidden border border-white/10 sm:grid-cols-4">
              {[
                { stat: "15000+", label: "Orders shipped" },
                { stat: "7", label: "Categories" },
                { stat: "7", label: "Exhibition cities" },
                { stat: "15 yrs", label: "Of handcrafting" },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 py-6 px-4 text-center">
                  <p className="font-[style] text-2xl font-semibold text-white">{s.stat}</p>
                  <p className="text-[11px] text-white/55 mt-1 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
