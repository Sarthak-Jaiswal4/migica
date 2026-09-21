"use client"

import { CardComponent } from "./Card"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import type { Product } from "@/lib/product"

type ApiProduct = Product & { _id?: string };

export function BestSelling({ embedded = false }: { embedded?: boolean }) {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const res = await fetch('/api/products')
                const data: { products?: ApiProduct[] } = await res.json()
                if (data.products) {
                    // Get top 4 rated products dynamically
                    const topRated = data.products
                        .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
                        .slice(0, 4)
                        .map((p) => ({ ...p, id: String(p._id ?? p.id) }))
                        
                    setProducts(topRated)
                }
            } catch (error) {
                console.error("Failed to fetch products", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchBestSellers()
    }, [])

    return (
        <section className={`w-full bg-background px-4 md:px-8 ${embedded ? "py-4" : "py-20"}`} aria-labelledby="best-sellers-heading">
            <div className="mx-auto max-w-[1280px] overflow-hidden rounded-[28px] bg-[#B76B4B] px-4 py-8 text-[#FFF9F4] shadow-sm sm:px-7 sm:py-10 lg:rounded-[34px] lg:px-9">
                <div className="relative">
                    <div className="pointer-events-none absolute -right-24 inset-y-0 w-[42%] -skew-x-12 bg-[#7B3D2A]/25" />
                    <div className="pointer-events-none absolute bottom-0 left-0 h-[38%] w-full bg-[#8F4B34]/15" />
                    <div className="pointer-events-none absolute right-[24%] top-0 h-full w-px bg-[#FFF4EB]/25" />
                    <div className="pointer-events-none absolute right-[31%] top-0 h-full w-px bg-[#FFF4EB]/15" />

                    <div className="relative mx-auto mb-7 max-w-2xl text-center sm:mb-9">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#FFE5D5]">Customer favorites</p>
                        <h2 id="best-sellers-heading" className="mt-2 font-[style] text-3xl font-semibold tracking-tight sm:text-4xl">
                            Best Sellers
                        </h2>
                        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#FFE5D5] sm:text-base">
                            The pieces customers return to — made for gifting, keeping, and using on repeat.
                        </p>
                    </div>

                    <div className="relative mx-auto w-full max-w-[1200px]">
                {isLoading ? (
                    <div className="flex justify-center text-[#FFE5D5]">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
                        {products.map((product) => (
                            <CardComponent key={product.id} product={product} compact featured hideDescription />
                        ))}
                    </div>
                )}
                    </div>
                </div>
            </div>
        </section>
    )
}
