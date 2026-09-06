"use client";

import { Quote } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    body: "I've bought candles from a dozen brands. Silver Star is the only one where the scent actually matches what's described on the label — Monsoon Oud smells like rain, petrichor, and something almost resinous. Genuinely different.",
    name: "Divya R.",
    detail: "Mumbai · Regular customer since 2021",
    stars: 5,
  },
  {
    body: "Ordered a personalised gifting set for my sister's wedding. Priya replied to my custom-note request within an hour. The packaging was so beautiful the bride cried before even opening it.",
    name: "Arjun M.",
    detail: "Delhi · Wedding gifting",
    stars: 5,
  },
  {
    body: "The linen scarf I bought two years ago has been through two monsoon seasons and countless washes. Still soft, no pilling. I've recommended it to at least eight people.",
    name: "Sonal K.",
    detail: "Pune · Loyal customer",
    stars: 5,
  },
  {
    body: "We stock Silver Star at our Goa property. Guests always ask where the candles are from — it's the first thing they notice in the room. We've reordered four times this year.",
    name: "The Fig & Palm Hotel",
    detail: "Boutique hotel, Goa · B2B partner",
    stars: 5,
  },
  {
    body: "Tried the cedar votives on a whim at the Bangalore pop-up. Now I burn one every evening while working. The throw is small but the mood it sets is something else entirely.",
    name: "Kavya S.",
    detail: "Bengaluru · Studio customer",
    stars: 5,
  },
  {
    body: "What sets Silver Star apart isn't just the product — it's the honesty. No fake five-star theatre, no over-promising. Just really good things made by real people.",
    name: "Rohit & Neha",
    detail: "Chennai · Gift buyers",
    stars: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${count} stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`text-[11px] ${i < count ? "text-amber-500" : "text-neutral-300"}`}>
          ★
        </span>
      ))}
    </span>
  );
}

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <article className="h-full rounded-2xl border border-border/80 bg-card p-6 shadow-sm flex flex-col">
      <Quote className="h-7 w-7 text-amber-900/10 mb-3 shrink-0" strokeWidth={1} aria-hidden />
      <blockquote className="text-sm leading-relaxed text-foreground flex-1">
        &ldquo;{t.body}&rdquo;
      </blockquote>
      <footer className="mt-5 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
        <div>
          <p className="text-sm font-semibold text-foreground">{t.name}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{t.detail}</p>
        </div>
        <Stars count={t.stars} />
      </footer>
    </article>
  );
}

export function AboutTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  function scrollToSlide(i: number) {
    const card = cardRefs.current[i];
    if (!card || !sliderRef.current) return;
    sliderRef.current.scrollTo({ left: card.offsetLeft - 24, behavior: "smooth" });
  }

  return (
    <section
      className="w-full bg-background py-20 md:py-28"
      aria-labelledby="about-testimonials-heading"
    >
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center px-6 sm:px-10 lg:px-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground mb-3">
            Voices we&apos;ve earned
          </p>
          <h2
            id="about-testimonials-heading"
            className="font-[style] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            What people say when they come back
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600">
            We don&apos;t do incentivised reviews. These came in over email, WhatsApp, and
            a note tucked inside a returned shipping box.
          </p>
        </div>

        {/* MOBILE: horizontal snap slider */}
        <div className="lg:hidden">
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2"
            style={{ scrollbarWidth: "none", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="snap-center shrink-0 w-[82vw] max-w-[340px]"
              >
                <TestimonialCard t={t} />
              </div>
            ))}
            <div className="shrink-0 w-6" aria-hidden />
          </div>

          {/* Interactive dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToSlide(i)}
                aria-label={`Go to review ${i + 1}`}
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

        {/* DESKTOP: masonry grid */}
        <div className="hidden lg:block px-16">
          <div className="columns-3 gap-5 space-y-5">
            {testimonials.map((t, i) => (
              <div key={i} className="break-inside-avoid">
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
