"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { ArrowDownUp, Check, ChevronLeft, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
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

  const pushRoute = useCallback(
    (path: string, updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      }
      const qs = params.toString();
      startTransition(() => {
        router.push(qs ? `${path}?${qs}` : path);
      });
    },
    [router, searchParams]
  );

  return { pushQuery, pushPath, pushRoute };
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
    <div className="border-b bg-card/80 backdrop-blur-md z-40 pt-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:tracking-tight font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">
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

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
] as const;

type MobileFilterSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: CategoryDef[];
  activeCategory: string | null;
  initialMinPrice: number;
  initialMaxPrice: number;
  maxProductPrice: number;
};

function MobileFilterSheet({
  open,
  onOpenChange,
  categories,
  activeCategory,
  initialMinPrice,
  initialMaxPrice,
  maxProductPrice,
}: MobileFilterSheetProps) {
  const { pushRoute } = useShopQueryParams();
  const [category, setCategory] = useState(activeCategory ?? "all");
  const [priceRange, setPriceRange] = useState([initialMinPrice, initialMaxPrice]);

  useEffect(() => {
    if (!open) {
      setCategory(activeCategory ?? "all");
      setPriceRange([initialMinPrice, initialMaxPrice]);
    }
  }, [activeCategory, initialMaxPrice, initialMinPrice, open]);

  const applyFilters = () => {
    pushRoute(category === "all" ? "/shop/all" : getShopPath(category), {
      minPrice: priceRange[0] === 0 ? null : String(priceRange[0]),
      maxPrice: priceRange[1] === maxProductPrice ? null : String(priceRange[1]),
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="h-[100dvh] w-full max-w-none gap-0 overflow-hidden rounded-none border-0 p-0 lg:hidden"
      >
        <div className="flex items-center gap-3 border-b px-4 py-4">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => onOpenChange(false)}
            className="rounded-full p-2 transition-colors hover:bg-neutral-100"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div>
            <SheetTitle className="text-lg">Filters</SheetTitle>
            <SheetDescription>Refine the products you see.</SheetDescription>
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-8 overflow-y-auto px-5 py-6">
          <section>
            <h3 className="mb-3 font-semibold">Category</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCategory("all")}
                className={`rounded-xl border px-3 py-3 text-left text-sm font-medium transition-colors ${
                  category === "all" ? "border-neutral-900 bg-neutral-900 text-white" : "border-border bg-card"
                }`}
              >
                All collections
              </button>
              {categories.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => setCategory(item.slug)}
                  className={`rounded-xl border px-3 py-3 text-left text-sm font-medium transition-colors ${
                    category === item.slug ? "border-neutral-900 bg-neutral-900 text-white" : "border-border bg-card"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-semibold">Price range</h3>
              <span className="text-sm text-muted-foreground">₹{priceRange[0]} – ₹{priceRange[1]}</span>
            </div>
            <Slider
              min={0}
              max={maxProductPrice}
              step={100}
              value={priceRange}
              onValueChange={setPriceRange}
            />
          </section>
        </div>

        <div className="border-t bg-card p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button className="h-12 w-full rounded-xl" onClick={applyFilters}>
            Apply filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

type MobileSortSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSort: string;
};

function MobileSortSheet({ open, onOpenChange, initialSort }: MobileSortSheetProps) {
  const { pushQuery } = useShopQueryParams();

  const chooseSort = (value: string) => {
    pushQuery({ sort: value === "featured" ? null : value });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="gap-0 rounded-t-3xl p-0 lg:hidden">
        <div className="border-b px-5 py-4">
          <SheetTitle>Sort products</SheetTitle>
        </div>
        <div className="p-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => chooseSort(option.value)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-medium hover:bg-neutral-100"
            >
              {option.label}
              {initialSort === option.value ? <Check className="size-4" /> : null}
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [showMobileBar, setShowMobileBar] = useState(false);
  const mobileBarTriggerRef = useRef<HTMLDivElement>(null);
  const categoryDef = activeCategory
    ? categories.find((c) => c.slug === activeCategory)
    : null;

  useEffect(() => {
    const trigger = mobileBarTriggerRef.current;
    if (!trigger) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowMobileBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(trigger);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <ShopHeaderBar
        pageTitle={pageTitle}
        pageSubtitle={pageSubtitle}
        initialSearch={initialSearch}
        initialSort={initialSort}
        onMobileToggle={() => setMobileFiltersOpen(true)}
      />

      <div ref={mobileBarTriggerRef} className="h-px lg:hidden" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <ShopSidebar
            categories={categories}
            activeCategory={activeCategory}
            totalFound={totalFound}
            initialMinPrice={initialMinPrice}
            initialMaxPrice={initialMaxPrice}
            maxProductPrice={maxProductPrice}
            show={false}
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

      <MobileFilterSheet
        open={mobileFiltersOpen}
        onOpenChange={setMobileFiltersOpen}
        categories={categories}
        activeCategory={activeCategory}
        initialMinPrice={initialMinPrice}
        initialMaxPrice={initialMaxPrice}
        maxProductPrice={maxProductPrice}
      />
      <MobileSortSheet
        open={mobileSortOpen}
        onOpenChange={setMobileSortOpen}
        initialSort={initialSort}
      />

      {showMobileBar ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-md gap-3">
            <Button variant="outline" className="h-11 flex-1 rounded-xl" onClick={() => setMobileSortOpen(true)}>
              <ArrowDownUp className="mr-2 size-4" />
              Sort
            </Button>
            <Button className="h-11 flex-1 rounded-xl" onClick={() => setMobileFiltersOpen(true)}>
              <SlidersHorizontal className="mr-2 size-4" />
              Filter
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
