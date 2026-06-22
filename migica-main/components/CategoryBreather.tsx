type Props = {
  line: string;
};

/** One-line editorial pause between category sections — not a heading, not a CTA. */
export function CategoryBreather({ line }: Props) {
  return (
    <p
      className="mx-auto max-w-3xl px-6 py-10 text-center font-[style] text-xl italic leading-relaxed tracking-tight text-neutral-600 sm:py-14 sm:text-2xl md:py-16"
    >
      {line}
    </p>
  );
}
