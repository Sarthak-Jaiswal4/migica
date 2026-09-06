"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import Link from "next/link";
import Image from "next/image";
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
      href: "/shop/candles",
      imageSrc: "/2.1.png",
      imageAlt: "Hand-poured candle in glass",
    },
    {
      title: "Scarves",
      blurb: "Soft drape — something to keep on the sofa or wear out the same week.",
      href: "/shop/scarves",
      imageSrc: "/Gemini_Generated_Image_32dxqr32dxqr32dx.png",
      imageAlt: "Folded scarf texture",
    },
    {
      title: "Jewelry",
      blurb: "A personal touch of shine, thoughtfully designed to add subtle elegance to your everyday style.",
      href: "/shop/jewellery",
      imageSrc: "/Gemini_Generated_Image_5s7v95s7v95s7v95.png",
      imageAlt: "Jewellery detail",
    },
];

export function SetCarousel() {
  return (
    <Swiper
      modules={[FreeMode, Mousewheel]}
      slidesPerView="auto"
      spaceBetween={24}
      freeMode={{
        enabled: true,
        momentum: true,
        momentumRatio: 0.8,
        sticky: false,
      }}
      mousewheel={{
        forceToAxis: true,
      }}
      grabCursor={true}
    >
      {pillars.map((p) => (
        <SwiperSlide style={{ width: "260px" }}>
          <div className="mt-12 grid gap-5">
            <Link
              key={p.title}
              href={p.href}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/90 bg-card shadow-sm transition hover:border-neutral-300 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] w-full bg-neutral-100">
                <Image src={p.imageSrc} alt={p.imageAlt} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" sizes="(max-width:640px) 100vw, 33vw" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-[style] text-xl font-medium text-foreground">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral tracking-wide text-neutral-600">{p.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-amber-900/90">
                  Browse {p.title.toLowerCase()}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                </span>
              </div>
            </Link>
        </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}