import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/product";
import { getInlineQuoteForCategory } from "@/lib/categoryInlineQuotes";
import { getCategoryLayout } from "@/lib/categoryLayouts";
import { CategoryCarousel } from "./CategoryCarousel";
import { CategoryEditorialImage } from "./CategoryEditorialImage";

export function CategoryRow({ name, products }: { name: string; products: Product[] }) {
  const inlineQuote = getInlineQuoteForCategory(name);
  const layout = getCategoryLayout(name);

  const getDescriptiveHeading = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "candles":
        return "Handmade Soy Candles";
      case "jewelry":
        return "Handcrafted Artisanal Jewelry";
      case "scarves":
        return "Premium Woven Scarves";
      case "gift":
        return "Thoughtful Curated Gifts";
      case "t-shirt":
        return "Soft Cotton Graphic Tees";
      default:
        return cat;
    }
  };

  const header = (
    <div className="mb-6 flex flex-row justify-between gap-4 md:mb-8 md:items-end">
      <div>
        <h2 className="font-[style] text-3xl font-light tracking-normal text-foreground md:text-4xl">
          {getDescriptiveHeading(name)}
        </h2>
        <p className="mt-1 text-sm font-medium text-muted-foreground">{products.length} items</p>
      </div>
      <Button
        variant="outline"
        className="group h-10 self-start rounded-full border-neutral-300 px-6 text-sm font-semibold transition-all hover:cursor-pointer hover:bg-neutral-100 hover:text-foreground active:scale-95 md:self-auto"
        asChild
      >
        <Link href={`/shop/${encodeURIComponent(name)}`}>
          <span className="relative flex h-5 items-center justify-center overflow-hidden">
            <span className="flex items-center pr-5 transition-transform duration-300 ease-in-out group-hover:translate-x-5">
              <span className="absolute -left-5 flex w-5 items-center justify-center">→</span>
              <span className="whitespace-nowrap">View All</span>
              <span className="absolute right-0 flex w-5 items-center justify-center">→</span>
            </span>
          </span>
        </Link>
      </Button>
    </div>
  );

  const quoteBlock =
    inlineQuote ? (
      <aside className="mb-6 max-w-3xl md:mb-8" aria-label="Customer quote">
        <div className="border-l border-neutral-900/20 pl-5 sm:pl-6">
          <blockquote className="font-[style] text-[18px] font-normal italic leading-[1.65] tracking-wide text-neutral-700">
            {inlineQuote.quote}
          </blockquote>
          <footer className="mt-3 text-[14px] font-medium tracking-tight text-muted-foreground">
            <span className="text-muted-foreground" aria-hidden>
              —{" "}
            </span>
            {inlineQuote.attribution}
          </footer>
        </div>
      </aside>
    ) : null;

  const carousel = (
    <div className="min-w-0">
      <CategoryCarousel products={products} />
    </div>
  );

  const editorialBody = (() => {
    if (!layout) {
      return <div className="mb-2">{carousel}</div>;
    }

    switch (layout.variant) {
      case "stack-top":
        return (
          <div className="flex flex-col gap-6 md:gap-8">
            <CategoryEditorialImage config={layout} />
            {carousel}
          </div>
        );
      case "split-image-left":
        return (
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
            <CategoryEditorialImage config={layout} />
            <div className="flex min-w-0 flex-col justify-center">{carousel}</div>
          </div>
        );
      case "split-image-right":
        return (
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
            <div className="order-2 flex min-w-0 flex-col justify-center lg:order-1">{carousel}</div>
            <CategoryEditorialImage config={layout} className="order-1 lg:order-2" />
          </div>
        );
    }
  })();

  return (
    <article className="mx-auto w-full max-w-[1400px] px-4 pb-6 pt-8 md:px-8">
      {header}
      {quoteBlock}
      {editorialBody}
    </article>
  );
}
