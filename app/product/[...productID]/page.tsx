import { Star, Check, Truck, Shield, RotateCcw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ProductTabs } from "./ProductTabs"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Headers } from "@/components/Headers"
import { AppImage as Image } from "@/components/AppImage"
import { Footer } from "@/components/Footer"
import { AddToCartButton } from "@/components/AddToCartButton"
import { notFound } from "next/navigation"
import connectDB from "@/lib/mongodb"
import { serializeProducts } from "@/lib/productSerializer"
import type { Product } from "@/lib/product"
import ProductModel from "@/models/Product"
import mongoose from "mongoose"
import { WishlistButton, VisitRecorder } from "./ProductInteractions"
import { ProductImageCarouselMobile } from "./ProductImageCarousel"
import { ProductRelatedSwiper } from "./ProductRelatedSwiper"

// ─── server-side data helpers ────────────────────────────────────────────────

type RawProduct = {
    _id: mongoose.Types.ObjectId | string;
    name: string;
    slug?: string;
    category: string;
    price: number;
    originalPrice?: number;
    description?: string;
    image: string;
    images?: string[];
    rating: number;
    reviews: number;
    inStock: boolean;
    quantity: number;
    features?: string[];
    scent?: { top: string; middle: string; base: string };
};

type ProductDetail = {
    id: string;
    name: string;
    slug?: string;
    category: string;
    price: number;
    originalPrice?: number;
    description?: string;
    image: string;
    images: { id: string; url: string; alt: string }[];
    rating: number;
    reviews: number;
    inStock: boolean;
    quantity: number;
    features: string[];
    scent: { top: string; middle: string; base: string };
};

function normalize(p: RawProduct): ProductDetail {
    const id = String(p._id);
    const rawUrls = (Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image]).filter(Boolean) as string[];
    const urls = Array.from(new Set(rawUrls));
    const features =
        Array.isArray(p.features) && p.features.length > 0
            ? p.features
            : ["Premium materials", "Small-batch craftsmanship", "Thoughtful packaging", "Designed for everyday ritual"];

    return {
        id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice,
        description: p.description,
        image: p.image,
        images: urls.map((url, i) => ({ id: `img-${i}`, url, alt: `${p.name} — ${i + 1}` })),
        rating: p.rating,
        reviews: p.reviews,
        inStock: p.inStock,
        quantity: p.quantity,
        features,
        scent: p.scent?.top ? p.scent : { top: "Opening notes", middle: "Heart notes", base: "Base notes" },
    };
}

async function getProduct(id: string): Promise<ProductDetail | null> {
    await connectDB();
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id };
    const raw = await ProductModel.findOne(query).lean() as RawProduct | null;
    return raw ? normalize(raw) : null;
}

async function getRelated(product: ProductDetail): Promise<Product[]> {
    const idFilter = mongoose.Types.ObjectId.isValid(product.id)
        ? new mongoose.Types.ObjectId(product.id)
        : product.id;

    const raws = await ProductModel.find({
        category: product.category,
        _id: { $ne: idFilter },
    })
        .sort({ rating: -1, reviews: -1 })
        .limit(12)
        .lean() as RawProduct[];

    return serializeProducts(raws);
}

// ─── page ────────────────────────────────────────────────────────────────────

type PageProps = {
    params: Promise<{ productID: string[] }> | { productID: string[] };
};

export default async function ProductPage(props: PageProps) {
    const params = await props.params;
    const id = params.productID?.[0];

    if (!id) notFound();

    const product = await getProduct(id);
    if (!product) notFound();

    const relatedProductsRaw = await getRelated(product);

    const productBasic = {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
        inStock: product.inStock,
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Record this visit client-side (no visible UI) */}
            <VisitRecorder product={{ id: product.id, name: product.name, image: product.image }} />

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
                            <BreadcrumbLink href={`/shop/${product.category}`}>{product.category}</BreadcrumbLink>
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
                        {/* Mobile: Swiper carousel (client) */}
                        <ProductImageCarouselMobile images={product.images} product={productBasic} />

                        {/* Desktop: Stacked Vertical Images */}
                        <div className="hidden lg:flex flex-col gap-6">
                            {product.images.slice(0, 2).map((image, index) => (
                                <div
                                    key={image.id}
                                    className="w-full rounded-2xl overflow-hidden shadow-sm border border-border relative"
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
                                    {index === 0 && <WishlistButton product={productBasic} />}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Details — Sticky */}
                    <div className="w-full lg:w-[45%] lg:flex-shrink-0 lg:sticky lg:top-20">
                        <div className="space-y-6">
                            <div>
                                <Badge variant="outline" className="mb-4 px-3 py-1 border-neutral-300 text-neutral-600 bg-card/50 tracking-[0.2em] uppercase text-[10px] font-bold">
                                    {product.category}
                                </Badge>
                                <h1 className="font-[style] text-4xl md:text-5xl font-semibold text-foreground mb-3 tracking-tight leading-tight">
                                    {product.name}
                                </h1>

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
                                    <span className="text-sm text-muted-foreground font-medium">({product.reviews} reviews)</span>
                                </div>

                                {/* Price */}
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-3xl font-normal tracking-tight text-foreground">₹{product.price}</span>
                                    {product.originalPrice ? (
                                        <span className="text-xl text-muted-foreground line-through decoration-red-400/50 decoration-2">₹{product.originalPrice}</span>
                                    ) : null}
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
                                    product={productBasic}
                                    large={true}
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
                                <h3 className="font-[style] text-2xl font-medium text-foreground tracking-tight">Premium Features</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {product.features.map((feature, index) => (
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
                                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-card border border-border shadow-sm">
                                    <Truck className="w-6 h-6 mb-2 text-foreground" />
                                    <span className="text-[10px] font-black uppercase text-muted-foreground mb-1">Shipping</span>
                                    <span className="text-xs font-bold leading-tight">Free over ₹4,999</span>
                                </div>
                                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-card border border-border shadow-sm">
                                    <Shield className="w-6 h-6 mb-2 text-foreground" />
                                    <span className="text-[10px] font-black uppercase text-muted-foreground mb-1">Warranty</span>
                                    <span className="text-xs font-bold leading-tight">100% Quality</span>
                                </div>
                                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-card border border-border shadow-sm">
                                    <RotateCcw className="w-6 h-6 mb-2 text-foreground" />
                                    <span className="text-[10px] font-black uppercase text-muted-foreground mb-1">Returns</span>
                                    <span className="text-xs font-bold leading-tight">30 Days Easy</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ProductTabs
                    product={{
                        name: product.name,
                        description: product.description,
                        rating: product.rating,
                        reviews: product.reviews,
                        scent: product.scent,
                    }}
                />

                {/* Related Products */}
                <h2 className="text-3xl font-bold tracking-wide mb-6 font-[style]">You May Also Like</h2>
                <ProductRelatedSwiper products={relatedProductsRaw} />
            </div>
            <Footer />
        </div>
    )
}
