"use client";

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "./ui/card"
import { AppImage as Image } from "@/components/AppImage"
import { AddToCartButton } from "@/components/AddToCartButton"
import { WishlistButton } from "@/components/WishlistButton"
import Link from "next/link"

function getHoverImage(product: {
    image?: string;
    hoverImage?: string;
    images?: string[];
}) {
    if (product.hoverImage) return product.hoverImage;
    const images = product.images ?? [];
    return images.find((url) => url && url !== product.image) ?? images[1] ?? "";
}

export const CardComponent = ({ product, compact = false }: { product: any; compact?: boolean }) => {
    const hoverImage = getHoverImage(product);

    return (
        <Link href={`/product/${product.slug || product.id}`} className="block h-full w-full outline-none">
            <Card
                className="group rounded-none p-0 border-0 shadow-none bg-transparent overflow-hidden transition-all duration-300 cursor-pointer relative h-full"
            >
                {/* Image */}
                <div className={`${compact ? 'h-44 sm:h-60' : 'h-60'} w-full overflow-hidden relative bg-white`}>
                    <div className="flex w-[200%] h-full transition-transform duration-500 ease-in-out group-hover:-translate-x-1/2">
                        <div className="w-1/2 h-full relative flex-shrink-0">
                            <Image src={product?.image} alt={product.name} className="object-cover" fill sizes="300px" />
                        </div>
                        <div className="w-1/2 h-full relative flex-shrink-0">
                            <Image src={hoverImage} alt={`${product.name} hover`} className="object-cover" fill sizes="300px" />
                        </div>
                    </div>
                    {!product.inStock && (
                        <Badge className="absolute bottom-2 left-2 z-10 bg-red-500" variant="destructive">
                            Out of Stock
                        </Badge>
                    )}
                    {product.rating >= 4.9 && (
                        <Badge className="absolute top-2 right-2 bg-black text-white z-10 rounded-full px-3 py-1 text-[11px] font-medium shadow-none border-0">
                            Best Seller
                        </Badge>
                    )}
                    <WishlistButton product={product} />
                </div>

                <CardContent className="px-2 sm:px-3 pb-3 sm:pb-4 pt-1">
                    <div className="w-full flex items-left flex-col gap-1">
                        <h2 className="text-sm sm:text-lg font-medium sm:mb-1 text-foreground transition-colors text-left line-clamp-1">
                            {product.name}
                        </h2>
                        <p className="text-muted-foreground text-[10px] sm:text-[12px] leading-tight text-left line-clamp-1 mb-2">
                            {product.description || product.category}
                        </p>
                    </div>

                    {/* Subcategory pill */}
                    {product.subcategory && (
                        <div className="flex justify-start px-2 md:px-0 mb-1.5">
                            <span className="font-[style] inline-flex items-center rounded-full border border-[#E8D5C8] bg-[#F7F0EA] px-3 py-1 text-[11px] sm:text-[12px] font-semibold tracking-wider text-[#8C6E5D]">
                                {product.subcategory}
                            </span>
                        </div>
                    )}

                    {/* Price and Action */}
                    <div className="flex items-start w-full flex-col gap-2 sm:gap-0 pt-2 px-2 md:px-0 sm:pt-2">
                        <div className="flex items-center gap-2 pb-2">
                            <span className="text-lg sm:text-lg font-semibold tracking-tight text-foreground">₹{product.price}</span>
                            <span className="text-xs sm:text-sm text-muted-foreground line-through decoration-2">₹{product.originalPrice || 699}</span>
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
        </Link>
    )
}