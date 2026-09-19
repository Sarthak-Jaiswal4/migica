"use client";

import { AppImage as Image } from "@/components/AppImage";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Exhibition as ExhibitionRecord } from "@/lib/showcase";

type Exhibition = ExhibitionRecord & {
  alt: string;
  objectPosition?: string;
};

// const fallbackExhibitions: Exhibition[] = [
//   {
//     id: "fallback-1",
//     title: "Dayal Gateway Paradise Mothers Day Event 2026",
//     location: "Bandra, Mumbai",
//     description: "Our first major public exhibition. 200+ visitors in a single afternoon, 3 wholesale inquiries.",
//     image: "/my-4.jpeg",
//     alt: "Silver Star booth at Makers Market Mumbai",
//     order: 0,
//     objectPosition: "top",
//   },
//   {
//     id: "fallback-2",
//     title: "Craft Collective Goa 2023",
//     location: "Panaji, Goa",
//     description: "Beachside pop-up with five other indie studios. Introduced the linen scarf for the first time.",
//     image: "/my-1.jpeg",
//     alt: "Silver Star pop-up at Craft Collective Goa",
//     order: 1,
//   },
//   {
//     id: "fallback-3",
//     title: "Diwali Festive Edit 2023",
//     location: "Hilton Garden, Lucknow",
//     description: "Curated gifting sets, festive editions, and the debut of brass taper holders.",
//     image: "/my-2.jpeg",
//     alt: "Silver Star festive gifting display during Diwali edit",
//     order: 2,
//   },
//   {
//     id: "fallback-4",
//     title: "Artisan Fair 2024",
//     location: "Shalimar Gateway mall, Lucknow",
//     description: "North India debut. Introduced the jewellery line alongside candles and scarves.",
//     image: "/my-3.jpeg",
//     alt: "Silver Star artisan fair booth",
//     order: 3,
//   },
//   {
//     id: "fallback-5",
//     title: "Teej Festive Exhibition 2026",
//     location: "Casayan Inn hotel, Lucknow",
//     description: "Award received by Mayor of Lucknow. Winner Festive Queen, Best Rampwalk and Best Performer.",
//     image: "/my-5.jpeg",
//     alt: "Silver Star Teej festive exhibition",
//     order: 4,
//   },
// ];

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
  const [isDragging, setIsDragging] = useState(false);
  const [items, setItems] = useState<Exhibition[] | []>([]);
  const sliderRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragStart = useRef(0);
  const scrollStart = useRef(0);

  useEffect(() => {
    fetch("/api/showcase/exhibitions")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (data?.items?.length) {
          setItems((data.items as ExhibitionRecord[]).map((item) => ({ ...item, alt: item.title })));
        }
      })
      .catch(() => {});
  }, []);

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
  }, [items.length]);

  const scrollToSlide = useCallback((i: number) => {
    const card = cardRefs.current[i];
    const slider = sliderRef.current;
    if (!card || !slider) return;
    const left = card.getBoundingClientRect().left - slider.getBoundingClientRect().left + slider.scrollLeft;
    slider.scrollTo({
      left,
      behavior: "smooth",
    });
  }, []);

  const previousSlide = () => scrollToSlide(Math.max(0, activeIndex - 1));
  const nextSlide = () => scrollToSlide(Math.min(items.length - 1, activeIndex + 1));

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = event.pageX;
    scrollStart.current = sliderRef.current?.scrollLeft ?? 0;
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    sliderRef.current.scrollLeft = scrollStart.current - (event.pageX - dragStart.current);
  };

  const stopDragging = () => setIsDragging(false);

  return (
    <section
      className="w-full bg-[#EDE8E2] py-20 md:py-12 border-y border-border/60"
      aria-labelledby="exhibition-heading"
    >
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 px-6 sm:px-10 lg:px-16">
          <p className="text-[11px] px-1 font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            In person
          </p>
          <div className="flex flex-col mt-2 sm:flex-row sm:items-end sm:justify-between">
            <h2
              id="exhibition-heading"
              className="font-[style] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl max-w-sm"
            >
              Exhibitions &amp; pop-ups
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600 max-w-md">
              We love meeting people face to face. Every fair teaches us something.
            </p>
            <div className="hidden items-center gap-3 lg:flex">
              <button
                type="button"
                onClick={previousSlide}
                disabled={activeIndex === 0}
                aria-label="Previous exhibition"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                disabled={activeIndex === items.length - 1}
                aria-label="Next exhibition"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
          className={`flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-6 pb-2 sm:px-10 lg:gap-6 lg:px-16 ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {items.map((ex, i) => (
            <div
              key={ex.title}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="aspect-[3/4] w-[78vw] max-w-[320px] shrink-0 snap-center lg:w-[360px] lg:max-w-none lg:snap-start"
            >
              <ExhibitionCard ex={ex} />
            </div>
          ))}
          <div className="shrink-0 w-6" aria-hidden />
        </div>

        <div className="mt-5 flex justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToSlide(i)}
              aria-label={`Go to exhibition ${i + 1}`}
              className={
                "rounded-full transition-all duration-300 " +
                (i === activeIndex
                  ? "h-2 w-6 bg-foreground/80"
                  : "h-2 w-2 bg-foreground/25 hover:bg-foreground/50")
              }
            />
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
