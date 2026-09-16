import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getPackAvailability, nextTanda } from "@/lib/data/slots";
import type { Pack } from "@/lib/data/packs";

/**
 * The 3-state purchase CTA from the Tournament product hero (design/project/Packs BWS ·
 * Tournament.dc.html) — the only place all three states were fully written. State is derived
 * from the shared tanda pool (lib/data/slots.ts), not a per-pack boolean. No live payment yet:
 * all three states point at the same manual-contact route the floating panel already uses.
 */
export function AvailabilityCTA({ pack, className }: { pack: Pack; className?: string }) {
  const availability = getPackAvailability(pack);
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
              ? `Reservar slot · Tanda ${String(availability.tanda.number).padStart(2, "0")}`
              : "Entrar en lista de espera"}
          </Link>
        </Button>
      )}
      <p className="mt-3 font-mono text-[11px] tracking-[0.1em] text-muted-3 uppercase">
        {status === "libre" &&
          `Tanda ${String(availability.tanda.number).padStart(2, "0")} · entrega estimada [semana XX]`}
        {status === "espera" &&
          `Tanda ${String(nextTanda.number).padStart(2, "0")} completa · entrarías en tanda ${String(availability.tanda.number).padStart(2, "0")} · [semana XX]`}
        {status === "cerrado" && "Sin slots este mes · apertura de tandas el [día XX]"}
      </p>
    </div>
  );
}
