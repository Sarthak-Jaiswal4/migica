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
  large?: boolean;
  className?: string;
};

export function AddToCartButton({
  product,
  compact = false,
  stopClickPropagation = true,
  large = false,
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
    <div className={cn("relative flex w-full items-center md:mt-1", large ? "h-12" : "h-9", className)}>
      <Button
        size="sm"
        disabled={!inStock}
        className={`${
          inStock
            ? `bg-[#1a1a1a] text-white border-0 shadow-none hover:bg-black hover:text-white hover:cursor-pointer ${added ? "bg-emerald-600 text-white hover:bg-emerald-600 hover:text-white hover:cursor-pointer" : ""}`
            : "cursor-not-allowed bg-neutral-300 text-muted-foreground"
        } transition-all duration-300 px-4 sm:px-4 tracking-tight w-full mx-auto rounded-xl overflow-hidden ${
          large ? "h-12 sm:h-12 text-md font-normal" : "h-9 sm:h-9 text-sm"
        } ${
          showControls ? "pointer-events-none absolute scale-90 opacity-0" : "scale-100 opacity-100"
        }`}
        onClick={handleAddToCart}
      >
        <span className="relative block h-6 overflow-hidden">
          <span
            className="flex flex-col transition-transform duration-300 ease-in-out"
            style={{ transform: added ? "translateY(-50%)" : "translateY(0)" }}
          >
            <span aria-hidden={added} className="flex h-6 items-center justify-center whitespace-nowrap">
              {inStock ? "Add to cart" : "Out of stock"}
            </span>
            <span aria-hidden={!added} className="flex h-6 items-center justify-center whitespace-nowrap">Added ✓</span>
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
