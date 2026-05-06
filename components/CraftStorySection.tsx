"use client";

import { AppImage as Image } from "@/components/AppImage";

const CRAFT_IMAGE = "/10.jpeg";

/**
 * Trust-first intro: who makes things, how they’re sourced.
 * No primary CTA — story does the work.
 */
export function CraftStorySection() {
  return (
    <section
      className="w-full border-y border-neutral-200/60 bg-[#F4EFE8] py-20"
      aria-labelledby="craft-story-heading"
    >
      <div className="mx-auto grid max-w-[1600px] md:grid-cols-2 md:items-stretch">
        <div className="relative min-h-[280px] w-full md:min-h-[420px]">
          <Image
            src={CRAFT_IMAGE}
            alt="Hands finishing a candle pour in soft studio light"
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 50vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent md:bg-gradient-to-r md:from-black/25 md:via-transparent md:to-transparent" />
        </div>

        <div className="flex flex-col justify-center px-6 py-14 sm:px-10 md:py-16 lg:px-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">How Magica comes together</p>
          <h2 id="craft-story-heading" className="mt-3 font-[style] text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            Small batches, real people
          </h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-neutral-700 sm:text-[17px]">
            <p>
              Our candles are poured in short runs — wicks centred by hand, fragrances blended in a studio rather than a
              factory line. When something sells through, we restock deliberately instead of rushing a generic batch.
            </p>
            <p>
              Scarves and jewellery come from workshops we know by name: fibre sources we can trace, metals we’re
              comfortable wearing ourselves. The catalogue photos you see lean on our public gallery so pages stay fast;
              the story of each piece still lives in the details we keep in the database.
            </p>
            <p>
              If you ever want to know who touched your order before it shipped, ask. We’d rather answer that than hide
              behind a brand voice.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
