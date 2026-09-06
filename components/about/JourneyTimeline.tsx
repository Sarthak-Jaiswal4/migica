"use client";

import { AppImage as Image } from "@/components/AppImage";
import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const chapters = [
  {
    era: "2012 – 2013",
    city: "Kanpur",
    cityEmoji: "🏠",
    categories: 1,
    categoryLabel: "Candles",
    title: "A hobby that refused to stay quiet",
    body: "It started the way most real things do — without a plan. Shalini was making candles at home in Kanpur, gifting them to neighbours, adjusting the wax ratio at midnight. No brand, no strategy. Just a woman and a flame that kept drawing her back.",
    quote: "\"I wasn't thinking about a business. I was thinking about the next pour.\"",
    image: "/Gemini_Generated_Image_aoly2iaoly2iaoly.png",
    imageAlt: "Hands pouring candle wax in a home studio",
    imagePosition: "right",
  },
  {
    era: "2014 – 2015",
    city: "Patna",
    cityEmoji: "🌱",
    categories: 2,
    categoryLabel: "Candles · Jewellery",
    title: "A new city. A second category.",
    body: "Moving to Patna meant starting over socially — but it also meant a blank slate. A local jewellery maker she met at a sabzi market became her first collaborator. She started selling both at weekend haats, learning that her customers wanted to carry something beautiful home with them.",
    quote: "\"Every city teaches you what people love. Patna taught me jewellery.\"",
    image: "/Gemini_Generated_Image_emozbemozbemozbe.png",
    imageAlt: "Handcrafted jewellery laid on a wooden surface",
    imagePosition: "left",
  },
  {
    era: "2016 – 2017",
    city: "Ahmedabad",
    cityEmoji: "🧵",
    categories: 3,
    categoryLabel: "Candles · Jewellery · Scarves",
    title: "Textiles, because Ahmedabad demands it",
    body: "You cannot live in Ahmedabad and not fall in love with fabric. Shalini didn't resist. She sourced her first linen scarves from a weaver in the old city, and they sold faster than anything she had made. The catalogue was growing — not by plan, but by listening.",
    quote: "\"Ahmedabad didn't just change my range. It changed how I think about craft.\"",
    image: "/Gemini_Generated_Image_4acm4v4acm4v4acm.png",
    imageAlt: "Handwoven scarves in warm tones displayed at a market",
    imagePosition: "right",
  },
  {
    era: "2018 – 2019",
    city: "Delhi",
    cityEmoji: "🌆",
    categories: 4,
    categoryLabel: "Candles · Jewellery · Scarves · Clothing",
    title: "Delhi scale. Delhi confidence.",
    body: "Delhi was the first city that felt like the world was watching. She did her first proper pop-up — a rented table at a design market in Hauz Khas. Clothing entered the picture because customers kept asking. The booth sold out by noon on day two.",
    quote: "\"Delhi dared me to take up more space. I finally did.\"",
    image: "/Gemini_Generated_Image_jc73sjc73sjc73sj.png",
    imageAlt: "Silver Star pop-up booth at a Delhi design market",
    imagePosition: "left",
  },
  {
    era: "2020 – 2022",
    city: "Delhi",
    cityEmoji: "🕯️",
    categories: 5,
    categoryLabel: "+ Home Décor",
    title: "The world slowed down. She didn't.",
    body: "When the pandemic locked everyone indoors, people suddenly cared deeply about how their homes felt. Shalini launched her home décor line from a one-room studio during the first lockdown. Orders came from eight cities she had never visited. She shipped every box herself.",
    quote: "\"The hardest years made the most faithful customers.\"",
    image: "/Gemini_Generated_Image_w0ls4bw0ls4bw0ls.png",
    imageAlt: "Home décor pieces — candles and brass holders styled in a warm interior",
    imagePosition: "right",
  },
  {
    era: "2023 – 2024",
    city: "Lucknow",
    cityEmoji: "🎁",
    categories: 6,
    categoryLabel: "+ Gifts & Hampers",
    title: "Home. And the beginning of everything.",
    body: "Lucknow was where Shalini had always imagined ending up — and where she finally built a proper studio. Gifts and hampers became her sixth category, curated collections that brought everything together. The Teej fair brought an award from the Mayor. The best was still being written.",
    quote: "\"Lucknow is where Silver Star became something I can't contain anymore.\"",
    image: "/Gemini_Generated_Image_nqx3aunqx3aunqx3.png",
    imageAlt: "Curated Silver Star gift hampers on display in Lucknow studio",
    imagePosition: "left",
  },
];

