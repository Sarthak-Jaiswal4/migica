"use client";

import { useEffect } from "react";
import type { Product } from "@/lib/product";
import { useProductStore } from "@/store/store";

/** Seeds the client product pool so subcategory navigation can filter without refetching. */
export function ShopCatalogHydrator({ products }: { products: Product[] }) {
  const hydrateProductsPool = useProductStore((s) => s.hydrateProductsPool);

  useEffect(() => {
    hydrateProductsPool(products);
  }, [products, hydrateProductsPool]);

  return null;
}
