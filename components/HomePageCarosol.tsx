import { HomePageCarouselClient } from "./HomePageCarouselClient";
import { HomePageCarosalHook } from "@/hooks/HomePageCarosalHook";

export async function HomePageCarosol() {
  const heroSlides = await HomePageCarosalHook()

  return <HomePageCarouselClient slides={heroSlides} />;
}
