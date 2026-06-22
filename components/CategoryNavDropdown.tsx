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
    <div
      className="flex w-[min(92vw,720px)] gap-0 overflow-hidden rounded-xl border border-border bg-card shadow-lg"
      onMouseLeave={() => setActiveSlug(null)}
    >
      <div className="w-[200px] shrink-0 border-r border-border bg-neutral-50/80 p-2">
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

      <div className="flex min-w-0 flex-1 flex-col p-4">
        <div className="mb-3 flex items-start gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={active.image}
              alt={active.label}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {active.label}
            </p>
            <p className="mt-1 text-sm text-neutral-600 leading-snug">
              {active.description}
            </p>
            <Link
              href={getShopPath(active.slug)}
              className="mt-2 inline-block text-sm font-semibold text-foreground underline-offset-4 hover:underline"
            >
              Shop all {active.label.toLowerCase()} →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1">
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
      </div>
    </div>
  );
}
