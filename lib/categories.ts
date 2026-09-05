import type { Product } from "@/lib/product";

export type SubcategoryDef = {
  slug: string;
  label: string;
  /** When set, shop filter matches `product.tags` instead of `product.subcategory`. */
  tag?: string;
};

export type CategoryDef = {
  slug: string;
  label: string;
  description: string;
  image: string;
  subcategories: SubcategoryDef[];
};

/** Canonical shop taxonomy — slugs are stored on product documents. */
export const SHOP_CATEGORIES: CategoryDef[] = [
  {
    slug: "candles",
    label: "Candles",
    description: "Artisanal scented candles for every mood.",
    image: "/2.jpeg",
    subcategories: [
      { slug: "fresh", label: "Fresh" },
      { slug: "floral", label: "Floral" },
      { slug: "woody", label: "Woody" },
      { slug: "seasonal", label: "Seasonal" },
    ],
  },
  {
    slug: "scarves",
    label: "Scarves",
    description: "Elegant scarves in silk, wool, and print.",
    image: "/1.jpeg",
    subcategories: [
      { slug: "silk", label: "Silk" },
      { slug: "wool", label: "Wool" },
      { slug: "printed", label: "Printed" },
      { slug: "solid", label: "Solid" },
    ],
  },
  {
    slug: "jewellery",
    label: "Jewellery",
    description: "Handcrafted earrings, necklaces, rings, and bracelets.",
    image: "/3.jpeg",
    subcategories: [
      { slug: "earrings", label: "Earrings" },
      { slug: "necklaces", label: "Necklaces" },
      { slug: "rings", label: "Rings" },
      { slug: "bracelets", label: "Bracelets" },
      { slug: "bangles", label: "Bangles" },
      { slug: "anklets", label: "Anklets" },
      { slug: "nose-pins", label: "Nose Pins" },
      { slug: "maangteeka", label: "Maangteeka" },
    ],
  },
  {
    slug: "clothing",
    label: "Clothing",
    description: "Everyday pieces and coordinated sets.",
    image: "/5.jpeg",
    subcategories: [
      { slug: "new-arrivals", label: "New Arrivals", tag: "new-arrival" },
      { slug: "t-shirts", label: "T-Shirts" },
      { slug: "co-ords", label: "Co-ords" },
      { slug: "bestsellers", label: "Bestsellers", tag: "bestseller" },
      { slug: "lehnga", label: "Lehnga" },
      { slug: "saree", label: "Saree" },
      { slug: "suit", label: "Suit" },
      { slug: "gown", label: "Gown" },
      { slug: "western-dress", label: "Western Dress" },
    ],
  },
  {
    slug: "gifts",
    label: "Gifts",
    description: "Curated gifts for every budget and recipient.",
    image: "/4.jpeg",
    subcategories: [
      { slug: "under-500", label: "Under ₹500", tag: "under-500" },
      { slug: "under-1000", label: "Under ₹1000", tag: "under-1000" },
      { slug: "for-her", label: "For Her" },
      { slug: "for-him", label: "For Him" },
    ],
  },
];

const LEGACY_CATEGORY_ALIASES: Record<string, string> = {
  candle: "candles",
  scarves: "scarves",
  scarf: "scarves",
  jewelry: "jewellery",
  jewellery: "jewellery",
  gift: "gifts",
  gifts: "gifts",
  "t-shirt": "clothing",
  "t-shirts": "clothing",
  tshirt: "clothing",
  tshirts: "clothing",
  clothing: "clothing",
  clothes: "clothing",
};

export function normalizeCategorySlug(value?: string | null): string {
  if (!value) return "";
  const key = value.trim().toLowerCase();
  if (key === "all") return "all";
  return LEGACY_CATEGORY_ALIASES[key] ?? key;
}

export function normalizeSubcategorySlug(value?: string | null): string {
  if (!value) return "";
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

export function getCategoryBySlug(slug: string): CategoryDef | undefined {
  const normalized = normalizeCategorySlug(slug);
  return SHOP_CATEGORIES.find((c) => c.slug === normalized);
}

export function getSubcategoryDef(
  categorySlug: string,
  subcategorySlug: string
): SubcategoryDef | undefined {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return undefined;
  const sub = normalizeSubcategorySlug(subcategorySlug);
  return category.subcategories.find((s) => s.slug === sub);
}

export function getShopPath(category?: string | null, subcategory?: string | null): string {
  if (!category || normalizeCategorySlug(category) === "all") return "/shop/all";
  const cat = normalizeCategorySlug(category);
  if (!subcategory) return `/shop/${cat}`;
  return `/shop/${cat}/${normalizeSubcategorySlug(subcategory)}`;
}

export function parseShopSlug(segments: string[] | undefined): {
  category: string | null;
  subcategory: string | null;
} {
  if (!segments?.length || segments[0] === "all") {
    return { category: null, subcategory: null };
  }
  const [rawCategory, rawSubcategory] = segments;
  const category = normalizeCategorySlug(decodeURIComponent(rawCategory));
  const subcategory = rawSubcategory
    ? normalizeSubcategorySlug(decodeURIComponent(rawSubcategory))
    : null;
  return { category, subcategory };
}

export function getCategoryLabel(slug: string): string {
  return getCategoryBySlug(slug)?.label ?? slug;
}

export function getSubcategoryLabel(categorySlug: string, subSlug: string): string {
  return getSubcategoryDef(categorySlug, subSlug)?.label ?? subSlug;
}

/** Whether a product matches the current shop category / subcategory (and optional tag rules). */
export function matchesShopFilter(
  product: Pick<Product, "category" | "subcategory" | "tags">,
  categorySlug: string | null,
  subcategorySlug: string | null
): boolean {
  if (!categorySlug) return true;

  const productCategory = normalizeCategorySlug(product.category);
  if (productCategory !== normalizeCategorySlug(categorySlug)) return false;

  if (!subcategorySlug) return true;

  const subDef = getSubcategoryDef(categorySlug, subcategorySlug);
  if (subDef?.tag) {
    return (product.tags ?? []).includes(subDef.tag);
  }

  const productSub = normalizeSubcategorySlug(product.subcategory);
  return productSub === normalizeSubcategorySlug(subcategorySlug);
}

export function getAdminCategoryOptions(): { value: string; label: string }[] {
  return SHOP_CATEGORIES.map((c) => ({ value: c.slug, label: c.label }));
}

export function getAdminSubcategoryOptions(categorySlug: string): { value: string; label: string }[] {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return [];
  return category.subcategories
    .filter((s) => !s.tag)
    .map((s) => ({ value: s.slug, label: s.label }));
}

export const PRODUCT_TAG_OPTIONS = [
  { value: "new-arrival", label: "New arrival" },
  { value: "bestseller", label: "Bestseller" },
  { value: "featured", label: "Featured" },
  { value: "under-500", label: "Under ₹500" },
  { value: "under-1000", label: "Under ₹1000" },
] as const;
