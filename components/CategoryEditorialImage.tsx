import { AppImage as Image } from "@/components/AppImage";
import type { CategoryLayoutConfig } from "@/lib/categoryLayouts";

type Props = {
  config: Pick<
    CategoryLayoutConfig,
    "image" | "imageAlt" | "objectPosition" | "imageFrameClass" | "caption"
  >;
  className?: string;
};

/**
 * Shared warm art direction across all category lifestyle images:
 * soft contrast, muted saturation, amber-tinted light — one visual language, varied composition.
 */
export function CategoryEditorialImage({ config, className = "" }: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-[#2a2018] ${config.imageFrameClass} ${className}`}
    >
      <Image
        src={config.image}
        alt={config.imageAlt}
        fill
        className="object-cover brightness-[0.92] contrast-[1.04] saturate-[0.88] sepia-[0.12]"
        style={{ objectPosition: config.objectPosition ?? "center" }}
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      {/* Unified warm overlay — same light quality and mood on every category */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#1f1812]/80 via-[#3d2e1f]/25 to-[#f4efe8]/8 mix-blend-multiply"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[#c4a574]/10"
        aria-hidden
      />
      {config.caption ? (
        <p className="absolute bottom-4 left-4 right-4 font-[style] text-lg tracking-tight text-white/95 sm:text-xl">
          {config.caption}
        </p>
      ) : null}
    </div>
  );
}
