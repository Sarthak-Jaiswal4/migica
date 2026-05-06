"use client";

import { AppImage as Image } from "@/components/AppImage";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination } from "swiper/modules";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type HeroSlide = {
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
  headline: string;
  body: string;
  /** Curiosity-led link — not “Shop now” */
  primaryHref: string;
  primaryLabel: string;
};

const slides: HeroSlide[] = [
  {
    imageSrc: "/9.1.png",
    imageAlt: "Soft candlelight and shadows in a quiet room",
    eyebrow: "Magica",
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
    primaryHref: "/shop/Jewelry",
    primaryLabel: "See the edit",
  },
];

function scrollToCategories() {
  document.getElementById("categories-shop")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HomePageCarosol() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(".parallax-bg", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative h-full min-h-0 w-full bg-black">
      <Swiper
        className="h-full w-full pb-14 [&_.swiper-pagination]:bottom-8 [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:bg-white/40 [&_.swiper-pagination-bullet-active]:w-6 [&_.swiper-pagination-bullet-active]:rounded-full [&_.swiper-pagination-bullet-active]:bg-white"
        modules={[EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={900}
        loop
        pagination={{ clickable: true }}
        slidesPerView={1}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.headline} className="relative h-full w-full overflow-hidden">
            <div className="relative h-full w-full">
              <div className="absolute inset-0 parallax-bg">
                <Image
                  src={slide.imageSrc}
                  alt={slide.imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="100vw"
                  priority={index === 0}
                />
              </div>
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/25 md:bg-gradient-to-r md:from-black/70 md:via-black/35 md:to-black/10"
                aria-hidden
              />

              <div className="absolute inset-0 z-10 flex flex-col justify-end px-6 pb-28 pt-28 sm:px-10 sm:pb-32 md:justify-center md:pb-24 md:pl-14 md:pr-[42%] lg:pl-20">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">{slide.eyebrow}</p>
                <h1 className="mt-4 max-w-xl font-[style] text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
                  {slide.headline}
                </h1>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/85 sm:text-base">{slide.body}</p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                  <Link
                    href={slide.primaryHref}
                    className="group inline-flex w-fit items-center gap-2 border-b border-white/50 pb-1 text-sm font-medium text-white transition hover:border-white"
                  >
                    {slide.primaryLabel}
                    <span className="translate-x-0 transition group-hover:translate-x-1" aria-hidden>
                      →
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={scrollToCategories}
                    className="w-fit text-left text-sm text-white/60 underline-offset-4 transition hover:text-white/90 hover:underline"
                  >
                    What we make — skip ahead
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        type="button"
        onClick={scrollToCategories}
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 text-white/50 transition hover:text-white/90"
        aria-label="Scroll to collections"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.2em]">Scroll</span>
        <ChevronDown className="h-5 w-5 animate-bounce" strokeWidth={1.5} />
      </button>
    </div>
  );
}
