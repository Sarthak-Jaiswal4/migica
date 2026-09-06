import Link from "next/link";
import { AppImage as Image } from "@/components/AppImage";

const CATEGORIES = [
  {
    slug: "candles",
    label: "Candles",
    image: "/Gemini_Generated_Image_q46hioq46hioq46h.png",
    gradient: "from-[#fde8d0] to-[#f5c99a]",
  },
  {
    slug: "scarves",
    label: "Scarves",
    image: "/Gemini_Generated_Image_798f48798f48798f.png",
    gradient: "from-[#c8e8f5] to-[#8ecde8]",
  },
  {
    slug: "jewellery",
    label: "Jewellery",
    image: "/Gemini_Generated_Image_4acm4v4acm4v4acm.png",
    gradient: "from-[#f5d4eb] to-[#e8a8d8]",
  },
  {
    slug: "clothing",
    label: "Clothing",
    image: "/Gemini_Generated_Image_ubipc0ubipc0ubip.png",
    gradient: "from-[#c8f0e4] to-[#8edfc8]",
  },
  {
    slug: "gifts",
    label: "Gifts",
    image: "/Gemini_Generated_Image_ecqe6wecqe6wecqe.png",
    gradient: "from-[#f5e8c8] to-[#e8d08a]",
  },
];

export function CategoryGrid() {
  return (
    <section className="bg-background px-4 py-10 md:py-16">
      <div className="mx-auto max-w-6xl">
        {/* Centered heading */}
        <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Collections
        </p>
        <h2 className="mb-8 text-center font-[style] text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:mb-12 md:text-4xl">
          Shop by Category
        </h2>

        {/* Mobile: 3-col grid | Desktop: single centered row of small cards */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:flex-nowrap md:justify-center md:gap-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop/${cat.slug}`}
              className="group flex w-[30%] flex-col items-center sm:w-[30%] md:w-[130px] lg:w-[150px]"
            >
              {/* Arch card — no label overlay inside */}
              <div
                className={`relative w-full overflow-hidden bg-gradient-to-b ${cat.gradient} transition-all duration-300 group-hover:scale-[1.04] group-hover:shadow-lg`}
                style={{
                  borderRadius: "50% 50% 14px 14px / 38% 38% 14px 14px",
                }}
              >
                {/* Aspect ratio — slightly taller than wide */}
                <div
                  className="relative w-full"
                  style={{ paddingBottom: "118%" }}
                >
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 33vw, 160px"
                  />
                </div>
              </div>

              {/* Label below the arch — brand editorial style */}
              <div className="mt-3 flex flex-col items-center gap-0.5">
                <span className="font-[style] text-sm font-semibold tracking-wide text-foreground transition-colors duration-200 group-hover:text-[#C9956C] sm:text-[15px] md:text-base">
                  {cat.label}
                </span>
                <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-[10px]">
                  Shop Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
