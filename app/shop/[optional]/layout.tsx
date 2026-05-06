import type { Metadata } from 'next';

type Props = {
  params: Promise<{ optional: string | string[] }> | { optional: string | string[] };
};

export async function generateMetadata(
  props: Props
): Promise<Metadata> {
  const params = await props.params;
  const raw = params.optional;
  const slug = (Array.isArray(raw) ? raw[0] : raw) ?? "all";
  
  const categoryName = slug === "all" ? "All Collections" : decodeURIComponent(slug);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const canonicalUrl = slug === "all" ? `${baseUrl}/shop/all` : `${baseUrl}/shop/${slug}`;

  return {
    title: `${categoryName} | Shop | Silver Star`,
    description: `Explore our collection of ${categoryName.toLowerCase()}. Hand-poured artisanal candles and premium luxury goods.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${categoryName} | Shop | Silver Star`,
      description: `Explore our collection of ${categoryName.toLowerCase()}. Hand-poured artisanal candles and premium luxury goods.`,
      url: canonicalUrl,
    },
  };
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
