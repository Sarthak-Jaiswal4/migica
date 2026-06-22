import { Headers } from "@/components/Headers";
import { Footer } from "@/components/Footer";

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-neutral-200" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-neutral-200 rounded w-3/4" />
        <div className="h-3 bg-neutral-200 rounded w-1/2" />
        <div className="h-8 bg-neutral-200 rounded-xl mt-3" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <Headers />
      <div className="border-b bg-card/80 backdrop-blur-md z-40 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="h-10 w-56 bg-neutral-200 animate-pulse rounded-lg" />
          <div className="h-4 w-64 bg-neutral-200 animate-pulse rounded mt-2" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
