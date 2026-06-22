import { Headers } from "@/components/Headers";
import { Footer } from "@/components/Footer";
import { CardComponent } from "@/components/Card";
import { ShopCatalogHydrator } from "@/components/ShopCatalogHydrator";
import { ShopFiltersShell } from "./ShopFilters";
import connectDB from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import type { Product } from "@/lib/product";
import { serializeProducts } from "@/lib/productSerializer";
import {
  getCategoryBySlug,
  getCategoryLabel,
  getSubcategoryLabel,
  matchesShopFilter,
  parseShopSlug,
  SHOP_CATEGORIES,
} from "@/lib/categories";

async function getAllProducts(): Promise<Product[]> {
  await connectDB();
  const raws = await ProductModel.find({}).sort({ createdAt: -1 }).lean();
  return serializeProducts(raws);
}

type PageProps = {
  params: Promise<{ slug?: string[] }> | { slug?: string[] };
  searchParams:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>;
};

export default async function ShopPage(props: PageProps) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  const rawSlug = (params as { slug?: string[] }).slug;
  const segments = Array.isArray(rawSlug) ? rawSlug : rawSlug ? [rawSlug] : [];
  const { category: slugCategory, subcategory: slugSubcategory } =
    parseShopSlug(segments);

  const sp = (key: string) => {
    const v = (searchParams as Record<string, string | string[] | undefined>)[key];
    return Array.isArray(v) ? v[0] : (v ?? "");
  };

  const searchQuery = sp("search");
  const sortBy = sp("sort") || "featured";
  const minPrice = Number(sp("minPrice")) || 0;

  const allProducts = await getAllProducts();
  const maxProductPrice =
    allProducts.reduce((m, p) => Math.max(m, p.price), 0) || 20000;
  const maxPrice = Number(sp("maxPrice")) || maxProductPrice;

  const activeCategory = slugCategory;
  const activeSubcategory = slugSubcategory;
  const categoryDef = activeCategory ? getCategoryBySlug(activeCategory) : null;

  const filtered = allProducts
    .filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = matchesShopFilter(p, activeCategory, activeSubcategory);
      const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
      return matchesSearch && matchesCat && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const pageTitle = activeCategory
    ? activeSubcategory
      ? `${getCategoryLabel(activeCategory)} · ${getSubcategoryLabel(activeCategory, activeSubcategory)}`
      : getCategoryLabel(activeCategory)
    : "All Collections";

  const pageSubtitle = activeCategory
    ? categoryDef?.description ?? "Explore the collection."
    : "Candles, scarves, jewellery, clothing, and gifts — all in one place.";

  return (
    <div className="min-h-screen bg-background">
      <ShopCatalogHydrator products={allProducts} />
      <Headers />

      <ShopFiltersShell
        categories={SHOP_CATEGORIES}
        activeCategory={activeCategory}
        activeSubcategory={activeSubcategory}
        totalFound={filtered.length}
        pageTitle={pageTitle}
        pageSubtitle={pageSubtitle}
        initialSearch={searchQuery}
        initialSort={sortBy}
        initialMinPrice={minPrice}
        initialMaxPrice={maxPrice}
        maxProductPrice={maxProductPrice}
      >
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-neutral-600 text-lg">
              No products found matching your criteria
            </p>
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
