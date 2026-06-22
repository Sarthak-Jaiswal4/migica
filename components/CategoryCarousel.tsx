"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { CardComponent } from "./Card";
import type { Product } from "@/lib/product";

export function CategoryCarousel({ products }: { products: Product[] }) {
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
      {products.map((product) => (
        <SwiperSlide key={product.id} style={{ width: "260px" }}>
          <CardComponent product={product} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
