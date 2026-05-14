"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";
import { CardComponent } from "@/components/Card";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProduct = { id: string } & Record<string, any>;

export function ProductRelatedSwiper({ products }: { products: AnyProduct[] }) {
    if (products.length === 0) {
        return (
            <p className="text-muted-foreground text-sm py-4">
                More items in this category will appear here once they are available.
            </p>
        );
    }

    return (
        <div className="overflow-hidden">
            <Swiper
                modules={[FreeMode, Mousewheel]}
                slidesPerView="auto"
                spaceBetween={16}
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
                className="!overflow-visible"
            >
                {products.map((product) => (
                    <SwiperSlide key={product.id} style={{ width: "260px" }} className="sm:!w-[300px]">
                        <CardComponent product={product} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
