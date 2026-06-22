"use client";

import { useEffect, useState } from "react";
import { DiscountPopup } from "@/components/DiscountPopup";
import { usePathname } from "next/navigation";

const POPUP_DELAY_MS = 10_000;
const SESSION_KEY = "silver_star_discount_popup_seen";

export function AppInitializer() {
  const [showDiscount, setShowDiscount] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      return;
    }

    if (pathname === "/coming-soon") return;

    const id = window.setTimeout(() => {
      setShowDiscount(true);
    }, POPUP_DELAY_MS);

    return () => window.clearTimeout(id);
  }, [pathname]);

  const handleDiscountClose = () => {
    setShowDiscount(false);
    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      // private mode / disabled storage
    }
  };

  return (
    <DiscountPopup
      open={showDiscount}
      onClose={handleDiscountClose}
    />
  );
}
