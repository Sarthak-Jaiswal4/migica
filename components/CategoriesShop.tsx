import type { ReactNode } from "react";
import type { Product } from "@/lib/product";
import {
  BESTSELLER_INSERT_AFTER_INDEX,
  getBreatherAfterCategory,
  sortCategoriesByDisplayOrder,
} from "@/lib/categoryLayouts";
import { CategoryBreather } from "./CategoryBreather";
import { CategoryRow } from "./CategoryRow";
import connectDB from "@/lib/mongodb";
import { serializeProducts } from "@/lib/productSerializer";
import ProductModel from "@/models/Product";

type Props = {
  /** Rendered after the third category (Jewelry) — e.g. Best Sellers */
  midPageSlot?: ReactNode;
};

export async function CategoriesShop({ midPageSlot }: Props) {
  await connectDB();
  const dbProducts = await ProductModel.find({}).sort({ createdAt: -1 }).lean();

  const products: Product[] = serializeProducts(dbProducts);

  const byCategory = new Map<string, Product[]>();
  for (const p of products) {
    const list = byCategory.get(p.category) ?? [];
    list.push(p);
    byCategory.set(p.category, list);
  }

  const allCats = sortCategoriesByDisplayOrder(
    [...byCategory.entries()].map(([name, prods]) => ({ name, products: prods }))
  );

  return (
    <section id="categories-shop" className="scroll-mt-24 overflow-x-hidden bg-background py-20">
      <div className="mx-auto mb-16 max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Collections
          </p>
          <h2 className="mt-2 font-[style] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Shop by Category
          </h2>
          <p className="mt-4 text-sm leading-relaxed tracking-wide text-neutral-600 sm:text-base">
            Candles, scarves, jewellery, gifts — browse by mood. When something speaks to you, the
            details are a click away.
          </p>
        </div>
      </div>

      <div className="flex flex-col">
        {allCats.map((cat, index) => (
          <div key={cat.name}>
            <CategoryRow name={cat.name} products={cat.products} />
            {getBreatherAfterCategory(cat.name) ? (
              <CategoryBreather line={getBreatherAfterCategory(cat.name)!} />
            ) : null}
            {index === BESTSELLER_INSERT_AFTER_INDEX && midPageSlot ? (
              <div className="my-4 md:my-8">{midPageSlot}</div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
