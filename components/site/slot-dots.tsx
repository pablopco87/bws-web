import { cn } from "@/lib/utils";

/**
 * Forma mínima que necesita SlotDots para pintar — desacoplada de dónde venga el dato (antes
 * Tanda del mock en lib/data/slots.ts, ahora una quincena real de Sanity mapeada a esta forma por
 * su llamador). El algoritmo de render no cambia: con totalHalfSlots=2 (una quincena = 1 unidad
 * completa, en pasos de 0,5) ya sabe pintar 1 punto vacío/medio/lleno sin tocarlo.
 */
export interface SlotFill {
  status: "next" | "queued";
  totalHalfSlots: number;
  freeHalfSlots: number;
}

/** One dot = one whole slot = 2 half-slot units. */
const HALF_UNITS_PER_DOT = 2;

/**
 * Three-state dot row: filled = slot fully occupied, half-filled = one half-slot booked within
 * that slot, outlined = fully available. Neutral/grey when `status` is "queued" (not the next one
 * up).
 */
export function SlotDots({ fill, className }: { fill: SlotFill; className?: string }) {
  const taken = fill.totalHalfSlots - fill.freeHalfSlots;
  const live = fill.status === "next";
  const dotCount = fill.totalHalfSlots / HALF_UNITS_PER_DOT;
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
