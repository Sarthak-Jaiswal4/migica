"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "./ui/card"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "./ui/button"
import { useState } from "react"
import { ButtonGroup } from './ui/button-group'
import { useCartStore } from "@/store/store"

export const CardComponent = ({ product, compact = false }: { product: any; compact?: boolean }) => {
    const router = useRouter()
    const [added, setAdded] = useState(false)

    const { addItem, incrementQuantity, decrementQuantity, getItemQuantity, removeItem } = useCartStore()
    const cartvalue = getItemQuantity(product.id)
    const showControls = cartvalue > 0 && !added

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (added) return
        setAdded(true)
        addItem({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
        })
        setTimeout(() => { setAdded(false) }, 1000)
    }

    const decreaseControl = (e: React.MouseEvent) => {
        e.stopPropagation()
        decrementQuantity(product.id)
    }

    const increaseControl = (e: React.MouseEvent) => {
        e.stopPropagation()
        incrementQuantity(product.id)
    }

    return <>
        <Card
            key={product.id}
            className="group rounded-[8px] p-0 border border-neutral-200 shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer relative hover:scale-101"
            onClick={() => router.push(`/product/${product.id}`)}
        >
            {/* Image */}
            <div className={`${compact ? 'h-44 sm:h-64' : 'h-64'} w-full overflow-hidden relative`}>
                <div className="flex w-[200%] h-full transition-transform duration-500 ease-in-out group-hover:-translate-x-1/2">
                    <div className="w-1/2 h-full relative flex-shrink-0">
                        <Image src={product?.image} alt={product.name} className="object-cover" fill sizes="300px" />
                    </div>
                    <div className="w-1/2 h-full relative flex-shrink-0">
                        <Image src={product?.hoverImage || "/jar candle-2.png"} alt={`${product.name} hover`} className="object-cover" fill sizes="300px" />
                    </div>
                </div>
                {!product.inStock && (
                    <Badge className="absolute top-2 right-2 bg-red-500 z-10" variant="destructive">
                        Out of Stock
                    </Badge>
                )}
                {product.rating >= 4.9 && (
                    <Badge className="absolute top-2 left-2 bg-amber-500 text-white z-10">
                        Bestseller
                    </Badge>
                )}
            </div>

            <CardContent className="px-2 sm:px-4 pb-4 sm:pb-6 pt-1">
                <h2 className="text-md sm:text-xl font-bold tracking-tight mb-0.5 sm:mb-1 text-neutral-900 transition-colors line-clamp-1">
                    {product.name}
                </h2>
                <p className="text-neutral-500 font-light tracking-wide text-xs sm:text-sm mb-1.5 sm:mb-3">{product.category}</p>

                {/* Price and Action */}
                <div className="flex items-center justify-between pt-2 px-2 md:px-0 sm:pt-3 border-t border-neutral-200">
                    <div>
                        <p className="hidden sm:block md:text-[12px] font-light tracking-wide text-neutral-500 mb-0.5">Price</p>
                        <span className="text-md sm:text-lg font-normal sm:font-normal tracking-tight text-neutral-900">₹{product.price}</span>
                    </div>
                    <div className="relative h-9 flex items-center">
                        <Button
                            size="sm"
                            disabled={!product.inStock}
                            className={`${product.inStock
                                ? `bg-white text-black shadow-md hover:bg-amber-500 hover:scale-107 hover:text-white hover:cursor-pointer shadow-black/10 ${added ? 'bg-emerald-500 text-white hover:bg-emerald-500' : ''}`
                                : 'bg-neutral-300 cursor-not-allowed text-neutral-500'
                                } transition-all duration-300 px-3 sm:px-4 h-8 sm:h-9 text-sm rounded-full overflow-hidden ${showControls ? 'opacity-0 scale-90 pointer-events-none absolute' : 'opacity-100 scale-100'}`}
                            onClick={handleAddToCart}
                        >
                            <span className="relative block overflow-hidden h-5">
                                <span
                                    className="flex flex-col transition-transform duration-300 ease-in-out"
                                    style={{ transform: added ? 'translateY(-50%)' : 'translateY(0)' }}
                                >
                                    <span className="h-5 flex items-center justify-center whitespace-nowrap">
                                        {product.inStock ? <><span className="hidden sm:inline">Add to cart</span><span className="sm:hidden">Add</span></> : 'Out of stock'}
                                    </span>
                                    <span className="h-5 flex items-center justify-center whitespace-nowrap">
                                        Added ✓
                                    </span>
                                </span>
                            </span>
                        </Button>

                        <div
                            className={`transition-all duration-300 ease-out ${showControls ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none absolute'}`}
                        >
                            <ButtonGroup>
                                <Button variant="outline" size="sm" onClick={decreaseControl}>−</Button>
                                <Button variant="outline" size="sm" className="pointer-events-none min-w-[2rem] justify-center">{cartvalue}</Button>
                                <Button variant="outline" size="sm" onClick={increaseControl}>+</Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </>
}