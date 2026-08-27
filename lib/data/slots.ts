export type TandaStatus = "next" | "queued";

export interface Tanda {
  number: number;
  status: TandaStatus;
  totalSlots: number;
  freeSlots: number;
}

/** Mock manufacturing-capacity data. Replace with the real slots API once it exists. */
export const tandas: Tanda[] = [
  { number: 1, status: "next", totalSlots: 2, freeSlots: 1 },
  { number: 2, status: "queued", totalSlots: 2, freeSlots: 2 },
  { number: 3, status: "queued", totalSlots: 2, freeSlots: 2 },
];

export const nextTanda = tandas.find((t) => t.status === "next") ?? tandas[0];
