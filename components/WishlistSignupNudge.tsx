"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/store";
import { useEffect, useState } from "react";

export function WishlistSignupNudge() {
  const wishlist = useUserStore((s) => s.wishlist);
  const dismissed = useUserStore((s) => s.info.wishlistSignupNudgeDismissed);
  const dismissWishlistSignupNudge = useUserStore((s) => s.dismissWishlistSignupNudge);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [showLoggedInToast, setShowLoggedInToast] = useState(false);
  const [prevLength, setPrevLength] = useState(wishlist.length);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => setIsLoggedIn(res.ok))
      .catch(() => setIsLoggedIn(false));
  }, []);

  useEffect(() => {
    if (isLoggedIn === true && wishlist.length > prevLength) {
      setShowLoggedInToast(true);
      const timer = setTimeout(() => setShowLoggedInToast(false), 3000);
      setPrevLength(wishlist.length);
      return () => clearTimeout(timer);
    }
    setPrevLength(wishlist.length);
  }, [wishlist.length, isLoggedIn, prevLength]);

  const count = wishlist.length;

  // Don't render anything while auth is loading
  if (isLoggedIn === null) return null;
  
  if (count === 0) return null;
  if (isLoggedIn && !showLoggedInToast) return null;
  if (!isLoggedIn && dismissed) return null;

  return (
    <div
      role="status"
      className="fixed left-3 right-3 top-[4.75rem] z-[45] md:left-auto md:right-6 md:top-[5.25rem] md:w-full md:max-w-md"
    >
      <div className="flex items-start gap-3 rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50/90 px-4 py-3 shadow-lg shadow-amber-900/10 backdrop-blur-sm">
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-sm font-semibold text-foreground">
            {isLoggedIn ? "Favorite added" : `Your wishlist has ${count} ${count === 1 ? "item" : "items"}`}
          </p>
          
          {!isLoggedIn && (
            <p className="mt-0.5 text-xs leading-relaxed text-neutral-600">
              Sign up to save your wishlist across devices and never lose your picks.
            </p>
          )}

          <div className="mt-2 flex flex-wrap gap-2">
            {!isLoggedIn && (
              <Button asChild size="sm" className="h-8 rounded-full bg-[#F0DDD0] text-[#3D2314] border border-[#DEC4B4] hover:bg-[#E8D0C0] hover:text-[#2C1810]">
                <Link href="/login">Create an account</Link>
              </Button>
            )}
            <Button asChild variant="outline" size="sm" className="h-8 rounded-full border-amber-300 bg-card/80">
              <Link href="/wishlist">View wishlist</Link>
            </Button>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (isLoggedIn) {
              setShowLoggedInToast(false);
            } else {
              dismissWishlistSignupNudge();
            }
          }}
          className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-card/80 hover:text-foreground"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
