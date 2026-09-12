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
import { tandas, nextTanda } from "@/lib/data/slots";
import { cn } from "@/lib/utils";
import type { Pack } from "@/lib/data/packs";

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
  className?: string;
}

export function FloatingSlotsPanel({ packMode = false, pack, className }: FloatingSlotsPanelProps) {
  return (
    <div className={className}>
      <DesktopPanel pack={pack} />
      {packMode ? <MobileBar pack={pack} /> : <MobilePill />}
    </div>
  );
}

function TandaRow({ tanda, dense = false }: { tanda: (typeof tandas)[number]; dense?: boolean }) {
  const live = tanda.status === "next";
  return (
    <div
      className={cn(
        "flex items-center gap-3 border-b border-border-divider px-3.5",
        dense ? "py-2.5" : "py-[11px]"
      )}
    >
      <span
        className={cn(
          "w-[68px] shrink-0 font-mono text-xs font-medium tracking-[0.06em]",
          live ? "text-foreground" : "text-muted"
        )}
      >
        TANDA {String(tanda.number).padStart(2, "0")}
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
        {tanda.freeHalfSlots} {tanda.freeHalfSlots === 1 ? "libre" : "libres"}
      </span>
      <SlotDots tanda={tanda} />
    </div>
  );
}

function ReserveButton({ pack, className }: { pack?: Pack; className?: string }) {
  return (
    <Link
      href={pack ? `/reserva/${pack.slug}` : "/packs"}
      className={cn(
        "flex h-12 items-center justify-center bg-accent text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover",
        className
      )}
    >
      {pack
        ? `Reservar slot · Tanda ${String(nextTanda.number).padStart(2, "0")}`
        : "Elegir pack para reservar"}
    </Link>
  );
}

/** ≥1024px: fixed panel, bottom-right, defaults open, collapsible to a small pill. */
function DesktopPanel({ pack }: { pack?: Pack }) {
  const [open, setOpen] = React.useState(true);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="fixed right-8 bottom-8 z-30 hidden w-[372px] border border-border-panel bg-surface-panel shadow-panel backdrop-blur-[10px] lg:block"
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
          {tandas.map((tanda) => (
            <TandaRow key={tanda.number} tanda={tanda} />
          ))}
        </div>
        <ReserveButton pack={pack} className="h-12 w-full" />
      </CollapsibleContent>
    </Collapsible>
  );
}

/** <1024px, everywhere except pack pages: pill that never fully closes; tap opens a sheet. */
function MobilePill() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="fixed right-3.5 bottom-4 z-30 flex items-center gap-[9px] border border-border-panel bg-surface-panel px-3.5 py-[11px] shadow-panel backdrop-blur-[10px] lg:hidden"
        >
          <LiveDot />
          <span className="font-mono text-[11px] tracking-[0.1em] text-foreground">
            TANDA {String(nextTanda.number).padStart(2, "0")} · {nextTanda.freeHalfSlots}{" "}
            {nextTanda.freeHalfSlots === 1 ? "LIBRE" : "LIBRES"}
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
        {tandas.map((tanda) => (
          <TandaRow key={tanda.number} tanda={tanda} />
        ))}
        <ReserveButton className="h-[52px] w-full" />
      </SheetContent>
    </Sheet>
  );
}

/** <1024px, pack-detail pages only: fixed bottom bar, no pill/sheet — detail's on the page. */
function MobileBar({ pack }: { pack?: Pack }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-border-panel bg-surface-panel px-4 py-3 shadow-panel backdrop-blur-[10px] lg:hidden">
      <div className="flex-1">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] text-muted">
          <LiveDot />
          TANDA {String(nextTanda.number).padStart(2, "0")}
        </div>
        <div className="mt-1 font-mono text-[11.5px] text-accent">
          {nextTanda.freeHalfSlots} {nextTanda.freeHalfSlots === 1 ? "SLOT LIBRE" : "SLOTS LIBRES"}
        </div>
      </div>
      <Link
        href={pack ? `/reserva/${pack.slug}` : "/packs"}
        className="flex h-12 shrink-0 items-center justify-center bg-accent px-5 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover"
      >
        {pack ? "Reservar slot" : "Elegir pack"}
      </Link>
    </div>
  );
}
