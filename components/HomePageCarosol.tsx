import { HomePageCarouselClient, HeroSlide } from "./HomePageCarouselClient";
import type { HeroMedia } from "@/lib/showcase";
import { HomePageCarosalHook } from "@/hooks/HomePageCarosalHook";

export async function HomePageCarosol() {
  let heroSlides= await HomePageCarosalHook()

  return <HomePageCarouselClient slides={heroSlides} />;
}
