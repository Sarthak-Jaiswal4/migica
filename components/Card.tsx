"use client";

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "./ui/card"
import { AppImage as Image } from "@/components/AppImage"
import { AddToCartButton } from "@/components/AddToCartButton"
import { WishlistButton } from "@/components/WishlistButton"
import Link from "next/link"
import type { Product } from "@/lib/product"

type CardProduct = Product | ({ id: string } & Record<string, unknown>);

function getHoverImage(product: {
    image?: string;
    hoverImage?: string;
    images?: string[];
}) {
    if (product.hoverImage) return product.hoverImage;
    const images = product.images ?? [];
    return images.find((url) => url && url !== product.image) ?? images[1] ?? "";
}

export const CardComponent = ({
    product,
    compact = false,
    featured = false,
    hideDescription = false,
}: {
    product: CardProduct;
    compact?: boolean;
    /** A refined card surface for curated home-page edits. */
    featured?: boolean;
    /** Keep dense product shelves focused on the essential purchase details. */
    hideDescription?: boolean;
}) => {
    // Related-product responses have a deliberately loose shape, while the catalogue supplies Product.
    const item = product as Product;
    const hoverImage = getHoverImage(item);

    return (
        <Link href={`/product/${item.slug || item.id}`} className="block h-full w-full outline-none">
            <Card
                className={`group relative h-full cursor-pointer overflow-hidden border-0 p-0 shadow-none transition-all duration-300 ${compact ? "flex flex-col " : ""} ${featured ? "gap-2 rounded-2xl border border-border/70 bg-[#FFFBF7] hover:-translate-y-1 hover:shadow-md" : "rounded-none bg-transparent md:gap-2 gap-2"}`}
            >
                {/* Image */}
                <div className={`${featured ? "h-40 sm:h-52" : compact ? "h-44 sm:h-60" : "h-60"} relative w-full overflow-hidden bg-white`}>
                    <div className="flex w-[200%] h-full transition-transform duration-500 ease-in-out group-hover:-translate-x-1/2">
                        <div className="w-1/2 h-full relative flex-shrink-0">
                            <Image src={item.image} alt={item.name} className="object-cover" fill sizes="300px" />
                        </div>
                        <div className="w-1/2 h-full relative flex-shrink-0">
                            <Image src={hoverImage} alt={`${item.name} hover`} className="object-cover" fill sizes="300px" />
                        </div>
                    </div>
                    {!item.inStock && (
                        <Badge className="absolute bottom-2 left-2 z-10 bg-red-500" variant="destructive">
                            Out of Stock
                        </Badge>
                    )}
                    {item.rating >= 4.9 && (
                        <Badge className="absolute top-2 right-2 bg-black text-white z-10 rounded-full px-3 py-1 text-[11px] font-medium shadow-none border-0">
                            Best Seller
                        </Badge>
                    )}
                    <WishlistButton product={item} />
                </div>

                <CardContent className={`px-0 md:px-[3px] pb-3 pt-2 sm:pb-4 ${compact ? "flex flex-1 flex-col" : ""} ${featured ? "mx-2 pb-3 pt-0 sm:p-4 sm:pt-2" : ""}`}>
                    {/* Subcategory pill */}
                    {item.subcategory && (
                        <div className="flex justify-start md:px-0 mb-1 md:mb-[1px]">
                            <span className="font-medium text-black/60 py-[1px] md:text-[14px] text-[14px] ">
                                {item.subcategory}
                            </span>
                        </div>
                    )}
                    
                    <div className="w-full flex items-left flex-col md:gap-0 gap-1">
                        <h2 className="text-sm sm:text-lg font-medium sm:mb-1 text-foreground transition-colors text-left line-clamp-1">
                            {item.name}
                        </h2>
                        <p className={`mb-2 text-left text-[10px] leading-tight text-muted-foreground line-clamp-1 sm:text-[12px] ${compact || hideDescription ? "hidden" : ""}`}>
                            {item.description || item.category}
                        </p>
                    </div>


                    {/* Price and Action */}
                    <div className={`flex w-full flex-col items-start gap-2 pt-2 sm:gap-0 sm:pt-1 ${compact ? "mt-0 pt-0" : ""} ${featured ? "pt-0" : "pt-1"}`}>
                        <div className="flex items-center gap-2 md:pb-1 sm:pb-0">
                            <span className="text-md sm:text-md font-normal tracking-tight text-foreground">₹{item.price}</span>
                            <span className="text-xs sm:text-sm text-muted-foreground line-through decoration-1">₹{item.originalPrice || 699}</span>
                        </div>
                        <AddToCartButton
                            product={{
                                id: item.id,
                                name: item.name,
                                category: item.category,
                                price: item.price,
                                image: item.image,
                                inStock: item.inStock,
                            }}
                            compact={compact}
                        />
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
