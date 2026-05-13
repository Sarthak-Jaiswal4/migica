import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "./ui/card"
import { AppImage as Image } from "@/components/AppImage"
import { AddToCartButton } from "@/components/AddToCartButton"
import { WishlistButton } from "@/components/WishlistButton"
import Link from "next/link"

export const CardComponent = ({ product, compact = false }: { product: any; compact?: boolean }) => {
    return (
        <Link href={`/product/${product.slug || product.id}`} className="block h-full w-full outline-none">
            <Card
                className="group rounded-[8px] p-0 border border-neutral-200 shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer relative hover:scale-101 h-full"
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
                <WishlistButton product={product} />
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
                    <div className="flex gap-2 items-center pb-2">
                        <span className="text-md text-neutral-400 line-through decoration-2">₹{699}</span>
                        <span className="text-lg sm:text-lg font-normal sm:font-normal tracking-tight text-neutral-900">₹{product.price}</span>
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