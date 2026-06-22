import type { Metadata } from "next";
import {
  getCategoryLabel,
  getShopPath,
  getSubcategoryLabel,
  parseShopSlug,
} from "@/lib/categories";

type Props = {
  params: Promise<{ slug?: string[] }> | { slug?: string[] };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const raw = params.slug;
  const segments = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const { category, subcategory } = parseShopSlug(segments);

  if (!category) {
    return {
      title: "All Collections | Shop | Silver Star",
      description:
        "Browse handcrafted candles, jewellery, scarves, clothing, and gifts.",
      alternates: { canonical: "/shop/all" },
    };
  }

  const categoryName = getCategoryLabel(category);
  const title = subcategory
    ? `${getSubcategoryLabel(category, subcategory)} · ${categoryName}`
    : categoryName;
  const canonicalUrl = getShopPath(category, subcategory);

  return {
    title: `${title} | Shop | Silver Star`,
    description: `Explore ${title.toLowerCase()} at Silver Star — small-batch, thoughtfully made.`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${title} | Shop | Silver Star`,
      description: `Explore ${title.toLowerCase()} at Silver Star.`,
      url: canonicalUrl,
    },
  };
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
