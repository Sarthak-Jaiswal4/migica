"use client"

import { useRouter } from "next/navigation"
import { CardComponent } from "./Card"
import { bestSellerProducts } from "@/lib/sampledata"

export function BestSelling() {
    const router = useRouter()

    return (
        <div className="py-20 w-full flex flex-col items-center bg-[#F6F4F1]">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Best Sellers</h2>
            <p className="text-neutral-500 mb-12 text-center max-w-2xl">
                Discover our most-loved scents, handcrafted to create the perfect ambiance for your home.
            </p>

            <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {bestSellerProducts.map((product) => (
                        <CardComponent key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    )
}