import type { Product } from "@/lib/product";
import { CategoryRow } from "./CategoryRow";
import connectDB from "@/lib/mongodb";
import ProductModel from "@/models/Product";

export async function CategoriesShop() {
  await connectDB();
  const dbProducts = await ProductModel.find({}).sort({ createdAt: -1 }).lean();
  
  const products: Product[] = dbProducts.map((p: any) => {
    const plain = { ...p, id: String(p._id), _id: String(p._id) };
    if (plain.createdAt) plain.createdAt = String(plain.createdAt);
    if (plain.updatedAt) plain.updatedAt = String(plain.updatedAt);
    return plain;
  });

  const byCategory = new Map<string, Product[]>();
  for (const p of products) {
    const list = byCategory.get(p.category) ?? [];
    list.push(p);
    byCategory.set(p.category, list);
  }

  const allCats = [...byCategory.entries()]
    .map(([name, prods]) => ({ name, products: prods }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section id="categories-shop" className="scroll-mt-24 py-20 bg-[#F6F4F1] overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">Collections</p>
          <h2 className="mt-2 font-[style] text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            Shop by Category
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral tracking-wide text-neutral-600 sm:text-base">
            Candles, scarves, jewellery, gifts — browse by mood. When something speaks to you, the details are a click away.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {allCats.map((cat) => (
          <CategoryRow key={cat.name} name={cat.name} products={cat.products} />
        ))}
      </div>
    </section>
  );
}
