import Link from "next/link";
import { AppImage as Image } from "@/components/AppImage";

const CATEGORIES = [
  {
    slug: "candles",
    label: "Candles",
    image: "/2.jpeg",
    gradient: "from-[#fde8d0] to-[#f5c99a]",
  },
  {
    slug: "scarves",
    label: "Scarves",
    image: "/1.jpeg",
    gradient: "from-[#c8e8f5] to-[#8ecde8]",
  },
  {
    slug: "jewellery",
    label: "Jewellery",
    image: "/3.jpeg",
    gradient: "from-[#f5d4eb] to-[#e8a8d8]",
  },
  {
    slug: "clothing",
    label: "Clothing",
    image: "/5.jpeg",
    gradient: "from-[#c8f0e4] to-[#8edfc8]",
  },
  {
    slug: "gifts",
    label: "Gifts",
    image: "/4.jpeg",
    gradient: "from-[#f5e8c8] to-[#e8d08a]",
  },
];

export function CategoryGrid() {
  return (
    <section className="bg-background px-4 py-10 md:py-16">
      <div className="mx-auto max-w-6xl">
        {/* Centered heading */}
        <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:mb-12 md:text-4xl">
          Shop by category
        </h2>

        {/* Mobile: 3-col grid | Desktop: single centered row of small cards */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:flex-nowrap md:justify-center md:gap-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop/${cat.slug}`}
              className="group flex w-[30%] flex-col items-center sm:w-[30%] md:w-[130px] lg:w-[150px]"
            >
              {/* Arch card */}
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
                  {/* Bottom label */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/55 px-1.5 py-1.5 text-center backdrop-blur-[2px]">
                    <span className="text-[10px] font-semibold leading-none tracking-wide text-white sm:text-[11px] md:text-xs">
                      {cat.label}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
