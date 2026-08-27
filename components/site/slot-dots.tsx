import { cn } from "@/lib/utils";
import type { Tanda } from "@/lib/data/slots";

/**
 * Two-color dot row: filled = occupied, outlined = available. Neutral/grey when the tanda
 * is still queued (not the next one up) — see lib/data/slots.ts.
 */
export function SlotDots({ tanda, className }: { tanda: Tanda; className?: string }) {
  const taken = tanda.totalSlots - tanda.freeSlots;
  const live = tanda.status === "next";

  return (
    <span className={cn("flex shrink-0 gap-[5px]", className)}>
      {Array.from({ length: tanda.totalSlots }, (_, i) => {
        const isFilled = i < taken;
        return (
          <span
            key={i}
            className={cn(
              "size-[9px] rounded-full",
              isFilled
                ? live
                  ? "bg-accent"
                  : "bg-muted-2"
                : live
                  ? "border border-accent"
                  : "border border-border"
            )}
          />
        );
      })}
    </span>
  );
}
