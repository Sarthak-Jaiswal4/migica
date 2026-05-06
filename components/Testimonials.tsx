"use client";

import { AppImage as Image } from "@/components/AppImage";
import Link from "next/link";
import { Play, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

/** Swap this for your real hosted unboxing / testimonial clip when ready */
const VIDEO_POSTER_SRC = "/10.jpeg";

type TextStory = {
  kind: "quote";
  firstName: string;
  product: string;
  location?: string;
  body: string;
  /** Optional short rating line — avoid identical 5★ on every card */
  ratingLine?: string;
};

type UgcStory = {
  kind: "ugc";
  handle: string;
  firstName: string;
  product: string;
  caption: string;
  imageSrc: string;
  imageAlt: string;
};

const textStories: TextStory[] = [
  {
    kind: "quote",
    firstName: "Ananya",
    product: "Monsoon Oud — 220g jar",
    location: "Pune",
    body: "I was sceptical ordering candles online. The throw fills our living room without being sweet. Wick is centred, no tunneling after a week of evening burns.",
    ratingLine: "Would order again",
  },
  {
    kind: "quote",
    firstName: "Rahul",
    product: "Linen scarf, Sandstone",
    location: "Bengaluru",
    body: "Gift for my partner. She wears it to work most days — fabric feels heavier than fast-fashion scarves we tried at the mall. Packaging was simple, no plastic crinkle.",
    ratingLine: "4/5 — only nit: box arrived slightly dented, product fine",
  },
  {
    kind: "quote",
    firstName: "Meera",
    product: "Brass taper holders (pair)",
    location: "Chennai",
    body: "Small purchase but they sit flat on our dining table. Patina already settling in nicely. Support answered a sizing question on WhatsApp same day.",
  },
];

const ugcStory: UgcStory = {
  kind: "ugc",
  handle: "kiran_s",
  firstName: "Kiran",
  product: "Cedar & smoke votive set",
  caption: "unfiltered shelf pic — the votives are tiny but the throw is ridiculous 😅 #magica",
  imageSrc: "/4.1.png",
  imageAlt: "Customer photo of candle votives on a wooden shelf",
};

function StarRow({ filled = 5, of = 5 }: { filled?: number; of?: number }) {
  return (
    <p className="flex gap-0.5 text-amber-600/90" aria-label={`${filled} out of ${of} stars`}>
      {Array.from({ length: of }, (_, i) => (
        <span key={i} className={cn("text-[11px] leading-none", i < filled ? "opacity-100" : "opacity-25")}>
          ★
        </span>
      ))}
    </p>
  );
}

export function Testimonials() {
  return (
    <section
      className="relative overflow-hidden bg-[#EDE8E2] py-20 md:py-28"
      aria-labelledby="testimonials-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] blur-sm"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, rgba(139,58,26,0.08) 0%, transparent 45%),
            radial-gradient(circle at 80% 60%, rgba(120,80,60,0.06) 0%, transparent 40%)`,
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-14 max-w-2xl text-center md:mb-20">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">Real voices</p>
          <h2
            id="testimonials-heading"
            className="font-[style] text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl md:text-[2.75rem] md:leading-[1.1]"
          >
            What people actually bought — and what stuck
          </h2>
          <p className="mt-4 text-sm font-medium leading-relaxed text-neutral-600 sm:text-base">
            We lead with first names and the exact item. Polished five-star grids feel anonymous; specificity and rough edges
            usually mean someone cared enough to write.
          </p>
        </header>

        <div className="grid auto-rows-auto gap-4 md:grid-cols-12 md:gap-5">
          {/* Featured quote — spans wide */}
          <article className="group relative rounded-2xl border border-neutral-200/80 bg-[#FFFBF7] p-6 shadow-sm transition-shadow duration-300 hover:shadow-md md:col-span-7 md:p-8">
            <Quote
              className="absolute right-6 top-6 h-10 w-10 text-amber-900/10 transition-colors group-hover:text-amber-900/[0.14]"
              strokeWidth={1}
              aria-hidden
            />
            <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-900/70">Featured note</p>
            <blockquote className="mt-3 font-[style] text-xl leading-snug text-neutral-900 sm:text-2xl">
              <span className="text-neutral-800">&ldquo;{textStories[0].body}&rdquo;</span>
            </blockquote>
            <footer className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-neutral-200/70 pt-5">
              <div>
                <p className="text-sm font-semibold text-neutral-900">{textStories[0].firstName}</p>
                <p className="mt-1 text-xs text-neutral-600">
                  Bought{" "}
                  <cite className="font-medium not-italic text-neutral-800">{textStories[0].product}</cite>
                  {textStories[0].location ? (
                    <span className="text-neutral-500"> · {textStories[0].location}</span>
                  ) : null}
                </p>
              </div>
              <div className="text-right">
                <StarRow filled={5} of={5} />
                <p className="mt-1 text-[11px] font-medium text-neutral-500">{textStories[0].ratingLine}</p>
              </div>
            </footer>
          </article>

          {/* UGC-style */}
          <article className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm md:col-span-5">
            <div className="flex items-center gap-3 border-b border-neutral-100 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-rose-200 to-amber-100 text-xs font-bold text-neutral-800">
                {ugcStory.firstName[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-neutral-900">@{ugcStory.handle}</p>
                <p className="text-[11px] text-neutral-500">
                  Customer photo · <span className="text-neutral-700">Bought {ugcStory.product}</span>
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-neutral-600">
                UGC
              </span>
            </div>
            <div className="relative aspect-[4/3] w-full bg-neutral-100">
              <Image src={ugcStory.imageSrc} alt={ugcStory.imageAlt} fill className="object-cover" sizes="(max-width:768px) 100vw, 400px" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" aria-hidden />
            </div>
            <p className="px-4 py-3 text-sm leading-relaxed text-neutral-700">{ugcStory.caption}</p>
            <p className="border-t border-neutral-100 px-4 py-2.5 text-[11px] text-neutral-500">
              Screenshots / embeds from Instagram or WhatsApp status — swap with real posts when you have permission.
            </p>
          </article>

          {/* Video spotlight */}
          <article className="overflow-hidden rounded-2xl border border-neutral-300/80 bg-neutral-950 text-white shadow-lg md:col-span-12">
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-video min-h-[200px] md:aspect-auto md:min-h-[280px]">
                <Image
                  src={VIDEO_POSTER_SRC}
                  alt="Placeholder frame for a future customer unboxing video"
                  fill
                  className="object-cover opacity-90"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/20 to-transparent" />
                <button
                  type="button"
                  className="group absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-neutral-900 shadow-xl ring-2 ring-white/40 transition hover:scale-105 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                  aria-label="Video testimonial placeholder — add your clip URL in Testimonials.tsx"
                >
                  <Play className="ml-0.5 h-7 w-7 fill-current" aria-hidden />
                </button>
                <span className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-white/90 backdrop-blur-sm">
                  ~20s · unboxing
                </span>
              </div>
              <div className="flex flex-col justify-center p-6 md:p-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200/90">Video beats volume</p>
                <h3 className="mt-2 font-[style] text-2xl font-medium leading-tight text-white">
                  One genuine clip outperforms fifty identical star rows
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-white/75">
                  When you have a short phone video — packing sound, first light of the wick, a real voice — host it (YouTube
                  unlisted, Cloudflare Stream, etc.) and wire the play button to open it. Until then, this block stays a calm
                  placeholder so the layout is ready.
                </p>
                <p className="mt-5 text-xs text-white/55">
                  Tip: ask happy buyers by name if you can feature 15–20 seconds; credit them on-screen.
                </p>
              </div>
            </div>
          </article>

          {/* Two shorter quotes — different rating presentation */}
          <article className="rounded-2xl border border-neutral-200/80 bg-white/90 p-6 shadow-sm md:col-span-6">
            <blockquote className="text-base leading-relaxed text-neutral-800">&ldquo;{textStories[1].body}&rdquo;</blockquote>
            <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-4">
              <div>
                <p className="text-sm font-semibold text-neutral-900">{textStories[1].firstName}</p>
                <p className="mt-0.5 text-xs text-neutral-600">
                  Bought <cite className="font-medium not-italic text-neutral-800">{textStories[1].product}</cite>
                  <span className="text-neutral-500"> · {textStories[1].location}</span>
                </p>
              </div>
              <p className="max-w-[140px] text-right text-[11px] font-medium leading-snug text-amber-900/80">
                {textStories[1].ratingLine}
              </p>
            </footer>
          </article>

          <article className="rounded-2xl border border-neutral-200/80 bg-[#F9F5F0] p-6 shadow-sm md:col-span-6">
            <blockquote className="text-base leading-relaxed text-neutral-800">&ldquo;{textStories[2].body}&rdquo;</blockquote>
            <footer className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-neutral-200/60 pt-4">
              <div>
                <p className="text-sm font-semibold text-neutral-900">{textStories[2].firstName}</p>
                <p className="mt-0.5 text-xs text-neutral-600">
                  Bought <cite className="font-medium not-italic text-neutral-800">{textStories[2].product}</cite>
                  <span className="text-neutral-500"> · {textStories[2].location}</span>
                </p>
              </div>
              <StarRow filled={5} of={5} />
            </footer>
          </article>
        </div>

        <p className="mx-auto mt-12 max-w-xl text-center text-xs leading-relaxed text-neutral-500">
          <Link href="/shop/all" className="font-medium text-amber-900 underline-offset-2 hover:underline">
            Shop the collection
          </Link>
        </p>
      </div>
    </section>
  );
}
