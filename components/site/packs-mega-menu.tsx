import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { packs } from "@/lib/data/packs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Desktop mega-menu content for the "Packs" nav item — direction 9b from the header
 * exploration (design/chats/chat3.md): visual preview grid, one card per physical pack,
 * always all five, each with its slot-cost badge.
 */
export function PacksMegaMenu({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "border border-border-hairline bg-surface-dropdown shadow-dropdown backdrop-blur-md",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border-hairline px-6 py-3.5">
        <span className="font-mono text-[10px] tracking-[0.14em] text-muted-2">
          PACKS FÍSICOS · 5 VARIANTES
        </span>
        <Link
          href="/packs"
          className="group flex items-center gap-[7px] font-mono text-[10.5px] tracking-[0.12em] text-accent"
        >
          VER LOS 5 PACKS
          <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="grid grid-cols-5 gap-4 px-6 py-[22px]">
        {packs.map((pack) => (
          <Link
            key={pack.slug}
            href={`/packs/${pack.slug}`}
            className="group flex flex-col border border-border-hairline transition-[border-color,background] duration-[250ms] hover:border-accent hover:bg-surface-card-hover"
          >
            <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden border-b border-border-hairline bg-[image:repeating-linear-gradient(var(--color-mega-grid-line)_0_1px,transparent_1px_22px),repeating-linear-gradient(90deg,var(--color-mega-grid-line)_0_1px,transparent_1px_22px)]">
              <svg
                viewBox="0 0 200 140"
                className="h-2/3 w-auto opacity-[0.68]"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth={1.1}
              >
                {pack.icon.map((d, i) => (
                  <path key={i} d={d} />
                ))}
              </svg>
              <span className="absolute bottom-2 left-[9px] font-mono text-[8.5px] tracking-[0.12em] text-muted-3">
                RENDER PENDIENTE
              </span>
            </div>
            <div className="px-3.5 pt-[13px] pb-[15px]">
              <div className="text-sm font-medium text-foreground transition-colors group-hover:text-accent">
                {pack.name}
              </div>
              <Badge
                variant={pack.slotCost === "full" ? "slot-full" : "slot-half"}
                className="mt-[9px] text-[10px]"
              >
                {pack.slotCost === "full" ? "1 SLOT" : "1/2 SLOT"}
              </Badge>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
