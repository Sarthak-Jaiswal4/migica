import { AppImage as Image } from "@/components/AppImage";
import { Instagram } from "lucide-react";

export function OwnerSection() {
  return (
    <section
      className="w-full bg-[#F4EFE8] border-y border-border/60 py-20 md:py-28"
      aria-labelledby="owner-heading"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <div className="grid gap-14 md:grid-cols-2 md:items-center md:gap-20">
          {/* Portrait */}
          <div className="relative">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl shadow-xl">
              <Image
                src="/my.jpeg"
                alt="Priya Sharma, founder of Silver Star"
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 50vw"
              />
              {/* Warm vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-3xl" />
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-6 -right-4 md:-right-8 rounded-2xl bg-white/90 backdrop-blur-sm border border-border shadow-lg p-5 w-44">
              <p className="text-3xl font-[style] font-semibold text-foreground">15+</p>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">Years of handcrafting magic</p>
            </div>

            {/* Accent line */}
            <div className="absolute -top-4 -left-4 w-24 h-24 rounded-2xl border-2 border-[#C9956C]/40 -z-10" />
          </div>

          {/* Text */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground mb-4">
              Meet the maker
            </p>
            <h2
              id="owner-heading"
              className="font-[style] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              Shalini Agarwal
            </h2>
            <p className="mt-1 text-sm font-medium text-[#C9956C]">Founder & Creative Director</p>

            <div className="mt-8 space-y-5 text-base leading-relaxed text-neutral-700">
              <p>
                Before Silver Star existed, Shalini was a textile designer in Mumbai who couldn't stop
                experimenting with fragrance on the side. Weekend markets, borrowed copper pots, and
                notebooks full of scent ratios — that's how the first candles were born.
              </p>
              <p>
                She left her corporate job in 2021 to pursue the studio full-time. Her philosophy is
                simple: <em className="not-italic font-semibold text-foreground">"Nothing ships that I wouldn't keep for myself."</em>
                That bar hasn't lowered as the team has grown.
              </p>
              <p>
                Outside the studio, Shalini obsesses over monsoon walks, second-hand pottery finds, and
                the kind of tea that steeps exactly four minutes. She answers the @silverstar DMs herself.
              </p>
            </div>

            {/* Signature + social */}
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <div>
                <p className="font-[style] text-2xl text-foreground italic">Shalini Agarwal</p>
                <p className="text-xs text-muted-foreground mt-0.5">Founder, Silver Star</p>
              </div>
              <a
                href="https://www.instagram.com/silverstar.live?stkn=MWluZ3M0NzJhcXBkeg%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-[#C9956C] transition-colors border border-border rounded-full px-4 py-2"
              >
                <Instagram size={15} />
                @silverstar.live
              </a>
            </div>

            {/* Values row */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { label: "Small-batch", sub: "every pour" },
                { label: "India-made", sub: "end to end" },
                { label: "No rush", sub: "quality first" },
              ].map((v) => (
                <div key={v.label} className="rounded-xl bg-white/80 border border-border p-4 text-center">
                  <p className="text-sm font-semibold text-foreground">{v.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{v.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
