import { normalizeCategorySlug, normalizeSubcategorySlug } from "@/lib/categories";
import type { Product } from "@/lib/product";

type MongoDoc = Record<string, unknown> & {
  _id?: { toString(): string } | string;
  id?: string;
};

/** Plain product shape safe to pass from Server → Client Components. */
export function serializeProduct(doc: MongoDoc): Product {
  const scent =
    doc.scent && typeof doc.scent === "object"
      ? {
          top: String((doc.scent as { top?: string }).top ?? ""),
          middle: String((doc.scent as { middle?: string }).middle ?? ""),
          base: String((doc.scent as { base?: string }).base ?? ""),
        }
      : undefined;

  const images = Array.isArray(doc.images)
    ? doc.images.map(String).filter(Boolean)
    : [];
  const image = String(doc.image ?? images[0] ?? "");
  const hoverImage =
    doc.hoverImage != null
      ? String(doc.hoverImage)
      : images.find((url) => url !== image) ?? images[1];

  return {
    id: String(doc._id ?? doc.id ?? ""),
    slug: doc.slug != null ? String(doc.slug) : undefined,
    name: String(doc.name ?? ""),
    category: normalizeCategorySlug(String(doc.category ?? "")),
    subcategory: (() => {
      const raw = doc.subcategory ?? doc.subCategory;
      return raw ? normalizeSubcategorySlug(String(raw)) : undefined;
    })(),
    tags: Array.isArray(doc.tags) ? doc.tags.map(String) : [],
    price: Number(doc.price ?? 0),
    originalPrice:
      doc.originalPrice != null ? Number(doc.originalPrice) : undefined,
    description:
      doc.description != null ? String(doc.description) : undefined,
    image,
    images,
    hoverImage: hoverImage || undefined,
    features: Array.isArray(doc.features) ? doc.features.map(String) : [],
    scent,
    rating: Number(doc.rating ?? 0),
    reviews: Number(doc.reviews ?? 0),
    inStock: doc.inStock !== false,
    quantity: Number(doc.quantity ?? 0),
  };
}

export function serializeProducts(docs: unknown[]): Product[] {
  return docs.map((doc) => serializeProduct(doc as MongoDoc));
}
