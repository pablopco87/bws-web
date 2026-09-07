import type { Pack } from "@/lib/data/packs";

export type TandaStatus = "next" | "queued";

export interface Tanda {
  number: number;
  status: TandaStatus;
  /**
   * Capacity in half-slot units — the smallest unit any physical pack consumes. A full slot
   * (Tournament) costs 2; every other physical pack costs 1. Matches the floating panel's own
   * two-dot-per-tanda convention used everywhere in the design (Inicio, Tournament, Packs, STL).
   */
  totalHalfSlots: number;
  freeHalfSlots: number;
}

/** Mock manufacturing-capacity data. Replace with the real slots API once it exists. */
export const tandas: Tanda[] = [
  { number: 1, status: "next", totalHalfSlots: 2, freeHalfSlots: 1 },
  { number: 2, status: "queued", totalHalfSlots: 2, freeHalfSlots: 2 },
  { number: 3, status: "queued", totalHalfSlots: 2, freeHalfSlots: 2 },
];

export const nextTanda = tandas.find((t) => t.status === "next") ?? tandas[0];

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
