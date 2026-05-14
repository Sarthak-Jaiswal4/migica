"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { AppImage as Image } from "@/components/AppImage";
import { WishlistButtonMobile } from "./ProductInteractions";

type ImageItem = { id: string; url: string; alt: string };

type ProductBasic = {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
    inStock: boolean;
};

export function ProductImageCarouselMobile({
    images,
    product,
}: {
    images: ImageItem[];
    product: ProductBasic;
}) {
    return (
        <div className="lg:hidden">
            <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                spaceBetween={20}
                slidesPerView={1}
                className="w-full rounded-sm overflow-hidden [&_.swiper-pagination-bullet-active]:!bg-neutral-900"
            >
                {images.slice(0, 2).map((image, index) => (
                    <SwiperSlide key={image.id}>
                        <div className="w-full">
                            <Image
                                src={image.url}
                                alt={image.alt}
                                width={1200}
                                height={1600}
                                className="w-full h-auto object-contain"
                                sizes="100vw"
                                priority={index === 0}
                            />
                            {index === 0 && <WishlistButtonMobile product={product} />}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
