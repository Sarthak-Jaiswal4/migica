"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useUserStore } from "@/store/store";
import { cn } from "@/lib/utils";

export type AddToCartProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  /** When omitted, treated as in stock */
  inStock?: boolean;
};

type AddToCartButtonProps = {
  product: AddToCartProduct;
  /** Matches Card grid: narrower quantity strip on compact cards */
  compact?: boolean;
  /** Set false when the button is not inside a clickable parent (e.g. wishlist row) */
  stopClickPropagation?: boolean;
  className?: string;
};

export function AddToCartButton({
  product,
  compact = false,
  stopClickPropagation = true,
  className,
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const { addItem, incrementQuantity, decrementQuantity, getItemQuantity } = useUserStore();

  const inStock = product.inStock !== false;
  const cartvalue = getItemQuantity(product.id);
  const showControls = cartvalue > 0 && !added;

  const wrapClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (stopClickPropagation) e.stopPropagation();
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    wrapClick(e);
    if (added || !inStock) return;
    setAdded(true);
    addItem({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
    });
    window.setTimeout(() => setAdded(false), 1000);
  };

  const decreaseControl = (e: React.MouseEvent) => {
    wrapClick(e);
    decrementQuantity(product.id);
  };

  const increaseControl = (e: React.MouseEvent) => {
    wrapClick(e);
    incrementQuantity(product.id);
  };

  return (
    <div className={cn("relative flex h-9 w-full items-center md:mt-1", className)}>
      <Button
        size="sm"
        disabled={!inStock}
        className={`${
          inStock
            ? `bg-gray-900 text-white shadow-md hover:bg-amber-500 hover:scale-103 hover:text-white hover:cursor-pointer shadow-black/10 ${added ? "bg-emerald-500 text-white hover:bg-emerald-500 hover:scale-103 hover:text-white hover:cursor-pointer hover:shadow-emerald-500/10 hover:shadow-black/10" : ""}`
            : "cursor-not-allowed bg-neutral-300 text-neutral-500"
        } transition-all duration-300 px-4 sm:px-4 h-9 sm:h-9 tracking-tight w-full mx-auto text-sm rounded-full overflow-hidden ${
          showControls ? "pointer-events-none absolute scale-90 opacity-0" : "scale-100 opacity-100"
        }`}
        onClick={handleAddToCart}
      >
        <span className="relative block h-6 overflow-hidden">
          <span
            className="flex flex-col transition-transform duration-300 ease-in-out"
            style={{ transform: added ? "translateY(-50%)" : "translateY(0)" }}
          >
            <span className="flex h-6 items-center justify-center whitespace-nowrap">
              {inStock ? (
                <>
                  <span className="hidden sm:inline">Add to cart</span>
                  <span className="sm:hidden">Add to cart</span>
                </>
              ) : (
                "Out of stock"
              )}
            </span>
            <span className="flex h-6 items-center justify-center whitespace-nowrap">Added ✓</span>
          </span>
        </span>
      </Button>

      <div
        className={`${compact ? "w-full sm:w-full" : "w-[70%]"} mx-auto flex h-full items-center justify-center transition-all duration-300 ease-out ${
          showControls ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none absolute scale-75 opacity-0"
        }`}
      >
        <ButtonGroup className="h-full w-full">
          <Button variant="outline" size="sm" className="flex-1 rounded-l-full" onClick={decreaseControl}>
            −
          </Button>
          <Button variant="outline" size="sm" className="pointer-events-none flex-1 justify-center font-bold">
            {cartvalue}
          </Button>
          <Button variant="outline" size="sm" className="flex-1 rounded-r-full" onClick={increaseControl}>
            +
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
