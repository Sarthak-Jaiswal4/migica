/** Static assets in /public used when products in Mongo have no images. */
const IMAGE_POOL = [
  "/jar candle.png",
  "/jar candle-2.png",
  "/1.jpeg",
  "/2.1.png",
  "/6.1.png",
  "/4.1.png",
  "/4.2.png",
  "/2.jpeg",
  "/3.jpeg",
  "/4.jpeg",
  "/5.jpeg",
  "/8.jpeg",
  "/8.1.png",
  "/8.2.png",
  "/9.png",
  "/9.1.png",
  "/10.1.png",
] as const;

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) >>> 0;
  }
  return h || 1;
}

export function getPresentationImages(seed: string) {
  const h = hashSeed(seed);
  const n = IMAGE_POOL.length;
  const i0 = h % n;
  const i1 = (h + 1) % n;
  const i2 = (h + 2) % n;
  const i3 = (h + 3) % n;
  const main = IMAGE_POOL[i0];
  const hover = IMAGE_POOL[i1];
  const gallery = [main, hover, IMAGE_POOL[i2], IMAGE_POOL[i3]];
  return { image: main, hoverImage: hover, images: gallery };
}

export function attachPublicImages<T extends object>(doc: T): T & { image: string; hoverImage: string; images: string[] } {
  const rec = doc as Record<string, unknown>;
  const rawId = rec._id;
  const id =
    rawId != null && typeof rawId === "object" && "toString" in rawId && typeof (rawId as { toString: () => string }).toString === "function"
      ? (rawId as { toString: () => string }).toString()
      : typeof rec.name === "string"
        ? rec.name
        : "product";
  const { image, hoverImage, images } = getPresentationImages(id);
  return { ...doc, image, hoverImage, images };
}
