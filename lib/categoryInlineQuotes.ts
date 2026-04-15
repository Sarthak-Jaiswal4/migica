/** Inline social proof keyed by category name as returned from the API */

export type CategoryInlineQuote = {
  quote: string;
  /** First name + city optional */
  attribution: string;
};

const QUOTES: Record<string, CategoryInlineQuote> = {
  Gift: {
    quote: "I bought this for my sister's birthday and she cried — not sad tears. The candle + scarf combo felt like I'd planned it for weeks.",
    attribution: "Aditi · ordered Gift picks",
  },
  Candles: {
    quote: "Burns even, no soot ring after a month of nightly use. I stopped buying supermarket jars after this.",
    attribution: "Vikram · Candles",
  },
  Jewelry: {
    quote: "Subtle enough for work Zooms, still gets compliments at dinner. Didn't expect this price point to feel this solid.",
    attribution: "Leah · Jewelry",
  },
  Scarves: {
    quote: "The weight is right for Bengaluru evenings — not flimsy, not blanket-thick. Colour was true to the photos.",
    attribution: "Farah · Scarves",
  },
  "T-Shirt": {
    quote: "Fabric held up after several washes; neckline didn't bacon. My partner stole the second one I ordered.",
    attribution: "Dev · T-Shirt",
  },
};

export function getInlineQuoteForCategory(categoryName: string): CategoryInlineQuote | null {
  const direct = QUOTES[categoryName];
  if (direct) return direct;
  const trimmed = categoryName.trim();
  const hit = Object.keys(QUOTES).find((k) => k.toLowerCase() === trimmed.toLowerCase());
  return hit ? QUOTES[hit] : null;
}
