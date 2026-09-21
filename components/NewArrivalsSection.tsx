import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import connectDB from "@/lib/mongodb";
import type { Product } from "@/lib/product";
import { serializeProducts } from "@/lib/productSerializer";
import ProductModel from "@/models/Product";
import { AppImage as Image } from "@/components/AppImage";

/** A small, automatically updated edit of the most recently added catalogue pieces. */
export async function NewArrivalsSection() {
  await connectDB();
  const newest = await ProductModel.find({})
    .sort({ createdAt: -1, _id: -1 })
    .limit(4)
    .lean();
  const products: Product[] = serializeProducts(newest);

  if (!products.length) return null;

  return (
    <section className="bg-background px-4 sm:py-14 md:px-8 md:py-10" aria-labelledby="new-arrivals-heading">
      <div className="mx-auto max-w-[1500px] overflow-hidden rounded-[28px] bg-[#3D2314] px-4 py-7 text-[#FFF9F4] shadow-sm sm:px-7 sm:py-9 lg:rounded-[34px] lg:px-8">
        <div className="relative">
          <div className="pointer-events-none absolute -left-20 -top-28 h-64 w-64 rounded-full border border-[#E8D5C8]/10" />
          <div className="pointer-events-none absolute -bottom-44 left-12 h-72 w-72 rounded-full bg-[#C9956C]/10 blur-2xl" />

          <div className="relative lg:grid lg:grid-cols-[1.15fr_repeat(4,minmax(0,1fr))] lg:items-stretch lg:gap-3">
            <div className="flex flex-col justify-center px-2 pb-6 pt-1 lg:px-4 lg:py-6">
              <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E8D5C8] before:h-px before:w-6 before:bg-[#C9956C]">
                Just added
              </p>
              <h2 id="new-arrivals-heading" className="mt-3 max-w-[9ch] font-[style] text-4xl font-semibold leading-[0.95] tracking-tight sm:text-5xl lg:text-[clamp(2.25rem,3.2vw,3.5rem)]">
                New pieces, made to be noticed.
              </h2>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#E8D5C8]">
                Fresh finds for slow mornings, thoughtful gifting, and everyday little rituals.
              </p>
              <Link href="/shop/all" className="mt-6 inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:text-[#E8D5C8]">
                View all arrivals <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:col-span-4 lg:grid-cols-4">
              {products.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug || product.id}`}
                  className="group relative overflow-hidden rounded-2xl bg-[#FFFDFC] text-[#2C1810] transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-[1.15/1] overflow-hidden bg-[#E8D5C8]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 639px) 45vw, (max-width: 1023px) 42vw, 20vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-[#FFFDFC]/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#3D2314] backdrop-blur-sm">
                      New {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex min-h-[104px] flex-col p-3 sm:p-4">
                    <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[#8C6E5D]">{product.category}</p>
                    <div className="mt-1 flex items-start justify-between gap-2">
                      <h2 className="font-[style] text-sm font-normal leading-6 sm:text-xl">{product.name}</h2>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#8C6E5D]/50 text-[#3D2314] transition-colors group-hover:bg-[#3D2314] group-hover:text-white">
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>
                    <p className="mt-auto pt-2 text-sm font-medium">₹{product.price.toLocaleString("en-IN")}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