/* ─────────────────────────────────────────────
   CATEGORY DOT ROW
───────────────────────────────────────────── */
function CategoryDots({ count, label }: { count: number; label: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 flex-wrap">
        {Array.from({ length: 6 }, (_, i) => (
          <span
            key={i}
            className={
              "h-2 w-2 rounded-full transition-all duration-500 " +
              (i < count ? "bg-[#C9956C]" : "bg-[#C9956C]/20")
            }
          />
        ))}
        <span className="ml-1 text-[10px] font-semibold uppercase tracking-wider text-[#C9956C]">
          {count} {count === 1 ? "category" : "categories"}
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground font-medium">{label}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SINGLE CHAPTER
───────────────────────────────────────────── */
function Chapter({
  chapter,
  index,
  isVisible,
  lineRef,
}: {
  chapter: typeof chapters[0];
  index: number;
  isVisible: boolean;
  lineRef: (el: HTMLDivElement | null) => void;
}) {
  const isRight = chapter.imagePosition === "right";

  return (
    <div
      ref={lineRef}
      className={
        "relative grid gap-0 transition-all duration-700 " +
        (isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8") +
        " md:grid-cols-2"
      }
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      {/* ── Text side ── */}
      <div
        className={
          "flex flex-col justify-center px-6 py-14 sm:px-10 lg:px-16 " +
          (isRight ? "md:order-1" : "md:order-2")
        }
      >
        {/* City + era badge row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C9956C]/30 bg-[#C9956C]/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#C9956C]">
            {chapter.cityEmoji} {chapter.city}
          </span>
          <span className="text-[11px] text-muted-foreground font-medium tracking-wide">
            {chapter.era}
          </span>
        </div>

        {/* Category dots */}
        <CategoryDots count={chapter.categories} label={chapter.categoryLabel} />

        {/* Title */}
        <h3 className="mt-6 font-[style] text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
          {chapter.title}
        </h3>

        {/* Body */}
        <p className="mt-4 text-base leading-relaxed text-neutral-600 sm:text-[17px]">
          {chapter.body}
        </p>

        {/* Quote */}
        <blockquote className="mt-7 border-l-2 border-[#C9956C]/50 pl-5 font-[style] text-lg italic leading-snug text-foreground/80">
          {chapter.quote}
        </blockquote>
      </div>

      {/* ── Image side ── */}
      <div
        className={
          "relative min-h-[300px] md:min-h-[480px] overflow-hidden " +
          (isRight ? "md:order-2" : "md:order-1")
        }
      >
        <Image
          src={chapter.image}
          alt={chapter.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 50vw"
        />
        {/* Warm vignette toward text */}
        <div
          className={
            "absolute inset-0 " +
            (isRight
              ? "bg-gradient-to-l from-transparent via-black/10 to-black/30"
              : "bg-gradient-to-r from-transparent via-black/10 to-black/30")
          }
        />
        {/* Chapter number watermark */}
        <span className="absolute bottom-4 right-5 font-[style] text-6xl font-bold text-white/10 select-none leading-none">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Divider between chapters */}
      {index < chapters.length - 1 && (
        <div className="md:col-span-2 h-px bg-border/50 mx-6 sm:mx-10 lg:mx-16" />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
export function JourneyTimeline() {
  const [visibleSet, setVisibleSet] = useState<Set<number>>(new Set());
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    chapterRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSet((prev) => new Set([...prev, i]));
            obs.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section
      id="journey"
      className="w-full bg-background"
      aria-labelledby="journey-heading"
    >
      {/* ── Section header ── */}
      <div className="border-y border-border/60 bg-[#F4EFE8] py-20 md:py-24 px-6 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground mb-4">
            15 years · 5 cities · 6 categories
          </p>
          <h2
            id="journey-heading"
            className="font-[style] text-4xl font-semibold tracking-tight text-foreground sm:text-5xl max-w-2xl leading-[1.1]"
          >
            The journey of a woman who built this,<br />
            <span className="text-[#C9956C]">one city at a time.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-neutral-600 max-w-xl sm:text-lg">
            Shalini Agarwal started alone, at home, with a single candle pour in Kanpur. What follows
            is not a business story. It is a personal one — of a woman who kept going.
          </p>

          {/* City trail */}
          <div className="mt-10 flex flex-wrap items-center gap-2 text-sm font-medium text-muted-foreground">
            {["Kanpur", "Patna", "Ahmedabad", "Delhi", "Lucknow"].map((city, i, arr) => (
              <span key={city} className="flex items-center gap-2">
                <span className="text-foreground font-semibold">{city}</span>
                {i < arr.length - 1 && (
                  <span className="text-[#C9956C]/60">→</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Chapters ── */}
      <div className="mx-auto max-w-[1600px]">
        {chapters.map((chapter, i) => (
          <Chapter
            key={chapter.era}
            chapter={chapter}
            index={i}
            isVisible={visibleSet.has(i)}
            lineRef={(el) => { chapterRefs.current[i] = el; }}
          />
        ))}
      </div>

      {/* ── Closing stat bar ── */}
      <div className="border-t border-border/60 bg-[#F4EFE8] py-14 px-6 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { stat: "2012", label: "Year she started" },
            { stat: "5", label: "Cities she called home" },
            { stat: "6", label: "Categories today" },
            { stat: "15+", label: "Years of making" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-[style] text-4xl font-semibold text-foreground">{s.stat}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
