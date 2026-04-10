"use client"

import { useState } from "react"
import { Star, Heart, Share2, ShoppingCart, Minus, Plus, Check, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Headers } from "@/components/Headers"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CardComponent } from "@/components/Card"
import { Footer } from "@/components/Footer"
import { featuredProduct, reviews, relatedProducts } from "@/lib/sampledata"

const product = featuredProduct

export default function ProductPage() {
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [isFavorite, setIsFavorite] = useState(false)
    const router = useRouter()

    const incrementQuantity = () => setQuantity(prev => prev + 1)
    const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1))

    return (
        <div className="min-h-screen bg-[#F6F4F1]">
            <Headers />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-neutral-600 mb-8">
                    <span className="hover:text-neutral-900 cursor-pointer">Home</span>
                    <span>/</span>
                    <span className="hover:text-neutral-900 cursor-pointer">Shop</span>
                    <span>/</span>
                    <span className="hover:text-neutral-900 cursor-pointer">{product.category}</span>
                    <span>/</span>
                    <span className="text-neutral-900 font-medium">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-orange-200/40 via-amber-100/40 to-yellow-200/40 group">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-300/30 via-amber-200/30 to-yellow-300/30 transition-transform duration-500 group-hover:scale-105" />
                            {product.originalPrice && (
                                <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                                    Save ${(product.originalPrice - product.price).toFixed(2)}
                                </Badge>
                            )}
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                                onClick={() => setIsFavorite(!isFavorite)}
                            >
                                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                            </Button>
                        </div>

                        {/* Thumbnails */}
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((image, index) => (
                                <button
                                    key={image.id}
                                    onClick={() => setSelectedImage(index)}
                                    className={`aspect-square rounded-lg overflow-hidden transition-all ${selectedImage === index
                                        ? 'ring-2 ring-neutral-900 scale-95'
                                        : 'hover:opacity-75'
                                        }`}
                                >
                                    <div className="w-full h-full bg-gradient-to-br from-orange-200/40 via-amber-100/40 to-yellow-200/40" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        <div>
                            <Badge variant="outline" className="mb-3">{product.category}</Badge>
                            <h1 className="text-4xl font-bold text-neutral-900 mb-2">{product.name}</h1>

                            {/* Rating */}
                            <div className="flex items-center gap-3 mb-4">
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
                                <span className="text-sm font-medium">{product.rating}</span>
                                <span className="text-sm text-neutral-600">({product.reviews} reviews)</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-4xl font-bold">${product.price}</span>
                                {product.originalPrice && (
                                    <span className="text-2xl text-neutral-400 line-through">${product.originalPrice}</span>
                                )}
                            </div>

                            <p className="text-neutral-700 leading-relaxed mb-6">
                                {product.description}
                            </p>
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border rounded-lg">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={decrementQuantity}
                                        className="rounded-r-none"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                    <span className="px-6 py-2 font-medium">{quantity}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={incrementQuantity}
                                        className="rounded-l-none"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>

                                <Button
                                    className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white h-12 text-lg"
                                    disabled={!product.inStock}
                                >
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    Add to Cart
                                </Button>

                                <Button variant="outline" size="icon" className="h-12 w-12">
                                    <Share2 className="w-5 h-5" />
                                </Button>
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

                {/* Tabs Section */}
                <Tabs defaultValue="description" className="mb-16">
                    <TabsList className="w-full justify-start h-16 p-0.5 bg-neutral-100/80 backdrop-blur-sm border border-neutral-200 rounded-2xl gap-2">
                        <TabsTrigger
                            value="description"
                            className="rounded-xl px-6 py-5 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-neutral-900 transition-all duration-300"
                        >
                            Description
                        </TabsTrigger>
                        <TabsTrigger
                            value="scent"
                            className="rounded-xl px-6 py-5 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-neutral-900 transition-all duration-300"
                        >
                            Scent Profile
                        </TabsTrigger>
                        <TabsTrigger
                            value="reviews"
                            className="rounded-xl px-6 py-5 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-neutral-900 transition-all duration-300"
                        >
                            Reviews ({product.reviews})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="description" className="mt-6">
                        <div className="p-8 border border-neutral-200 rounded-2xl bg-white shadow-sm space-y-4">
                            <div className="prose max-w-none">
                                <p className="text-neutral-700 leading-relaxed">
                                    {product.description}
                                </p>
                                <h3 className="text-xl font-semibold mt-6 mb-3">What Makes It Special</h3>
                                <p className="text-neutral-700 leading-relaxed">
                                    Our Lavender Dream candle is more than just a source of light—it's an experience. We've carefully selected the finest ingredients to create a candle that not only looks beautiful but fills your space with a therapeutic aroma that promotes relaxation and well-being.
                                </p>
                                <p className="text-neutral-700 leading-relaxed">
                                    Each candle is hand-poured in small batches, ensuring consistent quality and attention to detail. The clean-burning soy wax means you can enjoy your candle knowing it's better for you and the environment.
                                </p>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="scent" className="mt-6">
                        <div className="p-8 border border-neutral-200 rounded-2xl bg-white shadow-sm">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Top Notes</h3>
                                    <p className="text-neutral-700">{product.scent.top}</p>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Middle Notes</h3>
                                    <p className="text-neutral-700">{product.scent.middle}</p>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Base Notes</h3>
                                    <p className="text-neutral-700">{product.scent.base}</p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="reviews" className="mt-6">
                        <div className="p-8 border border-neutral-200 rounded-2xl bg-white shadow-sm space-y-6">
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
                <div>
                    <h2 className="text-3xl font-bold mb-6">You May Also Like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((relatedProduct) => (
                            <CardComponent product={relatedProduct} />
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}