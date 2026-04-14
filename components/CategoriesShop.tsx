"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CardComponent } from "./Card";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { Skeleton } from "@/components/ui/skeleton";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/product";

export function CategoriesShop() {
  const [allCats, setAllCats] = useState<{ name: string; products: Product[] }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.products) {
          const products: Product[] = data.products.map((p: Product & { _id: string }) => ({
            ...p,
            id: String(p._id),
          }));

          const byCategory = new Map<string, Product[]>();
          for (const p of products) {
            const list = byCategory.get(p.category) ?? [];
            list.push(p);
            byCategory.set(p.category, list);
          }

          const rows = [...byCategory.entries()]
            .map(([name, prods]) => ({ name, products: prods }))
            .sort((a, b) => a.name.localeCompare(b.name));

          setAllCats(rows);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="py-20 bg-[#F6F4F1] overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-neutral-900 mb-4">Shop by Category</h2>
          <p className="text-neutral-500 max-w-2xl mx-auto font-light tracking-wide">
            Explore our curated collections — every image is served from our static gallery while product facts live in the database.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {isLoading ? (
          <>
            {Array.from({ length: 3 }).map((_, idx) => (
              <CategoryRowSkeleton key={idx} />
            ))}
          </>
        ) : (
          allCats.map((cat) => <CategoryRow key={cat.name} name={cat.name} products={cat.products} />)
        )}
      </div>
    </section>
  );
}

function CategoryRow({ name, products }: { name: string; products: Product[] }) {
  const router = useRouter();

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 bg-gray-200 rounded-lg pt-8 pb-4">
      <div className="mb-8 flex flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl md:text-4xl tracking-tight font-light text-neutral-900 font-[style]">{name}</h3>
          <p className="text-sm text-neutral-400 mt-1">{products.length} items</p>
        </div>
        <Button
          variant="outline"
          className="self-start md:self-auto group rounded-full px-6 h-10 text-sm font-semibold border-neutral-300 hover:bg-neutral-100 hover:text-neutral-900 transition-all active:scale-95 hover:cursor-pointer"
          onClick={() => router.push(`/shop/${encodeURIComponent(name)}`)}
        >
          <span className="relative flex items-center justify-center h-5 overflow-hidden">
            <span className="flex items-center transition-transform duration-300 ease-in-out group-hover:translate-x-5 pr-5">
              <span className="absolute -left-5 flex w-5 items-center justify-center">→</span>
              <span className="whitespace-nowrap">View All</span>
              <span className="absolute right-0 flex w-5 items-center justify-center">→</span>
            </span>
          </span>
        </Button>
      </div>

      <div className="mb-6">
        <Swiper
          modules={[FreeMode, Mousewheel]}
          slidesPerView="auto"
          spaceBetween={24}
          freeMode={{
            enabled: true,
            momentum: true,
            momentumRatio: 0.8,
            sticky: false,
          }}
          mousewheel={{
            forceToAxis: true,
          }}
          grabCursor={true}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} style={{ width: "300px" }}>
              <CardComponent product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

function CategoryRowSkeleton() {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 bg-gray-200 rounded-lg pt-8 pb-4">
      <div className="mb-8 flex flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-44" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>

      <div className="mb-6 flex gap-6 overflow-hidden">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="w-[300px] shrink-0 rounded-[8px] border border-neutral-200 bg-white p-0">
            <Skeleton className="h-64 w-full rounded-none" />
            <div className="space-y-3 px-4 pb-6 pt-3">
              <Skeleton className="h-6 w-3/4 mx-auto" />
              <Skeleton className="h-5 w-24 mx-auto rounded-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-9 w-full rounded-full mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
