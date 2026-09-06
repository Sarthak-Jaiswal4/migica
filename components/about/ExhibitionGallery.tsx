"use client";

import { AppImage as Image } from "@/components/AppImage";
import { useEffect, useRef, useState } from "react";

type Exhibition = {
  title: string;
  location: string;
  description: string;
  image: string;
  alt: string;
  span: string;
  aspectClass: string;
  objectPosition?: string;
};

const exhibitions: Exhibition[] = [
  {
    title: "Dayal Gateway Paradise Mothers Day Event 2026",
    location: "Bandra, Mumbai",
    description: "Our first major public exhibition. 200+ visitors in a single afternoon, 3 wholesale inquiries.",
    image: "/my-4.jpeg",
    alt: "Silver Star booth at Makers Market Mumbai",
    span: "lg:col-span-2",
    aspectClass: "aspect-[11/7]",
    objectPosition: "top",
  },
  {
    title: "Craft Collective Goa 2023",
    location: "Panaji, Goa",
    description: "Beachside pop-up with five other indie studios. Introduced the linen scarf for the first time.",
    image: "/my-1.jpeg",
    alt: "Silver Star pop-up at Craft Collective Goa",
    span: "lg:col-span-1",
    aspectClass: "aspect-[3/4]",
  },
  {
    title: "Diwali Festive Edit 2023",
    location: "Hilton Garden, Lucknow",
    description: "Curated gifting sets, festive editions, and the debut of brass taper holders.",
    image: "/my-2.jpeg",
    alt: "Silver Star festive gifting display during Diwali edit",
    span: "lg:col-span-1",
    aspectClass: "aspect-[3/4]",
  },
  {
    title: "Artisan Fair 2024",
    location: "Shalimar Gateway mall, Lucknow",
    description: "North India debut. Introduced the jewellery line alongside candles and scarves.",
    image: "/my-3.jpeg",
    alt: "Silver Star artisan fair booth",
    span: "lg:col-span-1",
    aspectClass: "aspect-[3/4]",
  },
  {
    title: "Teej Festive Exhibition 2026",
    location: "Casayan Inn hotel, Lucknow",
    description: "Award received by Mayor of Lucknow. Winner Festive Queen, Best Rampwalk and Best Performer.",
    image: "/my-5.jpeg",
    alt: "Silver Star Teej festive exhibition",
    span: "lg:col-span-2",
    aspectClass: "aspect-video",
  },
];

function ExhibitionCard({ ex }: { ex: Exhibition }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card shadow-sm h-full w-full">
      <div className="relative w-full h-full overflow-hidden" style={{ minHeight: "220px" }}>
        <Image
          src={ex.image}
          alt={ex.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ objectPosition: ex.objectPosition ?? "center" }}
          sizes="(max-width:1024px) 80vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <span className="absolute top-3 left-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
          {ex.location}
        </span>
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-[style] text-base font-semibold text-white leading-tight">{ex.title}</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-white/75 line-clamp-2">{ex.description}</p>
        </div>
      </div>
    </div>
  );
}

export function ExhibitionGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Use IntersectionObserver to detect which card is most visible
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const observers: IntersectionObserver[] = [];

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setActiveIndex(i);
          }
        },
        { root: slider, threshold: 0.5 }
      );
      observer.observe(card);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Tap a dot to scroll to that slide
  function scrollToSlide(i: number) {
    const card = cardRefs.current[i];
    if (!card || !sliderRef.current) return;
    sliderRef.current.scrollTo({
      left: card.offsetLeft - 24,
      behavior: "smooth",
    });
  }

  return (
    <section
      className="w-full bg-[#EDE8E2] py-20 md:py-28 border-y border-border/60"
      aria-labelledby="exhibition-heading"
    >
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-14 px-6 sm:px-10 lg:px-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground mb-3">
            In person
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2
              id="exhibition-heading"
              className="font-[style] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl max-w-sm"
            >
              Exhibitions &amp; pop-ups
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600 max-w-md">
              We love meeting people face to face. Every fair teaches us something.
            </p>
          </div>
        </div>

        {/* MOBILE: horizontal snap slider */}
        <div className="lg:hidden">
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2"
            style={{ scrollbarWidth: "none", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
          >
            {exhibitions.map((ex, i) => (
              <div
                key={ex.title}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="snap-center shrink-0 w-[78vw] max-w-[320px] aspect-[3/4]"
              >
                <ExhibitionCard ex={ex} />
              </div>
            ))}
            <div className="shrink-0 w-6" aria-hidden />
          </div>

          {/* Interactive dot indicators */}
          <div className="flex justify-center gap-2 mt-5">
            {exhibitions.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={
                  "rounded-full transition-all duration-300 " +
                  (i === activeIndex
                    ? "w-6 h-2 bg-foreground/80"
                    : "w-2 h-2 bg-foreground/25 hover:bg-foreground/50")
                }
              />
            ))}
          </div>
        </div>

        {/* DESKTOP: bento grid */}
        <div className="hidden lg:grid grid-cols-3 gap-4 px-16">
          {exhibitions.map((ex) => (
            <div key={ex.title} className={ex.span}>
              <div className={"relative overflow-hidden rounded-2xl " + ex.aspectClass}>
                <ExhibitionCard ex={ex} />
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming tag */}
        <div className="mt-10 flex items-center justify-center gap-3 px-6 sm:px-10 lg:px-16">
          <div className="h-px flex-1 bg-border" />
          <span className="rounded-full border border-border text-center bg-background px-4 py-1.5 text-xs font-medium text-muted-foreground whitespace-nowrap">
            More exhibitions coming in 2026
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
      </div>
    </section>
  );
}
