"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "./ui/card"
import { useRouter } from "next/navigation"
import { AppImage as Image } from "@/components/AppImage"
import { Heart } from "lucide-react"
import { useUserStore } from "@/store/store"
import { AddToCartButton } from "@/components/AddToCartButton"

export const CardComponent = ({ product, compact = false }: { product: any; compact?: boolean }) => {
    const router = useRouter()

    const { toggleWishlist, isInWishlist } = useUserStore()
    const wishlisted = isInWishlist(product.id)

    return <>
        <Card
            key={product.id}
            className="group rounded-[8px] p-0 border border-neutral-200 shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer relative hover:scale-101"
            onClick={() => router.push(`/product/${product.id}`)}
        >
            {/* Image */}
            <div className={`${compact ? 'h-40 sm:h-56' : 'h-56'} w-full overflow-hidden relative`}>
                <div className="flex w-[200%] h-full transition-transform duration-500 ease-in-out group-hover:-translate-x-1/2">
                    <div className="w-1/2 h-full relative flex-shrink-0">
                        <Image src={product?.image} alt={product.name} className="object-cover" fill sizes="300px" />
                    </div>
                    <div className="w-1/2 h-full relative flex-shrink-0">
                        <Image src={product?.hoverImage || ""} alt={`${product.name} hover`} className="object-cover" fill sizes="300px" />
                    </div>
                </div>
                {!product.inStock && (
                    <Badge className="absolute bottom-2 left-2 z-10 bg-red-500" variant="destructive">
                        Out of Stock
                    </Badge>
                )}
                {product.rating >= 4.9 && (
                    <Badge className="absolute top-2 left-2 bg-amber-500 text-white z-10">
                        Bestseller
                    </Badge>
                )}
                <button
                    type="button"
                    className="absolute top-2 right-2 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-white/95 shadow-md transition hover:scale-105 hover:bg-white"
                    aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    onClick={(e) => {
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
            </div>

            <CardContent className="px-2 sm:px-3 pb-3 sm:pb-4 pt-1">
                <div className="w-full flex items-center flex-col gap-2">
                    <h2 className="text-sm sm:text-lg font-medium tracking-tight mb-0.5 sm:mb-1 text-neutral-900 transition-colors text-center line-clamp-1">
                        {product.name}
                    </h2>
                    <Badge className=" text-center mb-2" variant="secondary">
                        <p className="text-neutral-500 font-light tracking-wide text-xs sm:text-sm text-center">{product.category}</p>
                    </Badge>
                </div>

                {/* Price and Action */}
                <div className="flex items-center w-full mx-auto flex-col gap-2 sm:gap-0 justify-between pt-2 px-2 md:px-0 sm:pt-3 border-t border-neutral-200">
                    <div>
                        <p className="hidden sm:block md:text-[12px] font-light tracking-wide text-neutral-500 mb-0.5">Price</p>
                        <div className="flex gap-2 items-center">
                            <span className="text-lg sm:text-lg font-normal sm:font-normal tracking-tight text-neutral-900">₹{product.price}</span>
                            <span className="text-md text-neutral-400 line-through decoration-2">₹{699}</span>
                        </div>
                    </div>
                    <AddToCartButton
                        product={{
                            id: product.id,
                            name: product.name,
                            category: product.category,
                            price: product.price,
                            image: product.image,
                            inStock: product.inStock,
                        }}
                        compact={compact}
                    />
                </div>
            </CardContent>
        </Card>
    </>
}