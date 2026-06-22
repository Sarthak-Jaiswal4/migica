"use client";

import { useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/store";

type ProductBasic = {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
    inStock: boolean;
};

export function WishlistButton({ product }: { product: ProductBasic }) {
    const { toggleWishlist, isInWishlist } = useUserStore();
    const wishlisted = isInWishlist(product.id);

    return (
        <Button
            variant="outline"
            size="icon"
            className="absolute top-6 right-6 bg-card/95 hover:bg-card shadow-md border-none rounded-full h-12 w-12"
            onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product);
            }}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart className={`w-6 h-6 ${wishlisted ? "fill-rose-600 text-rose-600" : ""}`} />
        </Button>
    );
}

export function WishlistButtonMobile({ product }: { product: ProductBasic }) {
    const { toggleWishlist, isInWishlist } = useUserStore();
    const wishlisted = isInWishlist(product.id);

    return (
        <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 bg-card/90 hover:bg-card"
            onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product);
            }}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart className={`w-5 h-5 ${wishlisted ? "fill-rose-600 text-rose-600" : ""}`} />
        </Button>
    );
}

export function VisitRecorder({ product }: { product: Pick<ProductBasic, "id" | "name" | "image"> }) {
    const recordVisit = useUserStore((s) => s.recordVisit);

    useEffect(() => {
        recordVisit({ id: product.id, name: product.name, image: product.image });
    }, [product.id, product.name, product.image, recordVisit]);

    return null;
}
