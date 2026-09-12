"use client";

import { useEffect, useState } from "react";
import { HomePageCarouselClient, HeroSlide } from "./HomePageCarouselClient";
import type { HeroMedia } from "@/lib/showcase";

const slides: HeroSlide[] = [
  {
    imageSrc: "/9.1.png",
    imageAlt: "Soft candlelight and shadows in a quiet room", 
    eyebrow: "Silver Star",
    headline: "For the evenings you don't want to end.",
    body: "Hand-poured light, metal and cloth we actually live with — nothing loud, everything meant to stay in the room after you leave.",
    primaryHref: "/shop/all",
    primaryLabel: "Wander the shelves",
  },
  {
    imageSrc: "/8.1.png",
    imageAlt: "Close detail of jewellery and warm tones",
    eyebrow: "Jewellery & ritual",
    headline: "The kind of shine you forget you're wearing.",
    body: "Pieces that catch light at dinner, not under fluorescent aisles. Candles that reward slowing down — emotional buys deserve a feeling first, a cart second.",
    primaryHref: "/shop/jewellery",
    primaryLabel: "See the edit",
  },
];

export function HomePageCarosol() {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(slides);

  useEffect(() => {
    fetch("/api/showcase/hero-media")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (data?.items?.length) {
          setHeroSlides((data.items as HeroMedia[]).map((item) => ({
            imageSrc: item.url,
            mediaType: item.mediaType,
            imageAlt: item.alt || item.title || "Silver Star collection",
            eyebrow: "Silver Star",
            headline: item.title || "For the evenings you don't want to end.",
            body: item.description || "Hand-poured light, metal and cloth we actually live with.",
            primaryHref: "/shop/all",
            primaryLabel: "Wander the shelves",
          })));
        }
      })
      .catch(() => {});
  }, []);

  return <HomePageCarouselClient slides={heroSlides} />;
}
