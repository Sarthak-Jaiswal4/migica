"use client";

import { AppImage as Image } from "@/components/AppImage";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { Headers } from "@/components/Headers";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/store";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/AddToCartButton";
export default function WishlistPage() {
  const wishlist = useUserStore((s) => s.wishlist);
  const recentlyVisited = useUserStore((s) => s.recentlyVisited);
  const removeFromWishlist = useUserStore((s) => s.removeFromWishlist);

  const recentNotInWishlist = recentlyVisited
    .filter((r) => !wishlist.some((w) => w.id === r.id))
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Headers />

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-[style] text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
              Your wishlist
            </h1>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              Saved on this device — sign up later to sync everywhere.
            </p>
          </div>
          <Button asChild variant="outline" className="w-fit rounded-full border-neutral-300">
            <Link href="/shop/all">Continue shopping</Link>
          </Button>
        </div>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-card/60 py-20 text-center">
            <div className="mb-4 rounded-full bg-rose-50 p-4">
              <Heart className="h-10 w-10 text-rose-400" strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">No saved items yet</h2>
            <p className="mt-2 max-w-sm text-sm font-medium text-muted-foreground px-6 mx-auto">
              Tap the heart on any product to build a list of things you love.
            </p>
            <Button asChild className="mt-6 rounded-full bg-[#F0DDD0] text-[#3D2314] border border-[#DEC4B4] hover:bg-[#E8D0C0] hover:text-[#2C1810] px-8 w-fit mx-auto transition-all duration-300">
              <Link href="/shop/all">Explore Collection</Link>
            </Button>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {wishlist.map((item) => (
              <li
                key={item.id}
                className="flex gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <Link
                  href={`/product/${item.id}`}
                  className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-neutral-100"
                >
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="112px" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link href={`/product/${item.id}`} className="font-semibold pb-1 text-foreground hover:text-amber-700">
                    {item.name}
                  </Link>
                  <Badge variant="outline" className="mb-4 w-fit px-3 py-1 text-neutral-600 bg-card/50">
                    {item.category}
                  </Badge>
                  <p className="mt-auto pl-1 text-lg font-medium tracking-tight text-foreground">₹{item.price}</p>
                  <div className="mt-3 flex flex-wrap items-end gap-3">
                    <div className="min-w-0 flex-1 basis-[min(100%,220px)]">
                      <AddToCartButton
                        product={{
                          id: item.id,
                          name: item.name,
                          category: item.category,
                          price: item.price,
                          image: item.image,
                          inStock: item.inStock,
                        }}
                        compact
                        stopClickPropagation={false}
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="shrink-0 text-muted-foreground hover:text-red-600"
                      onClick={() => removeFromWishlist(item.id)}
                      aria-label={`Remove ${item.name} from wishlist`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {recentNotInWishlist.length > 0 && (
          <section className="mt-14 border-t border-border/80 pt-10">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Recently viewed</h2>
            <ul className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {recentNotInWishlist.map((r) => (
                <li key={r.id} className="w-28 shrink-0">
                  <Link href={`/product/${r.id}`} className="block">
                    <div className="relative mb-2 aspect-square overflow-hidden rounded-lg bg-neutral-100">
                      <Image src={r.image} alt={r.name} fill className="object-cover" sizes="112px" />
                    </div>
                    <p className="line-clamp-2 text-xs font-medium text-foreground">{r.name}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
