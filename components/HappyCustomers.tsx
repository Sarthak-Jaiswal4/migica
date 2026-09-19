"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { AppImage as Image } from "@/components/AppImage";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HappyCustomer } from "@/lib/showcase";

/* ─── Data ──────────────────────────────────────────────────────── */
const FALLBACK_PHOTOS: HappyCustomer[] = [
  {
    id: "fallback-1",
    image: "/my.jpeg",
    name: "Ananya S.",
    caption: "My birthday haul 🕯️",
    order: 0,
  },
  {
    id: "fallback-2", image: "/my-1.jpeg",
    name: "Riya M.",
    caption: "Gifted to my mom — she cried!",
    order: 1,
  },
  {
    id: "fallback-3", image: "/my-2.jpeg",
    name: "Divya K.",
    caption: "Obsessed with the scent ✨",
    order: 2,
  },
  {
    id: "fallback-4", image: "/my-3.jpeg",
    name: "Sneha P.",
    caption: "My vanity is complete now",
    order: 3,
  },
  {
    id: "fallback-5", image: "/my-4.jpeg",
    name: "Priya A.",
    caption: "Worth every rupee 💛",
    order: 4,
  },
  {
    id: "fallback-6", image: "/my-5.jpeg",
    name: "Meena R.",
    caption: "Already reordering!",
    order: 5,
  },
  {
    id: "fallback-7", image: "/WhatsApp Image 2026-01-06 at 2.15.23 AM.jpeg",
    name: "Kavya T.",
    caption: "Festival gifting sorted 🎁",
    order: 6,
  },
  {
    id: "fallback-8", image: "/WhatsApp Image 2026-01-06 at 2.15.25 AM.jpeg",
    name: "Pooja N.",
    caption: "The packaging alone!",
    order: 7,
  },
  {
    id: "fallback-9", image: "/WhatsApp Image 2026-01-08 at 2.21.58 PM.jpeg",
    name: "Isha V.",
    caption: "My whole mood board 🌸",
    order: 8,
  },
];

/* ─── Component ─────────────────────────────────────────────────── */
export function HappyCustomers() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [photos, setPhotos] = useState<HappyCustomer[]>(FALLBACK_PHOTOS);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef(0);
  const scrollStart = useRef(0);

  useEffect(() => {
    fetch("/api/showcase/happy-customers")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (data?.items?.length) setPhotos(data.items as HappyCustomer[]);
      })
      .catch(() => {});
  }, []);

  /* Update active dot based on scroll progress from 1st to last card */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= 0) {
        setActiveIdx(0);
        return;
      }
      const progress = Math.max(0, Math.min(1, track.scrollLeft / maxScroll));
      const newIdx = Math.min(
        photos.length - 1,
        Math.max(0, Math.round(progress * (photos.length - 1)))
      );
      setActiveIdx(newIdx);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();

    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [photos.length]);

  const scrollTo = useCallback((idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 0) return;
    const targetLeft = (idx / Math.max(photos.length - 1, 1)) * maxScroll;
    track.scrollTo({ left: targetLeft, behavior: "smooth" });
  }, [photos.length]);

  const prev = () => scrollTo(Math.max(0, activeIdx - 1));
  const next = () => scrollTo(Math.min(photos.length - 1, activeIdx + 1));

  /* Mouse drag-to-scroll */
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = e.pageX;
    scrollStart.current = trackRef.current?.scrollLeft ?? 0;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    trackRef.current.scrollLeft = scrollStart.current - (e.pageX - dragStart.current);
  };
  const onMouseUp = () => setIsDragging(false);

  return (
    <section
      className="py-12 md:py-12 overflow-hidden bg-[#FDFAF7]"
      aria-labelledby="happy-customers-heading"
    >
      {/* ── Header ── */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9956C] mb-2">
            Real orders · Real people
          </p>
          <h2
            id="happy-customers-heading"
            className="font-[style] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            Happy customers
          </h2>
          <p className="mt-2 text-sm text-[#8C6E5D] max-w-xs">
            Shared by the people who brought Silver Star home.
          </p>
        </div>

        {/* Arrow buttons — desktop */}
        <div className="hidden sm:flex items-center gap-3 pb-1">
          <button
            type="button"
            onClick={prev}
            disabled={activeIdx === 0}
            aria-label="Previous photo"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8D5C8] bg-white text-[#8C6E5D] shadow-sm transition hover:bg-[#F4EFE8] hover:text-[#C9956C] disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={next}
            disabled={activeIdx === photos.length - 1}
            aria-label="Next photo"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8D5C8] bg-white text-[#8C6E5D] shadow-sm transition hover:bg-[#F4EFE8] hover:text-[#C9956C] disabled:opacity-30 cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* ── Slider track ── */}
      <div
        ref={trackRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        className={`flex gap-6 overflow-x-auto scroll-smooth px-4 sm:px-6 lg:px-8
          scrollbar-none pb-8 select-none
          ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          scrollSnapType: "x mandatory",
        }}
      >
        {/* Leading spacer to centre-align on wide screens */}
        <div className="shrink-0 w-[calc((100vw-min(100vw,80rem))/2)] hidden lg:block" />

        {photos.map((photo, i) => (
          <div
            key={i}
            className={`
              shrink-0 w-[220px] sm:w-[240px] md:w-[260px]
              transition-transform duration-300
              hover:-translate-y-2 hover:scale-[1.03] hover:z-10
            `}
            style={{ scrollSnapAlign: "start" }}
          >
            {/* Polaroid card */}
            <div className="relative bg-white rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.10)] p-3 pb-12">
              {/* Photo */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F4EFE8]">
                <Image
                  src={photo.image}
                  alt={`${photo.name} — happy Silver Star customer`}
                  fill
                  sizes="260px"
                  className="object-cover"
                  draggable={false}
                />
              </div>
              {/* Caption area (inside the white polaroid border) */}
              <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5">
                <p className="text-[11px] font-semibold text-foreground truncate">{photo.name}</p>
                <p className="text-[10px] text-[#8C6E5D] truncate">{photo.caption}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Trailing spacer */}
        <div className="shrink-0 w-4" />
      </div>

      {/* ── Dot indicators ── */}
      <div className="mt-4 flex justify-center gap-1.5 px-4">
        {photos.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollTo(i)}
            aria-label={`Go to photo ${i + 1}`}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              i === activeIdx
                ? "w-6 h-2 bg-[#C9956C]"
                : "w-2 h-2 bg-[#E8D5C8] hover:bg-[#C9956C]/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
