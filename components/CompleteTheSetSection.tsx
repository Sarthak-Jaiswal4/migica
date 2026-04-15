"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type BundlePillar = {
  title: string;
  blurb: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
};

const pillars: BundlePillar[] = [
  {
    title: "Candles",
    blurb: "Warm light and scent that anchors the unwrapping moment.",
    href: "/shop/Candles",
    imageSrc: "/2.1.png",
    imageAlt: "Hand-poured candle in glass",
  },
  {
    title: "Scarves",
    blurb: "Soft drape — something to keep on the sofa or wear out the same week.",
    href: "/shop/Scarves",
    imageSrc: "/4.1.png",
    imageAlt: "Folded scarf texture",
  },
  {
    title: "Jewelry",
    blurb: "A small shine that feels personal, not loud.",
    href: "/shop/Jewelry",
    imageSrc: "/6.1.png",
    imageAlt: "Jewellery detail",
  },
];

/**
 * Cross-category bundle framing — nudges AOV without a hard “Buy bundle” SKU.
 */
export function CompleteTheSetSection() {
  return (
    <section className="border-t border-neutral-200/80 bg-[#F6F4F1] py-16 md:py-24" aria-labelledby="complete-set-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">Gifting &amp; sets</p>
          <h2 id="complete-set-heading" className="mt-2 font-[style] text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            Complete the set
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral tracking-wide text-neutral-600 sm:text-base">
            Most people don&apos;t assemble a gift basket themselves — a candle alone is lovely; a candle with something to
            hold and something to wear feels intentional. Mix categories you might not have browsed in one sitting.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {pillars.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm transition hover:border-neutral-300 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] w-full bg-neutral-100">
                <Image src={p.imageSrc} alt={p.imageAlt} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" sizes="(max-width:640px) 100vw, 33vw" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-[style] text-xl font-medium text-neutral-900">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral tracking-wide text-neutral-600">{p.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-amber-900/90">
                  Browse {p.title.toLowerCase()}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-lg text-center text-xs leading-relaxed text-neutral-500">
          Seasonal tip: pair all three for birthdays and Diwali — we see fewer returns when the box tells a little story.
          Explore curated picks in{" "}
          <Link href="/shop/Gift" className="font-medium text-neutral-800 underline-offset-2 hover:underline">
            Gift
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
