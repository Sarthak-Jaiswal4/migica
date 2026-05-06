"use client"

import { useEffect } from "react"
import { Star, Heart, Check, Truck, Shield, RotateCcw } from "lucide-react"
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
import { useUserStore, useProductStore } from "@/store/store"
import type { ProductDetail } from "@/store/store"
import { AddToCartButton } from "@/components/AddToCartButton"

export default function ProductPage() {
    const params = useParams()
    const router = useRouter()
    const { toggleWishlist, isInWishlist, recordVisit } = useUserStore()
    const fetchProductPageData = useProductStore((state) => state.fetchProductPageData)
    const productById = useProductStore((state) => state.productById)
    const relatedByProductId = useProductStore((state) => state.relatedByProductId)
    const productsPoolById = useProductStore((state) => state.productsPoolById)
    const loadingById = useProductStore((state) => state.loadingById)

    const id = Array.isArray(params.productID) ? params.productID[0] : params.productID;
    const product: ProductDetail | null = id ? productById[id] : null;
    const relatedProducts = id ? (relatedByProductId[id] ?? []).map(rId => productsPoolById[rId]).filter(Boolean) : [];
    const isLoading = id ? loadingById[id] ?? !product : false;

    useEffect(() => {
        if (!id) return
        fetchProductPageData(id)
    }, [id, fetchProductPageData])

    useEffect(() => {
        if (!product) return
        recordVisit({
            id: product.id,
            name: product.name,
            image: product.image,
        })
    }, [product?.id, product?.name, product?.image, recordVisit])

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

    const wishlisted = isInWishlist(product.id)

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
                                {product.images.slice(0, 2).map((image: { id: string; url: string; alt: string }, index: number) => (
                                    <SwiperSlide key={image.id}>
                                        <div className="w-full">
                                            <Image
                                                src={image.url}
                                                alt={image.alt}
                                                width={1200}
                                                height={1600}
                                                className="w-full h-auto object-contain"
                                                sizes="100vw"
                                                priority={index === 0}
                                            />
                                            {/* {index === 0 && product.originalPrice && (
                                                <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                                                    Save ${(product.originalPrice - product.price).toFixed(2)}
                                                </Badge>
                                            )} */}
                                            {index === 0 && (
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="absolute top-4 right-4 bg-white/90 hover:bg-white"
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
                                                    aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                                                >
                                                    <Heart className={`w-5 h-5 ${wishlisted ? "fill-rose-600 text-rose-600" : ""}`} />
                                                </Button>
                                            )}
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        {/* Desktop: Stacked Vertical Images (Scrolling) */}
                        <div className="hidden lg:flex flex-col gap-6">
                            {product.images.slice(0, 2).map((image: { id: string; url: string; alt: string }, index: number) => (
                                <div
                                    key={image.id}
                                    className="w-full rounded-2xl overflow-hidden shadow-sm border border-neutral-200"
                                >
                                    <Image
                                        src={image.url}
                                        alt={image.alt}
                                        width={1200}
                                        height={1600}
                                        className="w-full h-auto object-contain"
                                        sizes="55vw"
                                        priority={index === 0}
                                    />
                                    {/* {index === 0 && product.originalPrice && (
                                        <Badge className="absolute top-6 left-6 bg-red-500 text-white px-3 py-1 text-sm font-bold shadow-lg">
                                            Save ${(product.originalPrice - product.price).toFixed(2)}
                                        </Badge>
                                    )} */}
                                    {index === 0 && (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="absolute top-6 right-6 bg-white/95 hover:bg-white shadow-md border-none rounded-full h-12 w-12"
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
                                            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                                        >
                                            <Heart className={`w-6 h-6 ${wishlisted ? "fill-rose-600 text-rose-600 border-none" : ""}`} />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Details (Now on the Left — Pinned/Sticky) */}
                        <div className="w-full lg:w-[45%] lg:flex-shrink-0 lg:sticky lg:top-20">
                            <div className="space-y-6">
                            <div>
                                <Badge variant="outline" className="mb-4 px-3 py-1 border-neutral-300 text-neutral-600 bg-white/50 tracking-[0.2em] uppercase text-[10px] font-bold">{product.category}</Badge>
                                <h1 className="font-[style] text-4xl md:text-5xl font-semibold text-neutral-900 mb-3 tracking-tight leading-tight">{product.name}</h1>

                                {/* Rating */}
                                <div className="flex items-center gap-3 mb-5">
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
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-3xl font-normal tracking-tight text-neutral-900">₹{product.price}</span>
                                    {product.originalPrice && (
                                        <span className="text-xl text-neutral-400 line-through decoration-red-400/50 decoration-2">₹{product.originalPrice}</span>
                                    )}
                                </div>

                                <div className="border-l border-neutral-900/20 pl-4 sm:pl-5 mb-4">
                                    <p className="font-[style] text-[20px] font-normal italic leading-[1.65] text-neutral-700 tracking-wide">
                                        {product.description}
                                    </p>
                                </div>
                            </div>

                            {/* Quantity & Add to Cart */}
                            <div className="space-y-6">
                                <AddToCartButton
                                    product={{
                                        id: product.id,
                                        name: product.name,
                                        category: product.category,
                                        price: product.price,
                                        image: product.image,
                                        inStock: product.inStock,
                                    }}
                                    stopClickPropagation={false}
                                    className="max-w-md"
                                />

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
                                <h3 className="font-[style] text-2xl font-medium text-neutral-900 tracking-tight">Premium Features</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {product.features.map((feature: string, index: number) => (
                                        <div key={index} className="flex items-center gap-3 group">
                                            <div className="h-8 w-8 shrink-0 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-all duration-300">
                                                <Check className="w-4 h-4" strokeWidth={2.5} />
                                            </div>
                                            <span className="text-neutral-700 tracking-wide font-medium leading-snug"> {feature}</span>
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
                        <div className="p-6 sm:p-10 border border-neutral-200 rounded-xl sm:rounded-2xl bg-white shadow-sm space-y-6">
                            <div className="prose max-w-none">
                                <p className="text-neutral-700 leading-relaxed tracking-wide text-lg">
                                    {product.description}
                                </p>
                                <h3 className="font-[style] text-2xl font-medium mt-10 mb-5 tracking-tight text-neutral-900">What Makes It Special</h3>
                                <p className="text-neutral-600 leading-relaxed tracking-wide">
                                    {product.name} is part of our living catalog: details and inventory are maintained in our database, while photography is rendered from curated assets in the public gallery so the storefront stays fast and consistent.
                                </p>
                                <p className="text-neutral-600 leading-relaxed tracking-wide mt-4">
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