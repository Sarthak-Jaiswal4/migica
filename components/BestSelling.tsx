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
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Best Sellers</h2>
            <p className="text-neutral-500 mb-12 font-light tracking-wide text-center max-w-2xl">
                Discover our most-loved scents, handcrafted to create the perfect ambiance for your home.
            </p>

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