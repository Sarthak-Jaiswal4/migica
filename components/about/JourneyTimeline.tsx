"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AppImage as Image } from "@/components/AppImage";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const chapters = [
  {
    era: "2012 – 2013",
    city: "Kanpur",
    categories: 1,
    categoryLabel: "Candles",
    title: "A hobby that refused to stay quiet",
    body: "It started without a plan. Shalini was making candles at home in Kanpur, gifting them to neighbours, adjusting the wax ratio at midnight. No brand, no strategy. Just a woman and a flame that kept drawing her back.",
    quote: "\"I wasn't thinking about a business. I was thinking about the next pour.\"",
    image: "/Gemini_Generated_Image_aoly2iaoly2iaoly.png",
  },
  {
    era: "2014 – 2015",
    city: "Patna",
    categories: 2,
    categoryLabel: "Candles · Jewellery",
    title: "A new city. A second category.",
    body: "Moving to Patna meant starting over — but it also meant a blank slate. A jewellery maker she met at a local market became her first collaborator. She learned that customers wanted to carry something beautiful home with them.",
    quote: "\"Every city teaches you what people love. Patna taught me jewellery.\"",
    image: "/Gemini_Generated_Image_emozbemozbemozbe.png",
  },
  {
    era: "2016 – 2017",
    city: "Ahmedabad",
    categories: 3,
    categoryLabel: "Candles · Jewellery · Scarves",
    title: "Textiles, because Ahmedabad demands it",
    body: "You cannot live in Ahmedabad and not fall in love with fabric. Shalini sourced her first linen scarves from a weaver in the old city. They sold faster than anything she had made before.",
    quote: "\"Ahmedabad didn't just change my range. It changed how I think about craft.\"",
    image: "/Gemini_Generated_Image_4acm4v4acm4v4acm.png",
  },
  {
    era: "2018 – 2019",
    city: "Delhi",
    categories: 4,
    categoryLabel: "Candles · Jewellery · Scarves · Clothing",
    title: "Delhi scale. Delhi confidence.",
    body: "Delhi was the first city that felt like the world was watching. Her first proper pop-up — a table at a design market in Hauz Khas — sold out by noon on day two. Clothing entered the picture because customers kept asking.",
    quote: "\"Delhi dared me to take up more space. I finally did.\"",
    image: "/Gemini_Generated_Image_jc73sjc73sjc73sj.png",
  },
  {
    era: "2020 – 2022",
    city: "Delhi",
    categories: 5,
    categoryLabel: "+ Home Décor",
    title: "The world slowed down. She didn't.",
    body: "When the pandemic locked everyone indoors, people suddenly cared about how their homes felt. Shalini launched her home décor line from a one-room studio. Orders came from eight cities she had never visited.",
    quote: "\"The hardest years made the most faithful customers.\"",
    image: "/Gemini_Generated_Image_w0ls4bw0ls4bw0ls.png",
  },
  {
    era: "2023 – 2026",
    city: "Lucknow",
    categories: 6,
    categoryLabel: "+ Gifts & Hampers",
    title: "Home. And the beginning of everything.",
    body: "Lucknow was where Shalini had always imagined ending up — and where she finally built a proper studio. Gifts and hampers became her sixth category. The Teej fair brought an award from the Mayor. The best is still being written.",
    quote: "\"Lucknow is where Silver Star became something I can't contain anymore.\"",
    image: "/Gemini_Generated_Image_nqx3aunqx3aunqx3.png",
  },
];

