"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LiveDot } from "@/components/site/live-dot";
import { SlotDots } from "@/components/site/slot-dots";
import {
  formatQuincenaFree,
  formatQuincenaRange,
  freeUnits,
  type QuincenaAvailability,
  type QuincenaCapacidad,
} from "@/lib/capacityDisplay";
import { cn } from "@/lib/utils";
import type { Pack } from "@/lib/data/packs";

/** Cuántas quincenas (de las traídas por la página) se muestran como filas — igual que las 3
 * tandas del mock anterior, para no cambiar el peso visual del panel. */
const VISIBLE_ROWS = 3;

interface FloatingSlotsPanelProps {
  /**
   * Pack-detail pages swap the pill+sheet for a fixed bottom bar (design/project/
   * Responsive Mobile BWS.dc.html, 16f "ruta de pack") since the per-variant detail already
   * lives on the page. Everywhere else this stays false. Desktop is unaffected either way.
   */
  packMode?: boolean;
  /**
   * The pack in context, when there is one (product pages). Without it — Home, /packs, /stl,
   * /slider-system, /faq, legal pages — the "Reservar slot" CTA can't know which pack to send
   * someone to reserve, and the mock never closed an on-form pack picker, so it links to /packs
   * to choose first instead.
   */
  pack?: Pack;
  /** Siempre pasado por la página (Server Component) — este componente ya no hace fetch. */
  quincenas: QuincenaCapacidad[];
  /** Solo cuando packMode && pack — ya calculado una vez por la página, no se recalcula aquí. */
  availability?: QuincenaAvailability;
  className?: string;
}

export function FloatingSlotsPanel({
  packMode = false,
  pack,
  quincenas,
  availability,
  className,
}: FloatingSlotsPanelProps) {
  const currentQuincena = quincenas[0];
  return (
    <div className={className}>
      <DesktopPanel pack={pack} quincenas={quincenas} availability={availability} />
      {packMode ? (
        <MobileBar pack={pack} availability={availability} currentQuincena={currentQuincena} />
      ) : (
        <MobilePill quincenas={quincenas} currentQuincena={currentQuincena} />
      )}
    </div>
  );
}

function QuincenaRow({
  quincena,
  index,
  dense = false,
}: {
  quincena: QuincenaCapacidad;
  index: number;
  dense?: boolean;
}) {
  const live = index === 0;
  const units = freeUnits(quincena);
  return (
    <div
      className={cn(
        "flex items-center gap-3 border-b border-border-divider px-3.5",
        dense ? "py-2.5" : "py-[11px]"
      )}
    >
      <span
        className={cn(
          "shrink-0 font-mono text-xs font-medium tracking-[0.06em]",
          live ? "text-foreground" : "text-muted"
        )}
      >
        {formatQuincenaRange(quincena)}
      </span>
      <span
        className={cn(
          "flex-1 font-mono text-[11px] tracking-[0.1em]",
          live ? "text-accent" : "text-muted-2"
        )}
      >
        {live ? "PRÓXIMA ENTREGA" : "LISTA DE ESPERA"}
      </span>
      <span className={cn("font-mono text-[11.5px]", live ? "text-muted" : "text-muted-2")}>
        {formatQuincenaFree(units)}
      </span>
      <SlotDots fill={{ status: live ? "next" : "queued", totalHalfSlots: 2, freeHalfSlots: units }} />
    </div>
  );
}

/**
 * Same 3-state copy as AvailabilityCTA (design/chats/chat2.md:83, "cta_states") — the floating
 * panel's CTA has to coordinate with the page's own CTA per the closed brief
 * (design/chats/chat2.md:58), not always claim "Reservar slot" regardless of this pack's actual
 * availability. `availability` is always computed once by the parent page now (real Sanity data),
 * never recomputed here.
 */
function reserveLabel(availability: QuincenaAvailability): string {
  if (availability.status === "libre") {
    return `Reservar slot · ${formatQuincenaRange(availability.quincena)}`;
  }
  if (availability.status === "espera") {
    return "Entrar en lista de espera";
  }
  return "Avisarme cuando abra";
}

function ReserveButton({
  pack,
  availability,
  className,
}: {
  pack?: Pack;
  availability?: QuincenaAvailability;
  className?: string;
}) {
  return (
    <Link
      href={pack ? `/reserva/${pack.slug}` : "/packs"}
      className={cn(
        "flex h-12 items-center justify-center bg-accent text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover",
        className
      )}
    >
      {pack && availability ? reserveLabel(availability) : "Elegir pack para reservar"}
    </Link>
  );
}

