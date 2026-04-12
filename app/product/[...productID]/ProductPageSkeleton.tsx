"use client";

import { cn } from "@/lib/utils";
import { Headers } from "@/components/Headers";
import { Footer } from "@/components/Footer";
import { Separator } from "@/components/ui/separator";

/** Large product / card image placeholder — clearly not final text. */
function ImageSkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex w-full overflow-hidden rounded-sm border border-neutral-300/90 bg-neutral-100 shadow-sm lg:rounded-2xl",
        "aspect-[3/4]",
        className
      )}
    >
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-neutral-200 via-neutral-300/90 to-neutral-200" />
      <div className="pointer-events-none relative z-[1] m-auto flex flex-col items-center justify-center gap-1.5 px-6 text-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500">Photo</span>
        <span className="text-xs font-medium text-neutral-400">Loading image…</span>
      </div>
    </div>
  );
}

/** Staggered lines + “incoming” label like streaming placeholder text. */
function TextIncomingLines({
  label,
  widths = [100, 100, 88, 64],
  className,
}: {
  label: string;
  widths?: number[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-2.5", className)}>
      {label ? (
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">{label}</p>
      ) : null}
      <div className="space-y-2">
        {widths.map((pct, i) => (
          <div
            key={i}
            className="h-3.5 animate-pulse rounded-sm bg-neutral-300/95 dark:bg-neutral-600"
            style={{ width: `${pct}%`, animationDelay: `${i * 90}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export function ProductPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F6F4F1]" aria-busy="true" aria-label="Loading product">
      <Headers />
      <div className="mx-auto mt-20 max-w-7xl overflow-x-clip px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-8" aria-hidden>
          <TextIncomingLines label="Navigation" widths={[14, 12, 20, 32]} />
        </nav>

        <div className="mb-16 flex flex-col gap-12 lg:flex-row lg:items-start">
          <div className="w-full space-y-6 lg:w-[55%]">
            <ImageSkeletonBlock />
            <ImageSkeletonBlock className="hidden lg:block" />
          </div>

          <div className="w-full space-y-7 lg:w-[45%] lg:flex-shrink-0">
            <div className="h-7 w-28 animate-pulse rounded-full bg-neutral-300/95" />
            <TextIncomingLines label="Title incoming" widths={[92, 72]} className="space-y-3" />
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 w-4 animate-pulse rounded-sm bg-neutral-300/95"
                    style={{ animationDelay: `${i * 60}ms` }}
                  />
                ))}
              </div>
              <div className="h-4 w-10 animate-pulse rounded-sm bg-neutral-300/95" />
              <div className="h-4 w-28 animate-pulse rounded-sm bg-neutral-300/95" />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="h-10 w-36 animate-pulse rounded-md bg-neutral-300/95" />
              <div className="h-8 w-24 animate-pulse rounded-md bg-neutral-300/95" />
            </div>
            <TextIncomingLines label="Description incoming" widths={[100, 100, 96, 88, 52]} />
            <div className="h-14 w-full animate-pulse rounded-2xl bg-neutral-300/95" />
            <div className="h-14 w-full animate-pulse rounded-xl bg-neutral-300/95" />
            <Separator className="bg-neutral-200" />
            <div className="space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Features incoming</p>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-neutral-300/95" />
                  <div
                    className="h-3.5 max-w-md flex-1 animate-pulse rounded-sm bg-neutral-300/95"
                    style={{ animationDelay: `${i * 80}ms` }}
                  />
                </div>
              ))}
            </div>
            <Separator className="bg-neutral-200" />
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex h-28 flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white/80 p-3 shadow-sm"
                >
                  <div className="h-8 w-8 animate-pulse rounded-md bg-neutral-300/90" />
                  <div className="h-2.5 w-14 animate-pulse rounded-sm bg-neutral-300/90" />
                  <div className="h-2 w-20 animate-pulse rounded-sm bg-neutral-300/80" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="flex h-14 w-full gap-1 rounded-xl border border-neutral-200 bg-neutral-100/90 p-0.5 sm:h-16 sm:gap-2 sm:rounded-2xl">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-full flex-1 animate-pulse rounded-lg bg-neutral-300/70 sm:rounded-xl"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm sm:rounded-2xl sm:p-8">
            <TextIncomingLines label="Tab content incoming" widths={[100, 100, 92, 48, 100, 100, 78]} />
          </div>
        </div>

        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Related items</p>
        <div className="flex gap-4 overflow-hidden pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-[260px] shrink-0 space-y-3 sm:w-[300px]">
              <ImageSkeletonBlock className="rounded-[8px]" />
              <TextIncomingLines label="" widths={[88, 36]} className="space-y-2" />
              <div className="flex items-center justify-between border-t border-neutral-200/80 pt-3">
                <div className="h-6 w-20 animate-pulse rounded-sm bg-neutral-300/95" />
                <div className="h-8 w-24 animate-pulse rounded-full bg-neutral-300/95" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
