"use client";
import { useRef } from "react";

const milestones = [
  {
    year: "2019",
    title: "The first pour",
    body: "Priya hand-poured 20 candles in her Mumbai apartment kitchen. Half went to friends, half sold at a local weekend market in 45 minutes.",
    tag: "Origin",
  },
  {
    year: "2020",
    title: "Finding the formula",
    body: "Lockdown turned the living room into a full-scale fragrance lab. Over 80 test batches led to the signature soy-wax blend still used today.",
    tag: "R&D",
  },
  {
    year: "2021",
    title: "Going full-time",
    body: "Priya quit her design role, rented a small studio in Bandra, and hired her first helper. Silver Star registered as a proper business.",
    tag: "Studio",
  },
  {
    year: "2022",
    title: "Expanding beyond candles",
    body: "The first linen scarf dropped — sourced from a Rajasthan weaver Priya met at a craft fair. It sold out in 72 hours.",
    tag: "Expansion",
  },
  {
    year: "2023",
    title: "First national stockist",
    body: "A boutique hotel chain in Goa selected Silver Star as their in-room amenity. Orders scaled, but batch sizes stayed small.",
    tag: "Wholesale",
  },
  {
    year: "2024",
    title: "Jewellery & gifts",
    body: "Collaboration with two independent jewellers brought brass and silver pieces into the catalogue. Complete gifting sets launched for Diwali.",
    tag: "Collections",
  },
  {
    year: "2025",
    title: "Online flagship",
    body: "Silverstar.live launched. 500 orders in the first month. Same care, same batch sizes — now shipped across India.",
    tag: "Digital",
  },
  {
    year: "2026",
    title: "What's next",
    body: "A new fragrance lab in Pune, workshop events, and the first international shipping trials. The kitchen table feels very far away — in the best way.",
    tag: "Future",
  },
];

export function JourneyTimeline() {
  return (
    <section
      id="journey"
      className="w-full bg-background py-20 md:py-28"
      aria-labelledby="journey-heading"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground mb-3">
            The journey
          </p>
          <h2
            id="journey-heading"
            className="font-[style] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            From a kitchen table to across India
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
            Every year added something — a new scent, a new collaborator, a new lesson in patience.
            Here's how Silver Star has grown.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Central line — hidden on mobile, shown md+ */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

          <div className="space-y-10 md:space-y-0">
            {milestones.map((m, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={m.year}
                  className={`relative flex flex-col md:flex-row md:items-center gap-6 md:gap-0 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Card */}
                  <div
                    className={`md:w-[calc(50%-2rem)] ${
                      isLeft ? "md:pr-8 md:text-right" : "md:pl-8"
                    }`}
                  >
                    <div className="group rounded-2xl border border-border/80 bg-card p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className={`flex items-center gap-2 mb-3 ${isLeft ? "md:justify-end" : ""}`}>
                        <span className="rounded-full bg-[#C9956C]/10 border border-[#C9956C]/20 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#C9956C]">
                          {m.tag}
                        </span>
                      </div>
                      <h3 className="font-[style] text-lg font-semibold text-foreground">{m.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-600">{m.body}</p>
                    </div>
                  </div>

                  {/* Year dot */}
                  <div className="md:absolute md:left-1/2 md:-translate-x-1/2 flex-shrink-0 flex flex-col items-center md:items-center gap-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9956C] text-white shadow-md ring-4 ring-background text-[11px] font-bold">
                      {m.year.slice(2)}
                    </div>
                    <p className="text-[11px] font-bold text-foreground tracking-tight">{m.year}</p>
                  </div>

                  {/* Empty spacer for opposite side */}
                  <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
