import { AppImage as Image } from "@/components/AppImage";

const exhibitions = [
  {
    title: "Dayal Gateway Paradise Mother’s Day Event 2026",
    location: "Bandra, Mumbai",
    description: "Our first major public exhibition. 200+ visitors in a single afternoon, 3 wholesale inquiries, and the booth that started the stockist conversation.",
    image: "/my-4.jpeg",
    alt: "Silver Star booth at Maker's Market Mumbai with candles on display",
    span: "lg:col-span-2",
    aspectClass: "aspect-[11/7]",
    objectPosition: "top",
  },
  {
    title: "Craft Collective Goa 2023",
    location: "Panaji, Goa",
    description: "Beachside setting, a pop-up with five other indie studios. Introduced the linen scarf for the first time.",
    image: "/my-1.jpeg",
    alt: "Silver Star pop-up at Craft Collective Goa",
    span: "lg:col-span-1",
    aspectClass: "aspect-[3/4]",
  },
  {
    title: "Diwali Festive Edit 2023",
    location: "Hilton Garden, Lucknow",
    description: "Curated gifting sets, festive editions, and the debut of brass taper holders.",
    image: "/my-2.jpeg",
    alt: "Silver Star festive gifting display during Diwali edit",
    span: "lg:col-span-1",
    aspectClass: "aspect-[3/4]",
  },
  {
    title: "Artisan Fair Delhi 2024",
    location: "Shalimar Gateway mall, Lucknow",
    description: "North India debut. Introduced the jewellery line alongside candles and scarves.",
    image: "/my-3.jpeg",
    alt: "Silver Star artisan fair booth in Delhi",
    span: "lg:col-span-1",
    aspectClass: "aspect-[3/4]",
  },
  {
    title: "Teej festive exhibition 2026",
    location: "Casayan lnn hotel, Lucknow",
    description: " 1-Award received by  Mayor of Lucknow {Sushma kharakwar) Best Exhibitor Received by President of Mahila Aayog LucknowWinner Festive  Queen👸Best Rampwalk Best Performer.",
    image: "/my-5.jpeg",
    alt: "Silver Star boutique pop-up in Bangalore",
    span: "lg:col-span-2",
    aspectClass: "aspect-video",
  },
];

export function ExhibitionGallery() {
  return (
    <section
      className="w-full bg-[#EDE8E2] py-20 md:py-28 border-y border-border/60"
      aria-labelledby="exhibition-heading"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground mb-3">
            In person
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2
              id="exhibition-heading"
              className="font-[style] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl max-w-sm"
            >
              Exhibitions &amp; pop-ups
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600 max-w-md">
              We love meeting people face to face. Every fair teaches us something — a scent that
              resonates, a texture someone reaches for first, a question we hadn't thought to answer.
            </p>
          </div>
        </div>

        {/* Bento-style grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exhibitions.map((ex) => (
            <div
              key={ex.title}
              className={`group relative overflow-hidden rounded-2xl bg-card shadow-sm ${ex.span}`}
            >
              <div className={`relative w-full ${ex.aspectClass} overflow-hidden`}>
                <Image
                  src={ex.image}
                  alt={ex.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ objectPosition: ex.objectPosition ?? "center" }}
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Location badge */}
                <span className="absolute top-3 left-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                  {ex.location}
                </span>

                {/* Text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-[style] text-lg font-semibold text-white leading-tight">
                    {ex.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/75 line-clamp-2">
                    {ex.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming tag */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-muted-foreground">
            More exhibitions coming in 2026 — follow @silverstar.live
            to stay updated
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
      </div>
    </section>
  );
}
