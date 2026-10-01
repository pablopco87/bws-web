import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  formatQuincenaRange,
  type QuincenaAvailability,
  type QuincenaCapacidad,
} from "@/lib/sanity/readCapacity";
import type { Pack } from "@/lib/data/packs";

/**
 * The 3-state purchase CTA from the Tournament product hero (design/project/Packs BWS ·
 * Tournament.dc.html) — the only place all three states were fully written. State comes from the
 * real Sanity capacity ledger now (lib/sanity/readCapacity.ts), computed once by the page and
 * passed down here — this component never fetches/computes availability itself, same pattern
 * already used by ReservaForm. No live payment yet: all three states point at the same
 * manual-contact route the floating panel already uses.
 */
export function AvailabilityCTA({
  pack,
  availability,
  currentQuincena,
  className,
}: {
  pack: Pack;
  availability: QuincenaAvailability;
  /** quincenas[0] from the same fetch — undefined only if the whole window came back empty. */
  currentQuincena: QuincenaCapacidad | undefined;
  className?: string;
}) {
  const { status } = availability;

  return (
    <div className={className}>
      {status === "cerrado" ? (
        <Button asChild variant="primary">
          <Link href={`/reserva/${pack.slug}`}>Avisarme cuando abra</Link>
        </Button>
      ) : (
        <Button asChild variant="solid">
          <Link href={`/reserva/${pack.slug}`}>
            {status === "libre"
              ? `Reservar slot · ${formatQuincenaRange(availability.quincena)}`
              : "Entrar en lista de espera"}
          </Link>
        </Button>
      )}
      <p className="mt-3 font-mono text-[11px] tracking-[0.1em] text-muted-3 uppercase">
        {status === "libre" &&
          `${formatQuincenaRange(availability.quincena)} · entrega estimada [semana XX]`}
        {status === "espera" &&
          currentQuincena &&
          `${formatQuincenaRange(currentQuincena)} completo · entrarías en ${formatQuincenaRange(availability.quincena)} · [semana XX]`}
        {status === "cerrado" && "Sin slots este mes · apertura de tandas el [día XX]"}
      </p>
    </div>
  );
}
