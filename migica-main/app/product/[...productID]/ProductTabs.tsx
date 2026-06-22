"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ProductTabsProps = {
  product: {
    name: string;
    description?: string;
    rating: number;
    reviews: number;
    scent: { top: string; middle: string; base: string };
  };
};

export function ProductTabs({ product }: ProductTabsProps) {
  return (
    <Tabs defaultValue="description" className="mb-16">
      <TabsList className="flex h-auto min-h-11 w-full flex-nowrap items-center justify-start gap-1 overflow-x-auto overflow-y-hidden rounded-xl border border-border bg-neutral-100/80 p-1 [scrollbar-width:thin] backdrop-blur-sm sm:min-h-12 sm:gap-2 sm:rounded-2xl sm:p-1.5 lg:overflow-x-visible">
        <TabsTrigger
          value="description"
          className="h-auto min-h-10 shrink-0 rounded-lg px-3 py-2.5 text-sm whitespace-nowrap data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-md sm:min-h-11 sm:rounded-xl sm:px-6 sm:py-3 sm:text-base"
        >
          Description
        </TabsTrigger>
        <TabsTrigger
          value="scent"
          className="h-auto min-h-10 shrink-0 rounded-lg px-3 py-2.5 text-sm whitespace-nowrap data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-md sm:min-h-11 sm:rounded-xl sm:px-6 sm:py-3 sm:text-base"
        >
          Scent Profile
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="h-auto min-h-10 shrink-0 rounded-lg px-3 py-2.5 text-sm whitespace-nowrap data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-md sm:min-h-11 sm:rounded-xl sm:px-6 sm:py-3 sm:text-base"
        >
          Reviews ({product.reviews})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6">
        <div className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm sm:rounded-2xl sm:p-10">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed tracking-wide text-neutral-700">
              {product.description}
            </p>
            <h3 className="mt-10 mb-5 font-[style] text-2xl font-medium tracking-tight text-foreground">
              What Makes It Special
            </h3>
            <p className="leading-relaxed tracking-wide text-neutral-600">
              {product.name} is part of our living catalog: details and inventory are maintained in
              our database, while photography is rendered from curated assets in the public gallery
              so the storefront stays fast and consistent.
            </p>
            <p className="mt-4 leading-relaxed tracking-wide text-neutral-600">
              Read the scent profile and features tabs for specifics. If something feels unclear,
              reach out before you buy—we are happy to help you pick the right piece.
            </p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="scent" className="mt-6">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:rounded-2xl sm:p-8">
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-semibold tracking-wide">Top Notes</h3>
              <p className="text-neutral-700">{product.scent.top}</p>
            </div>
            <Separator />
            <div>
              <h3 className="mb-2 text-lg font-semibold tracking-wide">Middle Notes</h3>
              <p className="text-neutral-700">{product.scent.middle}</p>
            </div>
            <Separator />
            <div>
              <h3 className="mb-2 text-lg font-semibold tracking-wide">Base Notes</h3>
              <p className="text-neutral-700">{product.scent.base}</p>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        <div className="space-y-6 rounded-xl border border-border bg-card p-4 tracking-wide shadow-sm sm:rounded-2xl sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <span className="text-5xl font-bold">{product.rating}</span>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-neutral-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-neutral-600">{product.reviews} reviews</p>
                </div>
              </div>
            </div>
            <Button variant="outline">Write a Review</Button>
          </div>

          <div className="space-y-6">
            <p className="py-8 text-center text-neutral-600">
              No written reviews yet. Aggregate rating reflects catalog metadata from the database.
            </p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
