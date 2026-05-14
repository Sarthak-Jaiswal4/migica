"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// ─── shared URL helper (both components use this) ────────────────────────────

function useShopParams() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [, startTransition] = useTransition();

    const push = useCallback(
        (updates: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString());
            for (const [key, value] of Object.entries(updates)) {
                if (value === null || value === "") {
                    params.delete(key);
                } else {
                    params.set(key, value);
                }
            }
            startTransition(() => {
                router.push(`${pathname}?${params.toString()}`);
            });
        },
        [router, pathname, searchParams]
    );

    return push;
}

// ─── Header bar: search + sort + mobile filters toggle ───────────────────────

type HeaderBarProps = {
    initialSearch: string;
    initialSort: string;
    onMobileToggle: () => void;
};

export function ShopHeaderBar({ initialSearch, initialSort, onMobileToggle }: HeaderBarProps) {
    const push = useShopParams();

    return (
        <div className="border-b bg-card/80 backdrop-blur-md z-40 pt-16">
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
                            onClick={onMobileToggle}
                        >
                            <SlidersHorizontal className="w-4 h-4 mr-2" />
                            Filters
                        </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="Search candles..."
                                className="pl-10 bg-card border-border focus-visible:ring-neutral-400"
                                defaultValue={initialSearch}
                                onChange={(e) => push({ search: e.target.value || null })}
                            />
                        </div>
                        <Select defaultValue={initialSort || "featured"} onValueChange={(v) => push({ sort: v === "featured" ? null : v })}>
                            <SelectTrigger className="w-full sm:w-[200px] bg-card">
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
    );
}

// ─── Sidebar: categories + price range ───────────────────────────────────────

type SidebarProps = {
    categoryOptions: string[];
    totalFound: number;
    initialCategory: string;
    initialMinPrice: number;
    initialMaxPrice: number;
    maxProductPrice: number;
    show: boolean;
};

export function ShopSidebar({
    categoryOptions,
    totalFound,
    initialCategory,
    initialMinPrice,
    initialMaxPrice,
    maxProductPrice,
    show,
}: SidebarProps) {
    const push = useShopParams();
    const [priceRange, setPriceRange] = useState([initialMinPrice, initialMaxPrice]);

    return (
        <aside className={`lg:w-64 shrink-0 space-y-6 ${show ? "block" : "hidden lg:block"}`}>
            <Card className="border-border shadow-sm">
                <CardContent className="p-6 space-y-6">
                    {/* Categories */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Categories</h3>
                        <div className="flex flex-wrap gap-2">
                            {categoryOptions.map((category) => (
                                <Badge
                                    key={category}
                                    variant={initialCategory === category ? "default" : "outline"}
                                    className={`cursor-pointer transition-all ${
                                        initialCategory === category
                                            ? "bg-neutral-900 hover:bg-neutral-800"
                                            : "hover:bg-neutral-100"
                                    }`}
                                    onClick={() => push({ category: category === "All" ? null : category })}
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
                                max={maxProductPrice}
                                step={100}
                                value={priceRange}
                                onValueChange={setPriceRange}
                                onValueCommit={(v) =>
                                    push({
                                        minPrice: v[0] === 0 ? null : String(v[0]),
                                        maxPrice: v[1] === maxProductPrice ? null : String(v[1]),
                                    })
                                }
                                className="mt-2"
                            />
                            <div className="flex items-center justify-between text-sm text-neutral-600">
                                <span>₹{priceRange[0]}</span>
                                <span>₹{priceRange[1]}</span>
                            </div>
                        </div>
                    </div>

                    {/* Count */}
                    <div className="pt-4 border-t">
                        <p className="text-sm text-neutral-600">
                            {totalFound} {totalFound === 1 ? "product" : "products"} found
                        </p>
                    </div>
                </CardContent>
            </Card>
        </aside>
    );
}

// ─── Shell: owns the mobile toggle state, composes header + sidebar ──────────

type ShopFiltersProps = {
    categoryOptions: string[];
    totalFound: number;
    initialCategory: string;
    initialSearch: string;
    initialSort: string;
    initialMinPrice: number;
    initialMaxPrice: number;
    maxProductPrice: number;
    children: React.ReactNode;
};

export function ShopFiltersShell({
    categoryOptions,
    totalFound,
    initialCategory,
    initialSearch,
    initialSort,
    initialMinPrice,
    initialMaxPrice,
    maxProductPrice,
    children,
}: ShopFiltersProps) {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <>
            <ShopHeaderBar
                initialSearch={initialSearch}
                initialSort={initialSort}
                onMobileToggle={() => setShowFilters((v) => !v)}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <ShopSidebar
                        categoryOptions={categoryOptions}
                        totalFound={totalFound}
                        initialCategory={initialCategory}
                        initialMinPrice={initialMinPrice}
                        initialMaxPrice={initialMaxPrice}
                        maxProductPrice={maxProductPrice}
                        show={showFilters}
                    />
                    <div className="flex-1">{children}</div>
                </div>
            </div>
        </>
    );
}
