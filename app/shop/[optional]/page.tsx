import { Headers } from "@/components/Headers";
import { Footer } from "@/components/Footer";
import { CardComponent } from "@/components/Card";
import { ShopFiltersShell } from "./ShopFilters";
import connectDB from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import type { Product } from "@/lib/product";

// ─── server-side data ────────────────────────────────────────────────────────

type RawProduct = Product & { _id: string | { toString(): string } };

async function getAllProducts(): Promise<Product[]> {
    await connectDB();
    const raws = (await ProductModel.find({}).sort({ createdAt: -1 }).lean()) as unknown as RawProduct[];
    return raws.map((p) => ({ ...p, id: String(p._id) }));
}

// ─── page ─────────────────────────────────────────────────────────────────────

type PageProps = {
    params: Promise<{ optional?: string }> | { optional?: string };
    searchParams: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
};

export default async function ShopPage(props: PageProps) {
    const [params, searchParams] = await Promise.all([
        props.params,
        props.searchParams,
    ]);

    // resolve category from the URL segment (/shop/[optional])
    const rawSlug = (params as { optional?: string }).optional;
    const slugCategory = rawSlug && rawSlug !== "all"
        ? decodeURIComponent(rawSlug)
        : "All";

    // resolve filters from search params
    const sp = (key: string) => {
        const v = (searchParams as Record<string, string | string[] | undefined>)[key];
        return Array.isArray(v) ? v[0] : (v ?? "");
    };

    const searchQuery = sp("search");
    const sortBy = sp("sort") || "featured";
    const categoryParam = sp("category");
    const selectedCategory = categoryParam || slugCategory;
    const minPrice = Number(sp("minPrice")) || 0;

    // fetch
    const allProducts = await getAllProducts();

    // derive category list
    const categories = Array.from(new Set(allProducts.map((p) => p.category))).sort((a, b) =>
        a.localeCompare(b)
    );
    const categoryOptions = ["All", ...categories];

    const maxProductPrice = allProducts.reduce((m, p) => Math.max(m, p.price), 0) || 20000;
    const maxPrice = Number(sp("maxPrice")) || maxProductPrice;

    // filter + sort
    const filtered = allProducts
        .filter((p) => {
            const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
            const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
            return matchesSearch && matchesCategory && matchesPrice;
        })
        .sort((a, b) => {
            if (sortBy === "price-low") return a.price - b.price;
            if (sortBy === "price-high") return b.price - a.price;
            if (sortBy === "rating") return b.rating - a.rating;
            return 0;
        });

    return (
        <div className="min-h-screen bg-background">
            <Headers />

            <ShopFiltersShell
                categoryOptions={categoryOptions}
                totalFound={filtered.length}
                initialCategory={selectedCategory}
                initialSearch={searchQuery}
                initialSort={sortBy}
                initialMinPrice={minPrice}
                initialMaxPrice={maxPrice}
                maxProductPrice={maxProductPrice}
            >
                {/* Server-rendered product grid */}
                {filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-neutral-600 text-lg">No products found matching your criteria</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                        {filtered.map((product) => (
                            <CardComponent key={product.id} product={product} compact />
                        ))}
                    </div>
                )}
            </ShopFiltersShell>

            <Footer />
        </div>
    );
}