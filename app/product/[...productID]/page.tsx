"use client"

import { useState } from "react"
import { Star, Heart, Share2, ShoppingCart, Minus, Plus, Check, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Headers } from "@/components/Headers"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CardComponent } from "@/components/Card"
import { Footer } from "@/components/Footer"
import { featuredProduct, reviews, relatedProducts } from "@/lib/sampledata"
import { ButtonGroup } from "@/components/ui/button-group"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode, Mousewheel, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import { useCartStore } from "@/store/store"

const product = featuredProduct

export default function ProductPage() {
    const [isFavorite, setIsFavorite] = useState(false)
    const router = useRouter()
    const [added, setAdded] = useState(false)

    const { addItem, incrementQuantity, decrementQuantity, getItemQuantity } = useCartStore()
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
        <div className="min-h-screen bg-[#F6F4F1] overflow-x-hidden">
            <Headers />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
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

                <div className="flex flex-col lg:flex-row gap-12 mb-16">
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
                                {product.images.map((image, index) => (
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

                        {/* Desktop: Stacked Vertical Images */}
                        <div className="hidden lg:flex flex-col gap-4">
                            {product.images.map((image, index) => (
                                <div
                                    key={image.id}
                                    className="relative w-full aspect-[3/4] rounded-md overflow-hidden group"
                                >
                                    <Image
                                        src={image.url}
                                        alt={image.alt}
                                        fill
                                        className="object-cover transition-transform duration-700"
                                        sizes="55vw"
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
                            ))}
                        </div>
                    </div>

                    {/* Product Details — Sticky Right */}
                    <div className="w-full lg:w-[45%] lg:flex-shrink-0">
                        <div className="lg:sticky lg:top-24 space-y-6">
                            <div>
                                <Badge variant="outline" className="mb-3">{product.category}</Badge>
                                <h1 className="text-4xl font-semibold text-neutral-900 mb-2">{product.name}</h1>

                                {/* Rating */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(product.rating)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-neutral-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm font-medium">{product.rating}</span>
                                    <span className="text-sm text-neutral-600">({product.reviews} reviews)</span>
                                </div>

                                {/* Price */}
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-2xl font-normal">${product.price}</span>
                                    {product.originalPrice && (
                                        <span className="text-md text-neutral-400 line-through">${product.originalPrice}</span>
                                    )}
                                </div>

                                <p className="text-neutral-700 leading-relaxed tracking-wide mb-6">
                                    {product.description}
                                </p>
                            </div>

                            {/* Quantity & Add to Cart */}
                            <div className="space-y-4">
                                <div className="relative h-12 flex items-center">
                                    <Button
                                        size="lg"
                                        disabled={!product.inStock}
                                        className={`${product.inStock
                                            ? `bg-white text-black shadow-md hover:bg-amber-500 hover:scale-107 hover:text-white hover:cursor-pointer shadow-black/10 ${added ? 'bg-emerald-500 text-white hover:bg-emerald-500' : ''}`
                                            : 'bg-neutral-300 cursor-not-allowed text-neutral-500'
                                            } transition-all duration-300 px-8 h-12 text-base rounded-full overflow-hidden ${showControls ? 'opacity-0 scale-90 pointer-events-none absolute' : 'opacity-100 scale-100'}`}
                                        onClick={handleAddToCart}
                                    >
                                        <span className="relative block overflow-hidden h-6">
                                            <span
                                                className="flex flex-col transition-transform duration-300 ease-in-out"
                                                style={{ transform: added ? 'translateY(-50%)' : 'translateY(0)' }}
                                            >
                                                <span className="h-6 flex items-center justify-center whitespace-nowrap">
                                                    {product.inStock ? 'Add to cart' : 'Out of stock'}
                                                </span>
                                                <span className="h-6 flex items-center justify-center whitespace-nowrap">
                                                    Added ✓
                                                </span>
                                            </span>
                                        </span>
                                    </Button>

                                    <div
                                        className={`transition-all duration-300 ease-out ${showControls ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none absolute'}`}
                                    >
                                        <ButtonGroup>
                                            <Button variant="outline" size="default" className="h-10 w-10 text-base" onClick={(e) => decreaseControl(e) }>−</Button>
                                            <Button variant="outline" size="default" className="pointer-events-none min-w-[3rem] h-10 text-base justify-center">{cartvalue}</Button>
                                            <Button variant="outline" size="default" className="h-10 w-10 text-base" onClick={increaseControl}>+</Button>
                                        </ButtonGroup>
                                    </div>
                                </div>

                                {product.inStock ? (
                                    <div className="flex items-center gap-2 text-green-600">
                                        <Check className="w-5 h-5" />
                                        <span className="font-medium">In Stock - Ships within 24 hours</span>
                                    </div>
                                ) : (
                                    <div className="text-red-600 font-medium">Out of Stock</div>
                                )}
                            </div>

                            <Separator />

                            {/* Features */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-lg">Key Features</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {product.features.map((feature, index) => (
                                        <div key={index} className="flex items-start gap-2">
                                            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-neutral-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            {/* Shipping Info */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-neutral-50">
                                    <Truck className="w-6 h-6 mb-2 text-neutral-700" />
                                    <span className="text-sm font-medium">Free Shipping</span>
                                    <span className="text-xs text-neutral-600">Orders over $50</span>
                                </div>
                                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-neutral-50">
                                    <Shield className="w-6 h-6 mb-2 text-neutral-700" />
                                    <span className="text-sm font-medium">Quality Guarantee</span>
                                    <span className="text-xs text-neutral-600">Premium materials</span>
                                </div>
                                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-neutral-50">
                                    <RotateCcw className="w-6 h-6 mb-2 text-neutral-700" />
                                    <span className="text-sm font-medium">30-Day Returns</span>
                                    <span className="text-xs text-neutral-600">Hassle-free</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <Tabs defaultValue="description" className="mb-16">
                    <TabsList className="w-full justify-start h-14 sm:h-16 p-0.5 bg-neutral-100/80 backdrop-blur-sm border border-neutral-200 rounded-xl sm:rounded-2xl gap-1 sm:gap-2 overflow-x-auto">
                        <TabsTrigger
                            value="description"
                            className="rounded-lg sm:rounded-xl px-3 sm:px-6 py-3 sm:py-5 text-sm sm:text-base whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-neutral-900 transition-all duration-300"
                        >
                            Description
                        </TabsTrigger>
                        <TabsTrigger
                            value="scent"
                            className="rounded-lg sm:rounded-xl px-3 sm:px-6 py-3 sm:py-5 text-sm sm:text-base whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-neutral-900 transition-all duration-300"
                        >
                            Scent Profile
                        </TabsTrigger>
                        <TabsTrigger
                            value="reviews"
                            className="rounded-lg sm:rounded-xl px-3 sm:px-6 py-3 sm:py-5 text-sm sm:text-base whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-neutral-900 transition-all duration-300"
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
                                    Our Lavender Dream candle is more than just a source of light—it&apos;s an experience. We&apos;ve carefully selected the finest ingredients to create a candle that not only looks beautiful but fills your space with a therapeutic aroma that promotes relaxation and well-being.
                                </p>
                                <p className="text-neutral-700 leading-relaxed tracking-wide">
                                    Each candle is hand-poured in small batches, ensuring consistent quality and attention to detail. The clean-burning soy wax means you can enjoy your candle knowing it&apos;s better for you and the environment.
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
                                {reviews.map((review) => (
                                    <Card key={review.id}>
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-semibold">{review.author}</span>
                                                        {review.verified && (
                                                            <Badge variant="outline" className="text-xs">
                                                                <Check className="w-3 h-3 mr-1" />
                                                                Verified Purchase
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-4 h-4 ${i < review.rating
                                                                        ? 'fill-yellow-400 text-yellow-400'
                                                                        : 'text-neutral-300'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-sm text-neutral-600">{review.date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <h4 className="font-semibold mb-2">{review.title}</h4>
                                            <p className="text-neutral-700">{review.comment}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Related Products */}
                <h2 className="text-3xl font-bold tracking-wide mb-6 font-[style]">You May Also Like</h2>
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
                                <CardComponent key={relatedProduct.id} product={relatedProduct} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
            <Footer />
        </div>
    )
}