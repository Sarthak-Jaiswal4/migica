export type CategoryLayoutVariant =
  | "stack-top"
  | "split-image-left"
  | "split-image-right";

export type CategoryLayoutConfig = {
  variant: CategoryLayoutVariant;
  image: string;
  imageAlt: string;
  objectPosition?: string;
  /** Tailwind classes for the image container aspect / min-height */
  imageFrameClass: string;
  caption?: string;
};

/** One-line brand copy shown after each category (except the last). */
export const CATEGORY_BREATHERS: Record<string, string> = {
  candles: "Every scent tells a story.",
  scarves: "Worn close, made carefully.",
  jewelry: "The details are everything.",
  jewellery: "The details are everything.",
  gift: "Given with intention.",
  gifts: "Given with intention.",
  clothing: "Style that speaks for itself.",
};

const LAYOUTS: Record<string, CategoryLayoutConfig> = {
  candles: {
    variant: "stack-top",
    image: "/2.jpeg",
    imageAlt: "Candle lit on a dark surface with a warm glow",
    objectPosition: "center",
    imageFrameClass: "aspect-[21/7] min-h-[120px] sm:min-h-[160px] w-full",
    caption: "Warm light, slow evenings",
  },
  scarves: {
    variant: "split-image-left",
    image: "/1.jpeg",
    imageAlt: "Person wearing a scarf in soft natural light",
    objectPosition: "center top",
    imageFrameClass: "min-h-[200px] w-full lg:min-h-[280px] lg:h-full aspect-[4/5] lg:aspect-auto",
    caption: "Wear it, feel it",
  },
  jewelry: {
    variant: "stack-top",
    image: "/3.jpeg",
    imageAlt: "Close-up of jewellery — hand with a ring, neck with a necklace",
    objectPosition: "center 35%",
    imageFrameClass: "aspect-[21/7] min-h-[120px] sm:min-h-[160px] w-full",
    caption: "Craft in the detail",
  },
  gifts: {
    variant: "split-image-right",
    image: "/4.jpeg",
    imageAlt: "Styled flat lay of gift products arranged together",
    objectPosition: "center",
    imageFrameClass: "min-h-[200px] w-full lg:min-h-[280px] lg:h-full aspect-square lg:aspect-auto",
    caption: "For her birthday · for the home",
  },
  clothing: {
    variant: "split-image-left",
    image: "/5.jpeg",
    imageAlt: "Person wearing a t-shirt in a candid everyday setting",
    objectPosition: "center",
    imageFrameClass: "min-h-[200px] w-full lg:min-h-[280px] lg:h-full aspect-[4/5] lg:aspect-auto",
    caption: "Everyday, not studio",
  },
  jewellery: {
    variant: "stack-top",
    image: "/3.jpeg",
    imageAlt: "Close-up of jewellery",
    objectPosition: "center 35%",
    imageFrameClass: "aspect-[21/7] min-h-[120px] sm:min-h-[160px] w-full",
    caption: "Craft in the detail",
  },
};

/** Index (0-based) after which to insert the mid-page bestseller block — after Jewelry (3rd category). */
export const BESTSELLER_INSERT_AFTER_INDEX = 2;

export const CATEGORY_DISPLAY_ORDER = [
  "candles",
  "scarves",
  "jewellery",
  "gifts",
  "clothing",
] as const;

function normalizeCategoryKey(name: string): string {
  const n = name.trim().toLowerCase();
  if (n === "jewelry") return "jewellery";
  if (n === "gift") return "gifts";
  if (n === "t-shirts" || n === "tshirts" || n === "t shirts" || n === "t-shirt") return "clothing";
  if (n === "candle") return "candles";
  return n;
}

export function getCategoryLayout(name: string): CategoryLayoutConfig | null {
  return LAYOUTS[normalizeCategoryKey(name)] ?? null;
}

export function getBreatherAfterCategory(name: string): string | null {
  return CATEGORY_BREATHERS[normalizeCategoryKey(name)] ?? null;
}

export function sortCategoriesByDisplayOrder<T extends { name: string }>(categories: T[]): T[] {
  return [...categories].sort((a, b) => {
    const ai = CATEGORY_DISPLAY_ORDER.findIndex(
      (c) => c.toLowerCase() === a.name.toLowerCase()
    );
    const bi = CATEGORY_DISPLAY_ORDER.findIndex(
      (c) => c.toLowerCase() === b.name.toLowerCase()
    );
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
}
