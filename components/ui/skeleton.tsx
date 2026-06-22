import { cn } from "@/lib/utils"

/**
 * Visible on warm off-white pages (e.g. #F6F4F1) — avoids `bg-muted` which is often indistinguishable.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-md bg-neutral-300/90 dark:bg-neutral-600",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
