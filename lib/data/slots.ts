import type { Pack } from "@/lib/data/packs";

export type TandaStatus = "next" | "queued";

export interface Tanda {
  number: number;
  status: TandaStatus;
  /**
   * Capacity in half-slot units — the smallest unit any physical pack consumes. A tanda holds 2
   * full slots (1 tanda = 1 mes = 4 semanas; 1 slot = 15 días), so its capacity is 4 of these
   * units. A full slot (Tournament) costs 2; every other physical pack ("half", ~1 semana) costs
   * 1. Matches the floating panel's closed two-dot-per-tanda convention (design/chats/chat1.md:244)
   * — each dot represents one whole slot (2 of these units); see components/site/slot-dots.tsx for
   * how a single half-slot booking renders as a half-filled dot instead of jumping to a full one.
   */
  totalHalfSlots: number;
  freeHalfSlots: number;
}

/** Mock manufacturing-capacity data. Replace with the real slots API once it exists. */
export const tandas: Tanda[] = [
  { number: 1, status: "next", totalHalfSlots: 4, freeHalfSlots: 2 },
  { number: 2, status: "queued", totalHalfSlots: 4, freeHalfSlots: 4 },
  { number: 3, status: "queued", totalHalfSlots: 4, freeHalfSlots: 4 },
];

export const nextTanda = tandas.find((t) => t.status === "next") ?? tandas[0];

/**
 * Half-slot units are the internal capacity granularity, not what people should read — "3 libres"
 * means nothing to a visitor. Converts back to whole/half slots for display: "2 libres" (1 slot =
 * 1 unit), "1 libre", "1 y 1/2 libres", "1/2 libre".
 */
export function formatFreeSlots(freeHalfSlots: number): string {
  const wholeSlots = Math.floor(freeHalfSlots / 2);
  const hasHalf = freeHalfSlots % 2 === 1;

  if (wholeSlots === 0) return hasHalf ? "1/2 libre" : "0 libres";
  if (!hasHalf) return `${wholeSlots} ${wholeSlots === 1 ? "libre" : "libres"}`;
  return `${wholeSlots} y 1/2 libres`;
}

const HALF_SLOTS_PER_PACK: Record<Pack["slotCost"], number> = { full: 2, half: 1 };

export type PackAvailabilityStatus = "libre" | "espera" | "cerrado";

/** Discriminated on `status` so callers get a non-null `tanda` for "libre"/"espera" without a cast. */
export type PackAvailability =
  | { status: "libre" | "espera"; tanda: Tanda }
  | { status: "cerrado"; tanda: null };

/**
 * Derives a pack's purchase-flow state from the shared tanda pool — not a per-pack boolean.
 * Finds the earliest tanda with enough free half-slot units for this pack's cost: the "next"
 * tanda means "libre", a "queued" one means "espera", none at all means "cerrado".
 */
export function getPackAvailability(pack: Pick<Pack, "slotCost">): PackAvailability {
  const need = HALF_SLOTS_PER_PACK[pack.slotCost];
  const tanda = tandas.find((t) => t.freeHalfSlots >= need) ?? null;
  if (!tanda) return { status: "cerrado", tanda: null };
  return { status: tanda.status === "next" ? "libre" : "espera", tanda };
}
