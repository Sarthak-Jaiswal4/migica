import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/product";
import { getInlineQuoteForCategory } from "@/lib/categoryInlineQuotes";
import { CategoryCarousel } from "./CategoryCarousel";

export function CategoryRow({ name, products }: { name: string; products: Product[] }) {
  const inlineQuote = getInlineQuoteForCategory(name);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 bg-gray-200 rounded-lg pt-8 pb-4">
      <div className="mb-8 flex flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl md:text-4xl tracking-normal font-light text-neutral-900 font-[style]">{name}</h3>
          <p className="text-sm font-medium text-neutral-500 mt-1">{products.length} items</p>
        </div>
        <Button
          variant="outline"
          className="self-start md:self-auto group rounded-full px-6 h-10 text-sm font-semibold border-neutral-300 hover:bg-neutral-100 hover:text-neutral-900 transition-all active:scale-95 hover:cursor-pointer"
          asChild
        >
          <Link href={`/shop/${encodeURIComponent(name)}`}>
            <span className="relative flex items-center justify-center h-5 overflow-hidden">
              <span className="flex items-center transition-transform duration-300 ease-in-out group-hover:translate-x-5 pr-5">
                <span className="absolute -left-5 flex w-5 items-center justify-center">→</span>
                <span className="whitespace-nowrap">View All</span>
                <span className="absolute right-0 flex w-5 items-center justify-center">→</span>
              </span>
            </span>
          </Link>
        </Button>
      </div>

      {inlineQuote ? (
        <aside className="mb-8 max-w-3xl" aria-label="Customer quote">
          <div className="border-l border-neutral-900/20 pl-5 sm:pl-6">
            <blockquote className="font-[style] text-[18px] font-normal italic leading-[1.65] text-neutral tracking-wide text-neutral-700">
              {inlineQuote.quote}
            </blockquote>
            <footer className="mt-3 text-[14px] font-medium tracking-tight text-neutral tracking-wide text-neutral-500">
              <span className="text-neutral-400" aria-hidden>
                —{" "}
              </span>
              {inlineQuote.attribution}
            </footer>
          </div>
        </aside>
      ) : null}

      <div className="mb-6">
        <CategoryCarousel products={products} />
      </div>
    </div>
  );
}
