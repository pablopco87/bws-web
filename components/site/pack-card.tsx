import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PhotoPlaceholder } from "@/components/site/photo-placeholder";
import { Badge } from "@/components/ui/badge";
import type { Pack } from "@/lib/data/packs";

/** Distributor-card image caption per pack — design/project/Packs BWS.dc.html (artboard 10a). */
const cardCaptions: Record<string, string> = {
  tournament: "MESA COMPLETA MONTADA",
  "battle-ready": "MEDIA MESA MONTADA",
  "ruined-buildings": "RUINAS EN L",
  "blockers-barricadas": "ACUEDUCTO Y BARRICADAS",
  "rubble-walls": "MUROS BAJOS",
};

/**
 * The pack teaser card — design/project/Packs BWS.dc.html (10a) and reused as the cross-selling
 * card on each product page (design/project/Packs BWS · Tournament.dc.html §07, which explicitly
 * calls out "mismo componente que el teaser de packs"). `size="large"` (16:9, mesa packs) vs.
 * `size="small"` (4:3) — the distributor page's own split between its two blocks.
 */
export function PackCard({ pack, size = "small" }: { pack: Pack; size?: "large" | "small" }) {
  const large = size === "large";
  return (
    <Link
      href={`/packs/${pack.slug}`}
      className="group flex flex-col border border-border-hairline p-6 transition-[border-color,background] duration-[250ms] hover:border-accent hover:bg-surface-card-hover lg:p-7"
    >
      <PhotoPlaceholder
        aspect={large ? "16/9" : "4/3"}
        label="RENDER PENDIENTE"
        caption={cardCaptions[pack.slug]}
      />
      <div className="mt-6 flex items-center justify-between gap-3">
        <div>
          <div
            className={
              large
                ? "text-[28px] font-semibold tracking-[-0.02em]"
                : "text-xl font-semibold tracking-[-0.02em]"
            }
          >
            {pack.name}
          </div>
          {large && (
            <div className="mt-1.5 font-mono text-[11px] tracking-[0.12em] text-muted-3">
              {pack.megaLabel}
            </div>
          )}
        </div>
        <Badge variant={pack.slotCost === "full" ? "slot-full" : "slot-half"} className="shrink-0">
          {pack.slotCost === "full" ? "1 SLOT" : "1/2 SLOT"}
        </Badge>
      </div>
      <p className="mt-4 text-[15px] leading-[1.6] text-muted">{pack.description}</p>
      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border-hairline pt-5">
        <DataField
          label="PIEZAS"
          value={pack.pieceCount ? String(pack.pieceCount).padStart(2, "0") : "—"}
        />
        <DataField label="PRECIO" value="—" />
        <DataField label="FABRICACIÓN" value="—" />
      </div>
      <span className="mt-6 inline-flex items-center gap-[7px] self-start border-b border-accent/32 text-sm text-accent transition-colors duration-200 group-hover:border-link-hover group-hover:text-link-hover">
        Ver ficha
        <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

function DataField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[9.5px] tracking-[0.12em] text-muted-3">{label}</div>
      <div className="mt-1 font-mono text-lg text-foreground">{value}</div>
    </div>
  );
}
