"use client";

import Link from "next/link";
import { useState } from "react";
import { SHOP_CATEGORIES, getShopPath } from "@/lib/categories";
import { AppImage as Image } from "@/components/AppImage";

export function CategoryNavDropdown() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const active =
    SHOP_CATEGORIES.find((c) => c.slug === activeSlug) ?? SHOP_CATEGORIES[0];

  return (
    <div className="w-full border-t border-border bg-card" onMouseLeave={() => setActiveSlug(null)}>
      <div className="flex min-h-[350px] w-full gap-0">
      <div className="w-[230px] shrink-0 border-r border-border bg-[#F5EEE8] p-3">
        <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Shop by category</p>
        {SHOP_CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={getShopPath(cat.slug)}
            className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              (activeSlug ?? SHOP_CATEGORIES[0].slug) === cat.slug
                ? "bg-card text-foreground shadow-sm"
                : "text-neutral-600 hover:bg-card/80 hover:text-foreground"
            }`}
            onMouseEnter={() => setActiveSlug(cat.slug)}
          >
            {cat.label}
          </Link>
        ))}
        <Link
          href="/shop/all"
          className="mt-1 block rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-500 hover:bg-card/80 hover:text-foreground"
        >
          View all
        </Link>
      </div>

      <div className="flex min-w-0 flex-1 gap-8 px-8 py-7">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{active.label}</p>
          <p className="mt-2 max-w-md text-sm leading-snug text-neutral-600">{active.description}</p>
          <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-1">
          {active.subcategories.map((sub) => (
            <Link
              key={sub.slug}
              href={getShopPath(active.slug, sub.slug)}
              className="rounded-lg px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-foreground"
            >
              {sub.label}
            </Link>
          ))}
          </div>
          <Link
            href={getShopPath(active.slug)}
            className="mt-5 inline-block text-sm font-semibold text-foreground underline underline-offset-4 hover:text-amber-700"
          >
            Shop all {active.label.toLowerCase()} →
          </Link>
        </div>
        <Link href={getShopPath(active.slug)} className="group relative h-64 w-52 shrink-0 overflow-hidden rounded-2xl bg-muted">
          <Image src={active.image} alt={active.label} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="208px" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-4 pt-12">
            <p className="font-[style] text-2xl font-semibold text-white">{active.label}</p>
            <p className="mt-1 text-xs font-medium text-white/85">Explore collection →</p>
          </div>
        </Link>
      </div>
      </div>
    </div>
  );
}
