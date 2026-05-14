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
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="h-10 w-56 bg-neutral-200 animate-pulse rounded-lg" />
                                <div className="h-4 w-64 bg-neutral-200 animate-pulse rounded mt-2" />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="h-10 flex-1 bg-neutral-200 animate-pulse rounded-lg" />
                            <div className="h-10 w-full sm:w-[200px] bg-neutral-200 animate-pulse rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="hidden lg:block lg:w-64">
                        <div className="rounded-xl border border-border bg-card shadow-sm p-6 space-y-6 animate-pulse">
                            <div className="h-5 w-28 bg-neutral-200 rounded" />
                            <div className="flex flex-wrap gap-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="h-6 w-16 bg-neutral-200 rounded-full" />
                                ))}
                            </div>
                            <div className="h-5 w-28 bg-neutral-200 rounded mt-4" />
                            <div className="h-2 bg-neutral-200 rounded-full" />
                        </div>
                    </aside>
                    <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
