"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Headers } from "@/components/Headers"
import { useRouter } from "next/navigation"
import { CardComponent } from "@/components/Card"
import { Footer } from "@/components/Footer"
import type { Product } from "@/lib/product"
import { Loader2 } from "lucide-react"

export default function ShopPage() {
    const params = useParams()
    const [products, setProducts] = useState<Product[]>([])
    const [categoryOptions, setCategoryOptions] = useState<string[]>(["All"])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [priceRange, setPriceRange] = useState([0, 10000])
    const [sortBy, setSortBy] = useState("featured")
    const [showFilters, setShowFilters] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const raw = params.optional
        const slug = (Array.isArray(raw) ? raw[0] : raw) ?? "all"
        if (!slug || slug === "all") {
            setSelectedCategory("All")
        } else {
            setSelectedCategory(decodeURIComponent(slug))
        }
    }, [params.optional])

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products')
                const data = await res.json()
                if (data.products) {
                    const mapped: Product[] = data.products.map((p: Product & { _id: string }) => ({
                        ...p,
                        id: String(p._id),
                    }))
                    setProducts(mapped)
                    const cats: string[] = mapped.map((p: Product) => String(p.category))
                    const uniq = Array.from(new Set(cats))
                    uniq.sort((a, b) => a.localeCompare(b))
                    setCategoryOptions(["All", ...uniq])
                }
            } catch (error) {
                console.error("Failed to fetch products", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProducts()
    }, [])

    const filteredProducts = products
        .filter((product) => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
            const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
            return matchesSearch && matchesCategory && matchesPrice
        })
        .sort((a, b) => {
            if (sortBy === "price-low") return a.price - b.price
            if (sortBy === "price-high") return b.price - a.price
            if (sortBy === "rating") return b.rating - a.rating
            return 0
        })

    return (
        <div className="min-h-screen bg-[#F6F4F1]">
            <Headers />
            {/* Header */}
            <div className="border-b bg-white/80 backdrop-blur-md z-40 pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">
                                    Our Collection
                                </h1>
                                <p className="text-neutral-600 mt-1">Discover hand-poured candles crafted with care</p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="lg:hidden"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <SlidersHorizontal className="w-4 h-4 mr-2" />
                                Filters
                            </Button>
                        </div>

                        {/* Search and Sort */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                <Input
                                    placeholder="Search candles..."
                                    className="pl-10 bg-white border-neutral-200 focus-visible:ring-neutral-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-full sm:w-[200px] bg-white">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="featured">Featured</SelectItem>
                                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                                    <SelectItem value="rating">Highest Rated</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className={`lg:w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <Card className="border-neutral-200 shadow-sm">
                            <CardContent className="p-6 space-y-6">
                                {/* Categories */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-3">Categories</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {categoryOptions.map((category) => (
                                            <Badge
                                                key={category}
                                                variant={selectedCategory === category ? "default" : "outline"}
                                                className={`cursor-pointer transition-all ${selectedCategory === category
                                                    ? "bg-neutral-900 hover:bg-neutral-800"
                                                    : "hover:bg-neutral-100"
                                                    }`}
                                                onClick={() => setSelectedCategory(category)}
                                            >
                                                {category}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-3">Price Range</h3>
                                    <div className="space-y-4">
                                        <Slider
                                            min={0}
                                            max={20000}
                                            step={100}
                                            value={priceRange}
                                            onValueChange={setPriceRange}
                                            className="mt-2"
                                        />
                                        <div className="flex items-center justify-between text-sm text-neutral-600">
                                            <span>₹{priceRange[0]}</span>
                                            <span>₹{priceRange[1]}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Filter Info */}
                                <div className="pt-4 border-t">
                                    <p className="text-sm text-neutral-600">
                                        {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-32 text-neutral-500 gap-4">
                                <Loader2 className="w-8 h-8 animate-spin" />
                                <p className="text-lg">Loading amazing products...</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="text-neutral-600 text-lg">No products found matching your criteria</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                                {filteredProducts.map((product) => (
                                    <CardComponent key={product.id} product={product} compact />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}