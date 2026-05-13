"use client"

import { Heart } from "lucide-react"
import { useUserStore } from "@/store/store"

export const WishlistButton = ({ product }: { product: any }) => {
    const { toggleWishlist, isInWishlist } = useUserStore()
    const wishlisted = isInWishlist(product.id)

    return (
        <button
            type="button"
            className="absolute top-2 right-2 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-card/95 shadow-md transition hover:scale-105 hover:bg-card"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleWishlist({
                    id: product.id,
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    image: product.image,
                    inStock: product.inStock,
                })
            }}
        >
            <Heart
                className={`h-4 w-4 ${wishlisted ? "fill-rose-600 text-rose-600" : "text-neutral-700"}`}
                strokeWidth={2}
            />
        </button>
    )
}
