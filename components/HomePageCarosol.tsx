import { HomePageCarouselClient, HeroSlide } from "./HomePageCarouselClient";

const slides: HeroSlide[] = [
  {
    imageSrc: "/9.1.png",
    imageAlt: "Soft candlelight and shadows in a quiet room", 
    eyebrow: "Silver Star",
    headline: "For the evenings you don't want to end.",
    body: "Hand-poured light, metal and cloth we actually live with — nothing loud, everything meant to stay in the room after you leave.",
    primaryHref: "/shop/all",
    primaryLabel: "Wander the shelves",
  },
  {
    imageSrc: "/8.1.png",
    imageAlt: "Close detail of jewellery and warm tones",
    eyebrow: "Jewellery & ritual",
    headline: "The kind of shine you forget you're wearing.",
    body: "Pieces that catch light at dinner, not under fluorescent aisles. Candles that reward slowing down — emotional buys deserve a feeling first, a cart second.",
    primaryHref: "/shop/Jewelry",
    primaryLabel: "See the edit",
  },
];

export function HomePageCarosol() {
  return <HomePageCarouselClient slides={slides} />;
}
