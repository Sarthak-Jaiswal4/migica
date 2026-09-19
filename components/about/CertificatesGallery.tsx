"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppImage as Image } from "@/components/AppImage";
import type { Certificate } from "@/lib/showcase";

export function CertificatesGallery() {
  const [items, setItems] = useState<Certificate[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/showcase/certificates")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => setItems(data?.items ?? []))
      .catch(() => {});
  }, []);

  if (!items.length) return null;

  const scroll = (direction: 1 | -1) => {
    sliderRef.current?.scrollBy({ left: direction * Math.max(280, sliderRef.current.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section className="w-full overflow-hidden bg-background py-16 sm:py-20" aria-labelledby="certificates-heading">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-end justify-between gap-4 px-6 sm:px-10 lg:px-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Recognition</p>
            <h2 id="certificates-heading" className="mt-2 font-[style] text-3xl font-semibold tracking-tight sm:text-4xl">Certificates &amp; awards</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">Qualifications, awards, and milestones from the journey behind Silver Star.</p>
          </div>
          {items.length > 1 && <div className="hidden shrink-0 gap-2 sm:flex"><button type="button" onClick={() => scroll(-1)} aria-label="Previous certificate" className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition hover:bg-muted"><ChevronLeft size={18} /></button><button type="button" onClick={() => scroll(1)} aria-label="Next certificate" className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition hover:bg-muted"><ChevronRight size={18} /></button></div>}
        </div>
        <div ref={sliderRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:px-10 lg:gap-6 lg:px-16">
          {items.map((item) => <article key={item.id} className="w-[82vw] max-w-[350px] shrink-0 snap-center overflow-hidden rounded-2xl border border-border bg-card shadow-sm sm:w-[340px]">
            <div className="relative aspect-[4/3] bg-muted"><Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width: 640px) 82vw, 340px" /></div>
            <div className="space-y-2 p-5"><p className="text-xs font-medium text-muted-foreground">{[item.issuer, item.awardedOn].filter(Boolean).join(" · ") || "Recognition"}</p><h3 className="font-[style] text-xl font-semibold leading-tight">{item.title}</h3>{item.description && <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>}</div>
          </article>)}
          <div aria-hidden className="w-2 shrink-0" />
        </div>
      </div>
    </section>
  );
}
