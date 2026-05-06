"use client"

import { useRouter } from "next/navigation"
import { CardComponent } from "./Card"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export function BestSelling() {
    const router = useRouter()
    const [products, setProducts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const res = await fetch('/api/products')
                const data = await res.json()
                if (data.products) {
                    // Get top 4 rated products dynamically
                    const topRated = data.products
                        .sort((a: { rating: number; reviews: number }, b: { rating: number; reviews: number }) => b.rating - a.rating || b.reviews - a.reviews)
                        .slice(0, 4)
                        .map((p: { _id: string }) => ({ ...p, id: String(p._id) }))
                        
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
        <div className="py-20 w-full flex flex-col items-center bg-[#F6F4F1]">
            <div className="mx-auto max-w-2xl text-center mb-12 px-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">Customer Favorites</p>
                <h2 className="mt-2 font-[style] text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                    Best Sellers
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-neutral tracking-wide text-neutral-600 sm:text-base">
                    Discover our most-loved scents, handcrafted to create the perfect ambiance for your home.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 w-full">
                {isLoading ? (
                    <div className="flex justify-center text-neutral-500">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <CardComponent key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}