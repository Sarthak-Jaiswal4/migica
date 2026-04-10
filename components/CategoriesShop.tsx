"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { CardComponent } from "./Card"
import { candleProducts, scarfProducts, jewelryProducts, giftProducts, tShirtProducts, type Product } from "@/lib/sampledata"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode, Mousewheel } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"

const categories = [
    { name: "Candles", products: candleProducts },
    { name: "Fashion Accessories", products: scarfProducts },
    { name: "Handmade Jewelry", products: jewelryProducts },
    { name: "Custom Gifts", products: giftProducts },
    { name: "Custom T-Shirts", products: tShirtProducts },
]

export function CategoriesShop() {
    return (
        <section className="py-1 bg-[#F6F4F1] overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-neutral-900 mb-4">Shop by Category</h2>
                    <p className="text-neutral-500 max-w-2xl mx-auto">Explore our curated collections of artisanal candles, elegant scarves, and timeless jewelry.</p>
                </div>
            </div>

            <div className="flex flex-col gap-10">
                {categories.map((cat) => (
                    <CategoryRow key={cat.name} name={cat.name} products={cat.products} />
                ))}
            </div>
        </section>
    )
}

function CategoryRow({ name, products }: { name: string; products: Product[] }) {
    const router = useRouter()

    return (
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 bg-gray-200 rounded-lg pt-8 pb-4">
            {/* Category header */}
            <div className="mb-8 flex flex-row md:items-end justify-between gap-4">
                <div>
                    <h3 className="text-2xl md:text-4xl tracking-tight font-bold text-neutral-900">{name}</h3>
                    <p className="text-sm text-neutral-400 mt-1">{products.length} items</p>
                </div>
                <Button
                    variant="outline"
                    className="self-start md:self-auto group rounded-full px-6 h-10 text-sm font-semibold border-neutral-300 hover:bg-neutral-100 hover:text-neutral-900 transition-all active:scale-95 hover:cursor-pointer"
                    onClick={() => router.push(`/shop/${name}`)}
                >
                    <span className="relative flex items-center justify-center h-5 overflow-hidden">
                        <span className="flex items-center transition-transform duration-300 ease-in-out group-hover:translate-x-5 pr-5">
                            <span className="absolute -left-5 flex w-5 items-center justify-center">
                                →
                            </span>
                            <span className="whitespace-nowrap">View All</span>
                            <span className="absolute right-0 flex w-5 items-center justify-center">
                                →
                            </span>
                        </span>
                    </span>
                </Button>
            </div>

            {/* Horizontal swipeable row */}
            <div className="mb-6">
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
                        <SwiperSlide key={product.id} style={{ width: "300px" }}>
                            <CardComponent product={product} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}