const TOTAL = chapters.length;

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export function JourneyTimeline() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressLabelRef = useRef<HTMLSpanElement>(null);

  // Per-chapter element refs
  const imgRefs = useRef<HTMLDivElement[]>([]);
  const textRefs = useRef<HTMLDivElement[]>([]);
  const dotRowRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: () => `+=${(TOTAL - 1) * window.innerHeight * 0.9}`,
          pin: pinnedRef.current,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Progress bar
            if (progressBarRef.current) {
              gsap.set(progressBarRef.current, { scaleX: self.progress });
            }
            // Progress label
            const step = Math.round(self.progress * (TOTAL - 1)) + 1;
            if (progressLabelRef.current) {
              progressLabelRef.current.textContent = `${step} / ${TOTAL}`;
            }
          },
        },
      });

      // Build a step for each chapter transition (chapter 0 is already visible)
      for (let i = 0; i < TOTAL - 1; i++) {
        // Fade OUT current chapter text
        tl.to(
          textRefs.current[i],
          { opacity: 0, y: -30, duration: 0.4, ease: "power2.in" },
          i
        );

        // Crossfade images
        tl.to(
          imgRefs.current[i],
          { opacity: 0, scale: 1.04, duration: 0.5, ease: "power2.inOut" },
          i + 0.05
        );
        tl.fromTo(
          imgRefs.current[i + 1],
          { opacity: 0, scale: 1.04 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "power2.inOut" },
          i + 0.05
        );

        // Fade IN next chapter text
        tl.fromTo(
          textRefs.current[i + 1],
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          i + 0.35
        );

        // Animate dots — reveal one extra dot
        const allDots = dotRowRefs.current[i + 1]?.querySelectorAll("[data-dot]");
        if (allDots) {
          tl.fromTo(
            Array.from(allDots).slice(0, chapters[i + 1].categories),
            { scale: 0.4, opacity: 0.2 },
            { scale: 1, opacity: 1, stagger: 0.06, duration: 0.25, ease: "back.out(2)" },
            i + 0.4
          );
        }
      }
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="journey" aria-labelledby="journey-heading">

      {/* ── Section intro (scrolls normally above pinned area) ── */}
      <div className="bg-[#F4EFE8] border-y border-border/60 py-20 px-6 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground mb-4">
            15 years · 5 cities · 6 categories
          </p>
          <h2
            id="journey-heading"
            className="font-[style] text-4xl font-semibold tracking-tight text-foreground sm:text-5xl max-w-2xl leading-[1.1]"
          >
            The journey of a woman who built this,{" "}
            <span className="text-[#C9956C]">one city at a time.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-neutral-600 max-w-xl sm:text-lg">
            Shalini Agarwal started alone, at home, with a single candle pour in Kanpur in 2012.
            What follows is not a business story — it is a personal one.
          </p>
          {/* City trail */}
          <div className="mt-8 flex flex-wrap items-center gap-2 text-sm font-medium text-muted-foreground">
            {["Kanpur", "Patna", "Ahmedabad", "Delhi", "Lucknow"].map((city, i, arr) => (
              <span key={city} className="flex items-center gap-2">
                <span className="text-foreground font-semibold">{city}</span>
                {i < arr.length - 1 && <span className="text-[#C9956C]/60 text-base">→</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scroll wrapper (sets total scroll height) ── */}
      <div ref={wrapperRef} className="relative bg-[#1C1008]">

        {/* ── Pinned panel ── */}
        <div
          ref={pinnedRef}
          className="relative h-screen w-full overflow-hidden flex flex-col"
        >
          {/* ── Image layer (all stacked, crossfaded by GSAP) ── */}
          <div className="absolute inset-0">
            {chapters.map((ch, i) => (
              <div
                key={ch.era}
                ref={(el) => { if (el) imgRefs.current[i] = el; }}
                className="absolute inset-0"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <Image
                  src={ch.image}
                  alt={ch.title}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  sizes="100vw"
                />
                {/* Dark scrim for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              </div>
            ))}
          </div>

          {/* ── Progress bar (top edge) ── */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/10 z-20">
            <div
              ref={progressBarRef}
              className="h-full bg-[#C9956C] origin-left"
              style={{ transform: "scaleX(0)" }}
            />
          </div>


          {/* ── Text panels (all stacked, crossfaded by GSAP) ── */}
          {/* Each panel is absolute inset-0 so it fills the flex area and
              centers content with its own flex — all chapters stay at the
              same vertical level regardless of content height */}
          <div className="relative z-10 flex-1">
            {chapters.map((ch, i) => (
              <div
                key={ch.era}
                ref={(el) => { if (el) textRefs.current[i] = el; }}
                className="absolute inset-0 flex items-center px-6 sm:px-12 lg:px-20"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <div className="max-w-xl w-full">
                  {/* City + era */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C9956C]/50 bg-[#C9956C]/15 backdrop-blur-sm px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#C9956C]">
                      {ch.city}
                    </span>
                    <span className="text-xs text-white/50 font-medium tracking-wide">
                      {ch.era}
                    </span>
                  </div>

                  {/* Category dots */}
                  <div
                    ref={(el) => { if (el) dotRowRefs.current[i] = el; }}
                    className="flex items-center gap-2 mb-6"
                  >
                    {Array.from({ length: 6 }, (_, d) => (
                      <span
                        key={d}
                        data-dot
                        className={
                          "block rounded-full transition-colors " +
                          (d < ch.categories
                            ? "w-3 h-3 bg-[#C9956C]"
                            : "w-2 h-2 bg-white/15")
                        }
                      />
                    ))}
                    <span className="ml-2 text-[11px] font-semibold uppercase tracking-wider text-[#C9956C]">
                      {ch.categories} {ch.categories === 1 ? "category" : "categories"}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-[style] text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                    {ch.title}
                  </h3>

                  {/* Body */}
                  <p className="mt-5 text-sm leading-relaxed text-white/70 sm:text-base max-w-md">
                    {ch.body}
                  </p>

                  {/* Quote */}
                  <blockquote className="mt-6 border-l-2 border-[#C9956C]/70 pl-5 font-[style] text-lg italic leading-snug text-white/85 sm:text-xl">
                    {ch.quote}
                  </blockquote>
                </div>{/* end max-w-xl */}
              </div>
            ))}
          </div>

          {/* ── Bottom: scroll hint ── */}
          <div className="relative z-20 flex flex-col items-center gap-3 pb-8">
            {/* Scroll hint */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60">Chapter</span>
                <span ref={progressLabelRef} className="text-sm font-bold text-white tabular-nums">
                  1 / {TOTAL}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/40 font-medium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
                scroll to explore
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Closing stat bar (scrolls normally below pinned area) ── */}
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
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
