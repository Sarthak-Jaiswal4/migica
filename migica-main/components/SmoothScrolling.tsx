"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScrolling({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tickerRaf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerRaf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerRaf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
