"use client"

import { useEffect, useState } from "react"
import { Star, Heart, ShoppingCart, Minus, Plus, Check, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Headers } from "@/components/Headers"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { CardComponent } from "@/components/Card"
import { Footer } from "@/components/Footer"
import { ProductPageSkeleton } from "./ProductPageSkeleton"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode, Mousewheel, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import { useCartStore } from "@/store/store"

export default function ProductPage() {
    const params = useParams()
    const router = useRouter()
    const [product, setProduct] = useState<any>(null)
    const [relatedProducts, setRelatedProducts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isFavorite, setIsFavorite] = useState(false)
    const [added, setAdded] = useState(false)

    const { addItem, incrementQuantity, decrementQuantity, getItemQuantity } = useCartStore()

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const id = Array.isArray(params.productID) ? params.productID[0] : params.productID
                if (!id) return

                const [detailRes, relatedRes] = await Promise.all([
                    fetch(`/api/products/${id}`),
                    fetch(`/api/products?relatedTo=${encodeURIComponent(id)}`),
                ])
                const data = await detailRes.json()
                const relatedJson = await relatedRes.json()

                if (data.product) {
                    const p = data.product
                    const rawUrls = (Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image]).filter(Boolean)
                    const urls = Array.from(new Set(rawUrls as string[]))
                    const mappedProduct = {
                        ...p,
                        id: String(p._id),
                        images: urls.map((url: string, i: number) => ({
                            id: `img-${i}`,
                            url,
                            alt: `${p.name} — ${i + 1}`,
                        })),
                        features:
                            p.features?.length > 0
                                ? p.features
                                : [
                                      "Premium materials",
                                      "Small-batch craftsmanship",
                                      "Thoughtful packaging",
                                      "Designed for everyday ritual",
                                  ],
                        scent: p.scent?.top ? p.scent : { top: "Opening notes", middle: "Heart notes", base: "Base notes" },
                    }
                    setProduct(mappedProduct)
                }

                if (relatedJson.products?.length) {
                    setRelatedProducts(
                        relatedJson.products.map((rp: { _id: string }) => ({
                            ...rp,
                            id: String(rp._id),
                        }))
                    )
                } else {
                    setRelatedProducts([])
                }
            } catch (error) {
                console.error("Failed to fetch product", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProduct()
    }, [params.productID])

    if (isLoading) {
        return <ProductPageSkeleton />
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#F6F4F1] flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                <Button onClick={() => router.push('/shop/all')}>Return to Shop</Button>
            </div>
        )
    }

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

    return (
        <div className="min-h-screen bg-[#F6F4F1]">
            <Headers />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20 overflow-x-clip">
                {/* Breadcrumb */}
                <Breadcrumb className="mb-8">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/shop/all">Shop</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/shop/all">{product.category}</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{product.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex flex-col lg:flex-row gap-12 mb-16 lg:items-start">
                    {/* Images Column */}
                    <div className="w-full lg:w-[55%]">
                        {/* Mobile: Horizontal Swiper */}
                        <div className="lg:hidden">
                            <Swiper
                                modules={[Pagination]}
                                pagination={{ clickable: true }}
                                spaceBetween={20}
                                slidesPerView={1}
                                className="w-full rounded-sm overflow-hidden [&_.swiper-pagination-bullet-active]:!bg-neutral-900"
                            >
                                {product.images.map((image: { id: string; url: string; alt: string }, index: number) => (
                                    <SwiperSlide key={image.id}>
                                        <div className="relative w-full aspect-[3/4]">
                                            <Image
                                                src={image.url}
                                                alt={image.alt}
                                                fill
                                                className="object-cover"
                                                sizes="100vw"
                                                priority={index === 0}
                                            />
                                            {index === 0 && product.originalPrice && (
                                                <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                                                    Save ${(product.originalPrice - product.price).toFixed(2)}
                                                </Badge>
                                            )}
                                            {index === 0 && (
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                                                    onClick={() => setIsFavorite(!isFavorite)}
                                                >
                                                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                                                </Button>
                                            )}
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        {/* Desktop: Stacked Vertical Images (Scrolling) */}
                        <div className="hidden lg:flex flex-col gap-6">
                            {product.images.map((image: { id: string; url: string; alt: string }, index: number) => (
                                <div
                                    key={image.id}
                                    className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden group shadow-sm border border-neutral-200"
                                >
                                    <Image
                                        src={image.url}
                                        alt={image.alt}
                                        fill
                                        className="object-cover transition-transform duration-700 hover:scale-105"
                                        sizes="55vw"
                                        priority={index === 0}
                                    />
                                    {index === 0 && product.originalPrice && (
                                        <Badge className="absolute top-6 left-6 bg-red-500 text-white px-3 py-1 text-sm font-bold shadow-lg">
                                            Save ${(product.originalPrice - product.price).toFixed(2)}
                                        </Badge>
                                    )}
                                    {index === 0 && (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="absolute top-6 right-6 bg-white/95 hover:bg-white shadow-md border-none rounded-full h-12 w-12"
                                            onClick={() => setIsFavorite(!isFavorite)}
                                        >
                                            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500 border-none' : ''}`} />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Details (Now on the Left — Pinned/Sticky) */}
                        <div className="w-full lg:w-[45%] lg:flex-shrink-0 lg:sticky lg:top-32">
                            <div className="space-y-8">
                            <div>
                                <Badge variant="outline" className="mb-4 px-3 py-1 border-neutral-300 text-neutral-600 bg-white/50">{product.category}</Badge>
                                <h1 className="text-4xl md:text-4xl font-bold text-neutral-900 mb-4 tracking-tight leading-tight">{product.name}</h1>

                                {/* Rating */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(product.rating)
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-neutral-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold">{product.rating}</span>
                                    <span className="text-sm text-neutral-500 font-medium">({product.reviews} reviews)</span>
                                </div>

                                {/* Price */}
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="text-2xl font-normal tracking-tight text-neutral-900">₹{product.price}</span>
                                    {product.originalPrice && (
                                        <span className="text-lg text-neutral-400 line-through decoration-red-400/50 decoration-2">₹{product.originalPrice}</span>
                                    )}
                                </div>

                                <p className="text-neutral-600 leading-relaxed text-lg mb-8">
                                    {product.description}
                                </p>
                            </div>

                            {/* Quantity & Add to Cart */}
                            <div className="space-y-6">
                                <div className="relative h-14 flex items-center">
                                    <Button
                                        size="lg"
                                        disabled={!product.inStock}
                                        className={`${product.inStock
                                            ? `bg-black text-white shadow-xl hover:bg-neutral-800 hover:scale-[1.02] ${added ? 'bg-emerald-600 hover:bg-emerald-600' : ''}`
                                            : 'bg-neutral-300 cursor-not-allowed text-neutral-500'
                                            } transition-all duration-300 px-10 h-14 text-lg font-bold rounded-2xl w-full ${showControls ? 'opacity-0 scale-90 pointer-events-none absolute' : 'opacity-100 scale-100'}`}
                                        onClick={handleAddToCart}
                                    >
                                        <span className="relative block overflow-hidden h-7">
                                            <span
                                                className="flex flex-col transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)"
                                                style={{ transform: added ? 'translateY(-50%)' : 'translateY(0)' }}
                                            >
                                                <span className="h-7 flex items-center justify-center whitespace-nowrap">
                                                    {product.inStock ? (
                                                        <span className="flex items-center gap-2">
                                                            <ShoppingCart size={20} /> Add to Cart
                                                        </span>
                                                    ) : 'Out of stock'}
                                                </span>
                                                <span className="h-7 flex items-center justify-center whitespace-nowrap">
                                                    <Check size={20} className="mr-2" /> Added to Collection
                                                </span>
                                            </span>
                                        </span>
                                    </Button>

                                    <div
                                        className={`w-full transition-all duration-300 ease-out ${showControls ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none absolute'}`}
                                    >
                                        <div className="flex items-center justify-between bg-white rounded-2xl border border-neutral-200 p-1 shadow-sm h-14">
                                            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-xl hover:bg-neutral-100" onClick={(e) => decreaseControl(e)}>−</Button>
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs font-bold text-neutral-400 uppercase tracking-tighter">Quantity</span>
                                                <span className="font-bold text-lg leading-tight">{cartvalue}</span>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-xl hover:bg-neutral-100" onClick={increaseControl}>+</Button>
                                        </div>
                                    </div>
                                </div>

                                {product.inStock ? (
                                    <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="font-bold text-sm">Ready to ship — Express delivery available</span>
                                    </div>
                                ) : (
                                    <div className="text-red-600 font-bold bg-red-50 p-4 rounded-xl border border-red-100 text-center">Restocking Magic Soon</div>
                                )}
                            </div>

                            <Separator className="bg-neutral-200" />

                            {/* Features */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-xl text-neutral-900">Premium Features</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {product.features.map((feature: string, index: number) => (
                                        <div key={index} className="flex items-center gap-3 group">
                                            <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                                                <Check className="w-5 h-5" />
                                            </div>
                                            <span className="text-neutral-700 font-medium"> {feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator className="bg-neutral-200" />

                            {/* Shipping Info */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-neutral-100 shadow-sm">
                                    <Truck className="w-6 h-6 mb-2 text-neutral-800" />
                                    <span className="text-[10px] font-black uppercase text-neutral-400 mb-1">Shipping</span>
                                    <span className="text-xs font-bold leading-tight">Free over ₹4,999</span>
                                </div>
                                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-neutral-100 shadow-sm">
                                    <Shield className="w-6 h-6 mb-2 text-neutral-800" />
                                    <span className="text-[10px] font-black uppercase text-neutral-400 mb-1">Warranty</span>
                                    <span className="text-xs font-bold leading-tight">100% Quality</span>
                                </div>
                                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-neutral-100 shadow-sm">
                                    <RotateCcw className="w-6 h-6 mb-2 text-neutral-800" />
                                    <span className="text-[10px] font-black uppercase text-neutral-400 mb-1">Returns</span>
                                    <span className="text-xs font-bold leading-tight">30 Days Easy</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <Tabs defaultValue="description" className="mb-16">
                    <TabsList className="flex h-auto min-h-11 w-full flex-nowrap items-center justify-start gap-1 rounded-xl border border-neutral-200 bg-neutral-100/80 p-1 backdrop-blur-sm sm:min-h-12 sm:gap-2 sm:rounded-2xl sm:p-1.5 overflow-y-hidden overflow-x-auto lg:overflow-x-visible [scrollbar-width:thin]">
                        <TabsTrigger
                            value="description"
                            className="h-auto min-h-10 shrink-0 rounded-lg px-3 py-2.5 text-sm whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-md sm:min-h-11 sm:rounded-xl sm:px-6 sm:py-3 sm:text-base"
                        >
                            Description
                        </TabsTrigger>
                        <TabsTrigger
                            value="scent"
                            className="h-auto min-h-10 shrink-0 rounded-lg px-3 py-2.5 text-sm whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-md sm:min-h-11 sm:rounded-xl sm:px-6 sm:py-3 sm:text-base"
                        >
                            Scent Profile
                        </TabsTrigger>
                        <TabsTrigger
                            value="reviews"
                            className="h-auto min-h-10 shrink-0 rounded-lg px-3 py-2.5 text-sm whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-md sm:min-h-11 sm:rounded-xl sm:px-6 sm:py-3 sm:text-base"
                        >
                            Reviews ({product.reviews})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="description" className="mt-6">
                        <div className="p-4 sm:p-8 border border-neutral-200 rounded-xl sm:rounded-2xl bg-white shadow-sm space-y-4">
                            <div className="prose max-w-none">
                                <p className="text-neutral-700 leading-relaxed tracking-wide">
                                    {product.description}
                                </p>
                                <h3 className="text-xl font-semibold mt-6 mb-3">What Makes It Special</h3>
                                <p className="text-neutral-700 leading-relaxed tracking-wide">
                                    {product.name} is part of our living catalog: details and inventory are maintained in our database, while photography is rendered from curated assets in the public gallery so the storefront stays fast and consistent.
                                </p>
                                <p className="text-neutral-700 leading-relaxed tracking-wide">
                                    Read the scent profile and features tabs for specifics. If something feels unclear, reach out before you buy—we are happy to help you pick the right piece.
                                </p>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="scent" className="mt-6">
                        <div className="p-4 sm:p-8 border border-neutral-200 rounded-xl sm:rounded-2xl bg-white shadow-sm">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2 tracking-wide">Top Notes</h3>
                                    <p className="text-neutral-700">{product.scent.top}</p>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold text-lg mb-2 tracking-wide">Middle Notes</h3>
                                    <p className="text-neutral-700">{product.scent.middle}</p>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold text-lg mb-2 tracking-wide">Base Notes</h3>
                                    <p className="text-neutral-700">{product.scent.base}</p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="reviews" className="mt-6">
                        <div className="p-4 sm:p-8 border border-neutral-200 rounded-xl sm:rounded-2xl bg-white shadow-sm space-y-6 tracking-wide">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-5xl font-bold">{product.rating}</span>
                                        <div>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-5 h-5 ${i < Math.floor(product.rating)
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-neutral-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-sm text-neutral-600">{product.reviews} reviews</p>
                                        </div>
                                    </div>
                                </div>
                                <Button variant="outline">Write a Review</Button>
                            </div>

                            <div className="space-y-6">
                                <p className="text-neutral-600 text-center py-8">
                                    No written reviews yet. Aggregate rating reflects catalog metadata from the database.
                                </p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Related Products */}
                <h2 className="text-3xl font-bold tracking-wide mb-6 font-[style]">You May Also Like</h2>
                {relatedProducts.length === 0 ? (
                    <p className="text-neutral-500 text-sm py-4">More items in this category will appear here once they are available.</p>
                ) : (
                    <div className="overflow-hidden">
                        <Swiper
                            modules={[FreeMode, Mousewheel]}
                            slidesPerView="auto"
                            spaceBetween={16}
                            freeMode={{
                                enabled: true,
                                momentum: true,
                                momentumRatio: 0.8,
                                sticky: false,
                            }}
                            mousewheel={{
                                forceToAxis: true,
                            }}
                            grabCursor={true}
                            className="!overflow-visible"
                        >
                            {relatedProducts.map((relatedProduct) => (
                                <SwiperSlide key={relatedProduct.id} style={{ width: "260px" }} className="sm:!w-[300px]">
                                    <CardComponent product={relatedProduct} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}