/** ≥1024px: fixed panel, bottom-right, defaults open, collapsible to a small pill. */
function DesktopPanel({
  pack,
  quincenas,
  availability,
}: {
  pack?: Pack;
  quincenas: QuincenaCapacidad[];
  availability?: QuincenaAvailability;
}) {
  const [open, setOpen] = React.useState(true);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="fixed right-8 bottom-8 z-30 hidden w-[400px] border border-border-panel bg-surface-panel shadow-panel backdrop-blur-[10px] lg:block"
    >
      <div className="flex items-center justify-between border-b border-border-hairline px-3.5 py-3">
        <div className="flex items-center gap-[9px] font-mono text-[11px] tracking-[0.14em] text-muted">
          <LiveDot />
          FABRICACIÓN EN VIVO
        </div>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            aria-label={open ? "Minimizar" : "Expandir"}
            className="text-muted-2 transition-colors hover:text-accent"
          >
            <ChevronDown className={cn("size-3.5 transition-transform", !open && "rotate-180")} />
          </button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div className="pt-1.5">
          {quincenas.slice(0, VISIBLE_ROWS).map((quincena, i) => (
            <QuincenaRow key={quincena._id} quincena={quincena} index={i} />
          ))}
        </div>
        <ReserveButton pack={pack} availability={availability} className="h-12 w-full" />
      </CollapsibleContent>
    </Collapsible>
  );
}

/** <1024px, everywhere except pack pages: pill that never fully closes; tap opens a sheet. */
function MobilePill({
  quincenas,
  currentQuincena,
}: {
  quincenas: QuincenaCapacidad[];
  currentQuincena: QuincenaCapacidad | undefined;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="fixed right-3.5 bottom-4 z-30 flex items-center gap-[9px] border border-border-panel bg-surface-panel px-3.5 py-[11px] shadow-panel backdrop-blur-[10px] lg:hidden"
        >
          <LiveDot />
          <span className="font-mono text-[11px] tracking-[0.1em] text-foreground">
            {currentQuincena
              ? `${formatQuincenaRange(currentQuincena)} · ${formatQuincenaFree(freeUnits(currentQuincena))}`
              : "SIN TANDA ABIERTA"}
          </span>
          <ChevronDown className="size-3.5 rotate-180 text-muted-2" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" showClose={false} className="border-t border-border-panel p-0">
        <SheetTitle className="sr-only">Fabricación en vivo</SheetTitle>
        <div className="flex items-center justify-between border-b border-border-hairline px-4 py-3">
          <div className="flex items-center gap-[9px] font-mono text-[11px] tracking-[0.14em] text-muted">
            <LiveDot />
            FABRICACIÓN EN VIVO
          </div>
          <SheetClose aria-label="Minimizar" className="text-muted-2 transition-colors hover:text-accent">
            <ChevronDown className="size-3.5" />
          </SheetClose>
        </div>
        {quincenas.slice(0, VISIBLE_ROWS).map((quincena, i) => (
          <QuincenaRow key={quincena._id} quincena={quincena} index={i} />
        ))}
        <ReserveButton className="h-[52px] w-full" />
      </SheetContent>
    </Sheet>
  );
}

/**
 * Short state label for the mobile bar's tight CTA width — same 3 states as `reserveLabel`, just
 * condensed (the full "Entrar en lista de espera" wording is the desktop/hero copy, closed in
 * design/chats/chat2.md:83; this shorter phrasing for the mobile bar isn't itself closed anywhere,
 * flagging it as my own call for the space constraint).
 */
function mobileReserveLabel(availability: QuincenaAvailability): string {
  if (availability.status === "libre") return "Reservar slot";
  if (availability.status === "espera") return "Lista de espera";
  return "Avisarme";
}

/** <1024px, pack-detail pages only: fixed bottom bar, no pill/sheet — detail's on the page. */
function MobileBar({
  pack,
  availability,
  currentQuincena,
}: {
  pack?: Pack;
  availability?: QuincenaAvailability;
  currentQuincena: QuincenaCapacidad | undefined;
}) {
  const quincenaEnEstado = availability?.status !== "cerrado" ? availability?.quincena : undefined;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-border-panel bg-surface-panel px-4 py-3 shadow-panel backdrop-blur-[10px] lg:hidden">
      <div className="flex-1">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] text-muted">
          <LiveDot />
          {quincenaEnEstado ? formatQuincenaRange(quincenaEnEstado) : "SIN TANDA ABIERTA"}
        </div>
        <div className="mt-1 font-mono text-[11.5px] text-accent">
          {!availability &&
            (currentQuincena
              ? `${formatQuincenaRange(currentQuincena)} · ${formatQuincenaFree(freeUnits(currentQuincena))}`
              : "SIN TANDA ABIERTA")}
          {availability?.status === "libre" && "SLOT DISPONIBLE"}
          {availability?.status === "espera" && "TANDA COMPLETA · EN COLA"}
          {availability?.status === "cerrado" && "SIN SLOTS ESTE MES"}
        </div>
      </div>
      <Link
        href={pack ? `/reserva/${pack.slug}` : "/packs"}
        className="flex h-12 shrink-0 items-center justify-center bg-accent px-5 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover"
      >
        {pack && availability ? mobileReserveLabel(availability) : "Elegir pack"}
      </Link>
    </div>
  );
}
