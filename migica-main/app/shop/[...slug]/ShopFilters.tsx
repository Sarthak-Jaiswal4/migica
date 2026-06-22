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
import type { CategoryDef } from "@/lib/categories";
import { getShopPath } from "@/lib/categories";

function useShopQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const pushQuery = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      }
      const qs = params.toString();
      startTransition(() => {
        router.push(qs ? `${pathname}?${qs}` : pathname);
      });
    },
    [router, pathname, searchParams]
  );

  const pushPath = useCallback(
    (path: string) => {
      const qs = searchParams.toString();
      startTransition(() => {
        router.push(qs ? `${path}?${qs}` : path);
      });
    },
    [router, searchParams]
  );

  return { pushQuery, pushPath };
}

type HeaderBarProps = {
  pageTitle: string;
  pageSubtitle: string;
  initialSearch: string;
  initialSort: string;
  onMobileToggle: () => void;
};

export function ShopHeaderBar({
  pageTitle,
  pageSubtitle,
  initialSearch,
  initialSort,
  onMobileToggle,
}: HeaderBarProps) {
  const { pushQuery } = useShopQueryParams();

  return (
    <div className="border-b bg-card/80 backdrop-blur-md z-40 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">
                {pageTitle}
              </h1>
              <p className="text-neutral-600 mt-1 text-sm sm:text-base">{pageSubtitle}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden shrink-0"
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
                placeholder="Search products..."
                className="pl-10 bg-card border-border focus-visible:ring-neutral-400"
                defaultValue={initialSearch}
                onChange={(e) => pushQuery({ search: e.target.value || null })}
              />
            </div>
            <Select
              defaultValue={initialSort || "featured"}
              onValueChange={(v) => pushQuery({ sort: v === "featured" ? null : v })}
            >
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

type SubcategoryPillsProps = {
  category: CategoryDef;
  activeSubcategory: string | null;
};

export function SubcategoryPills({ category, activeSubcategory }: SubcategoryPillsProps) {
  const { pushPath } = useShopQueryParams();

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Badge
        variant={!activeSubcategory ? "default" : "outline"}
        className={`cursor-pointer px-4 py-1.5 text-sm ${
          !activeSubcategory
            ? "bg-neutral-900 hover:bg-neutral-800"
            : "hover:bg-neutral-100"
        }`}
        onClick={() => pushPath(getShopPath(category.slug))}
      >
        All
      </Badge>
      {category.subcategories.map((sub) => (
        <Badge
          key={sub.slug}
          variant={activeSubcategory === sub.slug ? "default" : "outline"}
          className={`cursor-pointer px-4 py-1.5 text-sm ${
            activeSubcategory === sub.slug
              ? "bg-neutral-900 hover:bg-neutral-800"
              : "hover:bg-neutral-100"
          }`}
          onClick={() => pushPath(getShopPath(category.slug, sub.slug))}
        >
          {sub.label}
        </Badge>
      ))}
    </div>
  );
}

type SidebarProps = {
  categories: CategoryDef[];
  activeCategory: string | null;
  totalFound: number;
  initialMinPrice: number;
  initialMaxPrice: number;
  maxProductPrice: number;
  show: boolean;
};

export function ShopSidebar({
  categories,
  activeCategory,
  totalFound,
  initialMinPrice,
  initialMaxPrice,
  maxProductPrice,
  show,
}: SidebarProps) {
  const { pushPath, pushQuery } = useShopQueryParams();
  const [priceRange, setPriceRange] = useState([initialMinPrice, initialMaxPrice]);

  return (
    <aside className={`lg:w-64 shrink-0 space-y-6 ${show ? "block" : "hidden lg:block"}`}>
      <Card className="border-border shadow-sm">
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-3">Categories</h3>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => pushPath("/shop/all")}
                className={`text-left rounded-lg px-3 py-2 text-sm transition-colors ${
                  !activeCategory
                    ? "bg-neutral-900 text-white font-medium"
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                All collections
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => pushPath(getShopPath(cat.slug))}
                  className={`text-left rounded-lg px-3 py-2 text-sm transition-colors ${
                    activeCategory === cat.slug
                      ? "bg-neutral-900 text-white font-medium"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

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
                  pushQuery({
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

type ShopFiltersShellProps = {
  categories: CategoryDef[];
  activeCategory: string | null;
  activeSubcategory: string | null;
  totalFound: number;
  pageTitle: string;
  pageSubtitle: string;
  initialSearch: string;
  initialSort: string;
  initialMinPrice: number;
  initialMaxPrice: number;
  maxProductPrice: number;
  children: React.ReactNode;
};

export function ShopFiltersShell({
  categories,
  activeCategory,
  activeSubcategory,
  totalFound,
  pageTitle,
  pageSubtitle,
  initialSearch,
  initialSort,
  initialMinPrice,
  initialMaxPrice,
  maxProductPrice,
  children,
}: ShopFiltersShellProps) {
  const [showFilters, setShowFilters] = useState(false);
  const categoryDef = activeCategory
    ? categories.find((c) => c.slug === activeCategory)
    : null;

  return (
    <>
      <ShopHeaderBar
        pageTitle={pageTitle}
        pageSubtitle={pageSubtitle}
        initialSearch={initialSearch}
        initialSort={initialSort}
        onMobileToggle={() => setShowFilters((v) => !v)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <ShopSidebar
            categories={categories}
            activeCategory={activeCategory}
            totalFound={totalFound}
            initialMinPrice={initialMinPrice}
            initialMaxPrice={initialMaxPrice}
            maxProductPrice={maxProductPrice}
            show={showFilters}
          />
          <div className="flex-1 min-w-0">
            {categoryDef ? (
              <SubcategoryPills
                category={categoryDef}
                activeSubcategory={activeSubcategory}
              />
            ) : null}
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
