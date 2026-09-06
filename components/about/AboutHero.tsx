import { AppImage as Image } from "@/components/AppImage";
import Link from "next/link";

export function AboutHero() {
  return (
    <section className="relative w-full min-h-[85vh] flex items-end overflow-hidden bg-[#2C1810]">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/Gemini_Generated_Image_aoly2iaoly2iaoly.png"
          alt="Silver Star artisan studio"
          fill
          className="object-cover opacity-50"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/90 via-[#2C1810]/40 to-transparent" />
      </div>

      {/* Decorative grain overlay */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: "url('/gaussian-noise.png')", backgroundRepeat: "repeat" }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-40 sm:px-10 lg:px-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-300/80 mb-4">
          Our story
        </p>
        <h1 className="font-[style] text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl max-w-3xl leading-[1.08]">
          Made with intention,<br />lit with love.
        </h1>
        <p className="mt-6 text-base leading-relaxed text-white/70 max-w-xl sm:text-lg">
          Silver Star began at a kitchen table in 2019. A single wax pour, a handful of botanicals, and
          an obsession with getting every detail right. Seven years on, the spirit hasn't changed —
          only the reach has.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/shop/all"
            className="inline-flex h-12 items-center rounded-full bg-[#C9956C] px-7 text-sm font-semibold text-white hover:bg-[#B8845A] transition-colors"
          >
            Shop the collection
          </Link>
          <a
            href="#journey"
            className="inline-flex h-12 items-center rounded-full border border-white/30 px-7 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            Our journey ↓
          </a>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
