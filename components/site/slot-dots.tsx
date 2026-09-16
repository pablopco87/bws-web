import { cn } from "@/lib/utils";
import type { Tanda } from "@/lib/data/slots";

/** One dot = one whole slot = 2 half-slot units — see the comment on Tanda in lib/data/slots.ts. */
const HALF_UNITS_PER_DOT = 2;

/**
 * Three-state dot row: filled = slot fully occupied, half-filled = one half-slot booked within
 * that slot, outlined = fully available. Neutral/grey when the tanda is still queued (not the
 * next one up) — see lib/data/slots.ts.
 */
export function SlotDots({ tanda, className }: { tanda: Tanda; className?: string }) {
  const taken = tanda.totalHalfSlots - tanda.freeHalfSlots;
  const live = tanda.status === "next";
  const dotCount = tanda.totalHalfSlots / HALF_UNITS_PER_DOT;
  const fillClass = live ? "bg-accent" : "bg-muted-2";
  const borderClass = live ? "border-accent" : "border-border";

  return (
    <span className={cn("flex shrink-0 gap-[5px]", className)}>
      {Array.from({ length: dotCount }, (_, i) => {
        const dotTaken = Math.min(Math.max(taken - i * HALF_UNITS_PER_DOT, 0), HALF_UNITS_PER_DOT);

        if (dotTaken === 0) {
          return <span key={i} className={cn("size-[9px] rounded-full border", borderClass)} />;
        }
        if (dotTaken === HALF_UNITS_PER_DOT) {
          return <span key={i} className={cn("size-[9px] rounded-full", fillClass)} />;
        }
        return (
          <span
            key={i}
            className={cn("relative size-[9px] overflow-hidden rounded-full border", borderClass)}
          >
            <span className={cn("absolute inset-y-0 left-0 w-1/2", fillClass)} />
          </span>
        );
      })}
    </span>
  );
}
