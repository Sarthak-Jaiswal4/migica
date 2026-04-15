"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/store";

export function WishlistSignupNudge() {
  const wishlist = useUserStore((s) => s.wishlist);
  const dismissed = useUserStore((s) => s.info.wishlistSignupNudgeDismissed);
  const dismissWishlistSignupNudge = useUserStore((s) => s.dismissWishlistSignupNudge);

  const count = wishlist.length;
  if (count === 0 || dismissed) return null;

  return (
    <div
      role="status"
      className="fixed left-3 right-3 top-[4.75rem] z-[45] md:left-auto md:right-6 md:top-[5.25rem] md:w-full md:max-w-md"
    >
      <div className="flex items-start gap-3 rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50/90 px-4 py-3 shadow-lg shadow-amber-900/10 backdrop-blur-sm">
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-sm font-semibold text-neutral-900">
            Your wishlist has {count} {count === 1 ? "item" : "items"}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-neutral-600">
            Sign up to save your wishlist across devices and never lose your picks.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button asChild size="sm" className="h-8 rounded-full bg-neutral-900 text-white hover:bg-neutral-800">
              <Link href="/login">Create an account</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="h-8 rounded-full border-amber-300 bg-white/80">
              <Link href="/wishlist">View wishlist</Link>
            </Button>
          </div>
        </div>
        <button
          type="button"
          onClick={dismissWishlistSignupNudge}
          className="shrink-0 rounded-full p-1 text-neutral-500 transition-colors hover:bg-white/80 hover:text-neutral-900"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
